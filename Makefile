#
# Process to generate the source data files
#
# gdrive must be set up beforehand ('brew install gdrive', then follow API key instructions)
#

# To set up required tools:
#   brew install gdrive gdal
#   npm install

# options are 110m, 50m, 10m
NE_RES=50m
NE=ne_$(NE_RES)_admin_0_countries

TMP=/tmp

BIN=node_modules/.bin

default: world/topography.json world/regions.csv world/flows.csv world/narrative.md world/results.csv

clean:
	rm $(TMP)/*.json \
	   $(TMP)/*.csv \
		 $(TMP)/*.csv \
		 world/*


# GDrive download

$(TMP)/Shapefile2.shp:
	gdrive download 0B8f3Y37Ixbgfd1F4Ym5OZU9JZkU --stdout > $@

$(TMP)/Shapefile2.shx:
	gdrive download 0B8f3Y37IxbgfMVp3UEdHb2c2SU0 --stdout > $@

# technically not necessary, but shapefile format requires the dbf file
$(TMP)/Shapefile2.dbf:
	gdrive download 0B8f3Y37Ixbgfd0FpeHJ0Z3h6Wmc --stdout > $@

$(TMP)/Shapefile2.prj:
	gdrive download 0B8f3Y37IxbgfanJ1eHo4QU0wbUE --stdout > $@

$(TMP)/fdimkts_allyears.csv:
	gdrive download 0B8f3Y37IxbgfaEE1SG1Pc0R3WW8 --stdout > $@

$(TMP)/file1.csv:
	gdrive download 0B8f3Y37IxbgfV0JHT3dUVUhuZkk --stdout > $@

# Natural Earth download

$(TMP)/$(NE).zip:
	curl -z $@ -o $@ http://naciscdn.org/naturalearth/$(NE_RES)/cultural/$(NE).zip

$(TMP)/$(NE)/%: $(TMP)/$(NE).zip
	unzip -u -d $(TMP)/$(NE) $<

# Extract layers from ESRI shapefiles

$(TMP)/Shapefile2_geo.json: $(TMP)/Shapefile2.shp $(TMP)/Shapefile2.shx $(TMP)/Shapefile2.dbf $(TMP)/Shapefile2.prj
	$(BIN)/shp2json -n $(TMP)/Shapefile2.shp \
	| $(BIN)/ndjson-map '(d.id = d.properties.OBJECTID, d.properties = { Region: d.properties.Region, Country: d.properties.Country }, d)' \
	| $(BIN)/geostitch -n > $@

$(TMP)/$(NE)_geo.json: $(TMP)/$(NE)/$(NE).shp
	$(BIN)/shp2json -n $< \
	| $(BIN)/ndjson-map '(d.id = d.properties.iso_n3, delete d.properties, d)' \
	| $(BIN)/geostitch -n > $@

# Merged region info: (a) extract stats from data/regions_countries.csv; (b) centroids calculated from Shapefile2

$(TMP)/regions_geo.json: $(TMP)/Shapefile2_geo.json
	$(BIN)/ndjson-filter '(d.id < 1550)' < $< > $@

$(TMP)/centroids.json: $(TMP)/regions_geo.json
	$(BIN)/ndjson-map -r d3=d3-geo '(coords = d3.geoCentroid(d), { id: d.id, lon: coords[0], lat: coords[1], region: d.properties.Region, country: d.properties.Country })' < $< > $@

world/regions.csv: data/regions_countries.csv $(TMP)/centroids.json
	$(BIN)/csv2json -n < $< \
	| $(BIN)/ndjson-map '({id: +d.geoid_r, allpat: +d.allpat, diff2: +d.diff2, impact: +d.impact, didAll: +d.didAll})' \
  | $(BIN)/ndjson-join 'd.id' - $(TMP)/centroids.json \
	| $(BIN)/ndjson-map '(Object.assign({}, d[0], d[1]))' \
	| $(BIN)/json2csv -n > $@


# Topojson, with three layers:  regions mesh (from Shapefile2), countries mesh (from Natural Earth), and land (Natural Earth)

world/topography.json: $(TMP)/regions_geo.json $(TMP)/$(NE)_geo.json
	$(BIN)/geo2topo -q 1e4 -n \
	     regions=$(TMP)/regions_geo.json \
			 countries=$(TMP)/$(NE)_geo.json \
		 | $(BIN)/topomerge land=countries \
		 | $(BIN)/topomerge --mesh -f 'a !== b' countries=countries \
		 | $(BIN)/topomerge --mesh -f 'a !== b' regions=regions \
		 | $(BIN)/toposimplify -F -p 0.02 - > $@

# Arcs, simplified

world/flows.csv: data/flows.csv
	$(BIN)/csv2json -n $< \
	  | $(BIN)/ndjson-map "(d.id = i, delete d['countrymode1'], d)" \
	  | $(BIN)/json2csv -n > $@


# Files not needing translation

world/%: data/%
	cp $< $@

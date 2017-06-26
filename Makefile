#
# Process to generate the source data files
#
# gdrive must be set up beforehand ('brew install gdrive', then follow API key instructions)
# topojson must be set up beforehand ('npm install topojson')
#

# To set up required tools:
#   brew install gdrive gdal
#   npm install topojson topojson-simplify

# options are 110m, 50m, 10m
NE_RES=50m
NE=ne_$(NE_RES)_admin_0_countries

TMP=/tmp

BIN=node_modules/.bin

default: data/topography.json

clean:
	rm $(TMP)/*.json \
	   $(TMP)/*.csv \
		 $(TMP)/*.csv \
		 data/topography.json

data/%: $(TMP)/%
	cp $< $@


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


# Topojson, with three layers:  regions (from Shapefile2), countries (from Natural Earth), and land (Natural Earth)

# can be exapanded to enforce the right hand rule for winding... however it appears later simplification produces
# winding artefacts anyway

#   ndjson-filter -r w=./js/util/winding '(w.enforce_rhr(d), d.id < 1550)' < $< > $@

$(TMP)/regions_geo.json: $(TMP)/Shapefile2_geo.json
	$(BIN)/ndjson-filter '(d.id < 1550)' < $< > $@

$(TMP)/topography_full.json: $(TMP)/regions_geo.json $(TMP)/$(NE)_geo.json
	$(BIN)/geo2topo -q 1e4 -n \
	     regions=$(TMP)/regions_geo.json \
			 countries=$(TMP)/$(NE)_geo.json \
		 | $(BIN)/topomerge land=countries \
		 > $@


# Simplification

$(TMP)/topography.json: $(TMP)/topography_full.json
	$(BIN)/toposimplify -F -p 0.02 $< > $@

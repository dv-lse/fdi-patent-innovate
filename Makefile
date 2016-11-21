#
# Process to generate the source data files
#
# gdrive must be set up beforehand ('brew install gdrive', then follow API key instructions)
# topojson must be set up beforehand ('npm install topojson')
#

# To set up required tools:
#   brew install gdrive gdal
#   npm install topojson topojson-simplify


TMP=/tmp

BIN=node_modules/.bin

default: data/regions_topo.json

clean:
	rm $(TMP)/*.json data/*.json

# GDrive download

$(TMP)/Shapefile2.shp:
	gdrive download 0B8f3Y37Ixbgfd1F4Ym5OZU9JZkU --stdout > $@

$(TMP)/Shapefile2.shx:
	gdrive download 0B8f3Y37IxbgfMVp3UEdHb2c2SU0 --stdout > $@

# technically not necessary, but shapefile format requires the dbf file
$(TMP)/Shapefile2.dbf:
	gdrive download 0B8f3Y37Ixbgfd0FpeHJ0Z3h6Wmc --stdout > $@

$(TMP)/regions_geo.json: $(TMP)/Shapefile2.shp $(TMP)/Shapefile2.shx $(TMP)/Shapefile2.dbf
	ogr2ogr -f GeoJSON -preserve_fid -select Region,Country -simplify 0.01 -lco COORDINATE_PRECISION=8 $@ $(TMP)/Shapefile2.shp
#shp2json -n $< \
#      | ndjson-map '(d.id = d.properties.OBJECTID, delete d.properties, d)' \
#      | geostitch -n \
#			 > $@
# NB simplify using ogr2ogr rather than toposimplify
#    because v8 buffers cannot handle files this size

# Topojson

$(TMP)/regions_topo.json: $(TMP)/regions_geo.json
	$(BIN)/geo2topo regions=$< | $(BIN)/toposimplify -p 1 -f | $(BIN)/topoquantize 1e5 > $@

# Copy to data directory

data/%.json: $(TMP)/%.json
	cp $< $@

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

default: data/topography.json data/regions_countries.csv

clean:
	rm $(TMP)/*.json $(TMP)/*.csv data/*.json data/*.csv

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


# Extract columns from patenting data

$(TMP)/regions_countries.csv: $(TMP)/file1.csv
	python3 scripts/regions_countries.py

# Extract layers from ESRI shapefile

# NB simplify using ogr2ogr rather than toposimplify
#    because v8 buffers cannot handle files this size

$(TMP)/countries_geo.json: $(TMP)/Shapefile2.shp $(TMP)/Shapefile2.shx $(TMP)/Shapefile2.dbf $(TMP)/Shapefile2.prj
	ogr2ogr -f GeoJSON -preserve_fid \
	        -sql 'select Country from Shapefile2 where Region is null order by OBJECTID' \
	        -lco COORDINATE_PRECISION=5 $@ $(TMP)/Shapefile2.shp

$(TMP)/regions_geo.json: $(TMP)/Shapefile2.shp $(TMP)/Shapefile2.shx $(TMP)/Shapefile2.dbf
	ogr2ogr -f GeoJSON -preserve_fid \
					-sql 'select Region, Country from Shapefile2 where Region is not null order by OBJECTID' \
					-simplify 0.0001 -lco COORDINATE_PRECISION=8 $@ $(TMP)/Shapefile2.shp


# Topojson

$(TMP)/topography_full.json: $(TMP)/regions_geo.json $(TMP)/countries_geo.json
	$(BIN)/geo2topo regions=$(TMP)/regions_geo.json countries=$(TMP)/countries_geo.json > $@

$(TMP)/topography.json: $(TMP)/topography_full.json
	$(BIN)/toposimplify -p 1 -f $< | $(BIN)/topoquantize 1e5 > $@

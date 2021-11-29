######################
global-web-viewer/data
######################
Scripts for processing global datasets to upload to Mapbox for hosting.

**************
Data processed
**************


===========
Raster data
===========
- sediment retention
- nitrogen retention
- nature access

===========
Vector data
===========

GADM 0/1 boundaries
*******************
GADM0 (national) and GADM1 (one admin unit lower than national) boundaries
were used to aggregate the ecosystem service rasters

Hydrobasin level 8
*******************
Hydrobasin level 8 boundaries were used to aggregate the ecosystem service
rasters

Coastal protection
*******************
The coastal protection raster was converted into a point vector. This point
vector was then used to aggregate and associate coastal protection values to
GADM0 (national) boundaries.

pixel-data/color-styling/\*.txt
*******************
Text files with color, value mapping for styling the final ecosystem service
maps.

**************
Scripts
**************
===========
calculate_raster_percentiles.py
===========
Create percentile rasters from the ecosystem service values. For each boundary
(GADM1, GADM0, Hydrobasins), create a raster where the pixels reflect the
percentile values in comparison to other pixels within the same boundary. This
is to allow global rasters to have more contrast when looking at these
different boundary scales.

===========
coastal_protection_aggregation.py
===========
Aggregate coastal protection values to the nearest GADM0 or GADM1 boundary.
Output is a vector of national or admin boundaries that have count, sum,
mean value from coastalprotection pixels that are nearest to boundary.

===========
combine-vector-attributes.py
===========
Given vectors with the same features, create a new vector with the
combination of all the attributes.

===========
merge_rasters.py
===========
Stitches together hydrobasin rasters from different regions.
hybas_zones = ['af', 'ar', 'as', 'au', 'eu', 'gr', 'na', 'sa', 'si']

===========
merge_vectors.py
===========
Merges together separate vectors of the same boundary format. An example
being merging separate national (gadm0) vectors into one global vector.

===========
reproject-raster-to-3857.py
===========
Reprojects raster to Mapbox preferred projection of 3857. It also calls
gdaldem_color_relief to create stylized (colored) rasters.

===========
reproject-vector-to-3857.py
===========
Reprojects vectors to Mapbox preferred projection of 3857.

===========
service-rasters-nodata-to-zero.py
===========
Replaces nodata for ES rasters that is on land to 0.0 and keeps water / ocean
values as nodata.

===========
setup.py
===========
Used to compile the cython file 'test_cp_agg_core.pyx'.

===========
test_cp_agg_core.pyx
===========
Given a coastal protection raster and a list of rasterized boundary vectors
with the same bounding box, find which coastal protection pixel is closest to
which boundary raster.

===========
upload-api.mapbox.sh
===========
Script for automating the upload process to Mapbox API for datasets that
exceeded the limit for UI upload. This script ended up being replaced by
using the Mapbox python upload API.

===========
zonal_stats.py
===========
Aggegrate ecosystem service rasters to GADM0, GADM1, and hydrobasin
vectors. For GADM1 and hydrobasins, computes the percentile of the mean
aggregated values within the national boundary. That is, for the mean
aggregated values of GADM1 and hydrobasins, the percentile is in comparison
with the mean value of other regions within the same country.

===========
gadm1-to-carmen-geojson.py
===========
Convert gadm1 vector to a Carmen Geojson formatted json file without geometry
but with bounding box. This output format was used in Mapbox local geocoder
so that only gadm1 results appeared in the search results.

===========
raster-to-rgb-cli.py
===========
A command line interface for converting a raster to a an rgb stylized raster.

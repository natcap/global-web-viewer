import os
import math
from osgeo import osr

import pygeoprocessing

#input_path = os.path.join(
#    'C', os.sep, 'Users', 'ddenu', 'Downloads', 
#    'realized_sedimentdeposition_nathab_md5_96c3424924c752e9b1f7ccfffe9b102a.tif')

input_path = os.path.join(
    'C', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
    'leaflet-tutorial', 'map-viewer', 'public', 'Base_Data', 'global_dem.tif')

out_path = os.path.join(
    'C', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
    'leaflet-tutorial', 'map-viewer', 'public', 'Base_Data',
    'global-dem', 'global_dem_3857.tif')

projection_srs = osr.SpatialReference()
projection_srs.ImportFromEPSG(3857)
projection_wkt = projection_srs.ExportToWkt()

pygeoprocessing.reproject_vector(input_path, projection_wkt, out_path)

import os
import sys
import shutil
import logging
import pickle
import time

from rtree import index
import shapely
import shapely.wkb
import shapely.speedups
from shapely.strtree import STRtree
from shapely.geometry import Polygon, Point, box

import numpy
from osgeo import gdal, ogr

import pygeoprocessing
import taskgraph

logging.basicConfig(
    level=logging.DEBUG,
    format=(
        '%(asctime)s (%(relativeCreated)d) %(levelname)s %(name)s'
        ' [%(funcName)s:%(lineno)d] %(message)s'),
    stream=sys.stdout)
LOGGER = logging.getLogger(__name__)

logging.getLogger('taskgraph').setLevel('INFO')

def global_degree_grid():
    """ """
    global_x_left = -180
    global_x_right = 180
    global_y_bottom = -90
    global_y_top = 90

    raster_deg_grid_size = 10
    poly_deg_grid_buffer = 5

    raster_grid_bboxes = []
    poly_grid_bboxes = []

    for start_x in range(global_x_left, global_x_right, raster_deg_grid_size):
        for start_y in range(global_y_bottom, global_y_top, raster_deg_grid_size):

            max_x = start_x + raster_deg_grid_size
            max_y = start_y + raster_deg_grid_size
            if max_x > global_x_right:
                max_x = global_x_right
            if max_y > global_y_top:
                max_y = global_y_top

            current_bbox = (start_x, start_y, max_x, max_y)

            raster_grid_bboxes.append(current_bbox)

            poly_min_x = start_x - poly_deg_grid_buffer
            poly_min_y = start_y - poly_deg_grid_buffer
            poly_max_x = max_x + poly_deg_grid_buffer
            poly_max_y = max_y + poly_deg_grid_buffer

            if poly_min_x < global_x_left:
                poly_min_x = global_x_left
            if poly_min_y < global_y_bottom:
                poly_min_y = global_y_bottom
            if poly_max_x > global_x_right:
                poly_max_x = global_x_right
            if poly_max_y > global_y_top:
                poly_max_y = global_y_top

            poly_grid_bboxes.append( (poly_min_x, poly_min_y, poly_max_x, poly_max_y) )

    return raster_grid_bboxes, poly_grid_bboxes

def process_coastal_protection(
        input_raster_path, input_vector_path, raster_bbox, vector_bbox,
        vector_id_attr, tmp_workspace):

    #clip vector to bbox
    vector = gdal.OpenEx(input_vector_path, gdal.OF_VECTOR)
    layer = vector.GetLayer()
    layer.SetSpatialFilterRect(*vector_bbox)

    #build rtree for vector geoms
    #rtree_path = os.path.join(tmp_workspace, '_rtree.dat')
    #rtree_base = os.path.splitext(rtree_path)[0]
    #if os.path.exists(rtree_path):
    #    for ext in ['.dat', '.idx']:
    #        os.remove(rtree_base + ext)

    id_to_attr = {}
    #file_idx = index.Index(rtree_base)
    feature_geom_list = []
    for feat in layer:
        fid = feat.GetFID()
        id_attr_value = feat.GetFieldAsString(vector_id_attr)
        geom = feat.GetGeometryRef()
        shapely_geom = shapely.wkb.loads(geom.ExportToWkb())
        clipped_geom = shapely_geom.intersection(box(*vector_bbox))
        simplified_geom = clipped_geom.simplify(0.1, preserve_topology=True)
        if simplified_geom.type == 'MultiPolygon':
            for sub_geom in simplified_geom.geoms:
                #file_idx.insert(fid, sub_geom.bounds)
                feature_geom_list.append(sub_geom)
                id_to_attr[id(sub_geom)] = id_attr_value
        else:
            #file_idx.insert(fid, shapely_geom.bounds)
            feature_geom_list.append(simplified_geom)
            id_to_attr[id(simplified_geom)] = id_attr_value

        feat = None

    if len(feature_geom_list) == 0:
        LOGGER.info(f"No boundaries intersected for {vector_bbox}")
        return None

    file_idx = STRtree(feature_geom_list)

    layer.ResetReading()

    #clip raster to bbox
    clipped_raster_path = os.path.join(tmp_workspace, f'clipped_raster.tif')
    if os.path.exists(clipped_raster_path):
        os.remove(clipped_raster_path)

    raster_info = pygeoprocessing.get_raster_info(input_raster_path)

    pygeoprocessing.align_and_resize_raster_stack(
        [input_raster_path], [clipped_raster_path], ['near'],
        raster_info['pixel_size'], raster_bbox)

    #for each raster pixel with value find nearest vector geom
    raster_info = pygeoprocessing.get_raster_info(clipped_raster_path)
    nodata = raster_info['nodata'][0]
    pixel_size = raster_info['pixel_size']
    bounding_box = raster_info['bounding_box']
    top_left = (bounding_box[0], bounding_box[3])

    stats_dict = {"no-nearest": []}
    #might be able to just to readAsArray from the raster_bbox
    for offset, array_block in pygeoprocessing.iterblocks((clipped_raster_path, 1)):
        valid_array = ~numpy.isclose(array_block, nodata)
        valid_idx = numpy.argwhere(valid_array == 1)

        for idx in valid_idx:
            idx_centroid = (
                top_left[0] + (offset['xoff'] + idx[1] + 0.5) * pixel_size[0],
                top_left[1] + (offset['yoff'] + idx[0] + 0.5) * pixel_size[1])

            nearest_geom = file_idx.nearest(Point(idx_centroid))
            if nearest_geom:
                id_geom = id(nearest_geom)
                id_val = id_to_attr[id_geom]
                if id_val not in stats_dict:
                    stats_dict[id_val] = {"count": 1, "sum": array_block[idx[0], idx[1]]}
                else:
                    stats_dict[id_val]["count"] += 1
                    stats_dict[id_val]["sum"] += array_block[idx[0], idx[1]]
            else:
                stats_dict["no-nearest"] = stats_dict["no-nearest"].append(idx_centroid)

    LOGGER.info(f"Done processing raster_bbox: {raster_bbox}")
    #return a dict like {vector_id_1: {count: x, sum: x}, vector_id_1: {count: x, sum: x}}
    #shutil.rmtree(tmp_workspace)
    return stats_dict

def stats_to_vector(
        base_vector_path, stats_pickle_path, vector_out_path, mean_attr):
    """Add zonal statistics to vector.

    Args:
        base_vector_path (string): path to a GDAL vector file. Used as the
            base for the output vector.
        stats_pickle_path (string): path to a pickled file containing 
            zonal statistics using ``pygeoprocessing.zonal_statistics``.
        vector_out_path (string): path to a GDAL vector file for the 
            output vector containin zonal stats.
        mean_attr (string): name of the feature field for saving the mean.

    Returns:
        None
    """
    LOGGER.debug("Add statistics to vector")
    base_vector_info = pygeoprocessing.get_vector_info(base_vector_path)

    base_vector = gdal.OpenEx(base_vector_path, gdal.OF_VECTOR)

    layer = base_vector.GetLayer(0)
    layer_dfn = layer.GetLayerDefn()

    # if this file already exists, then remove it
    if os.path.isfile(vector_out_path):
        os.remove(vector_out_path)

    # create a new shapefile from the orginal_datasource
    target_driver = ogr.GetDriverByName('GPKG')
    target_vector = target_driver.CreateDataSource(vector_out_path)
    target_vector.CopyLayer(layer, layer_dfn.GetName())

    number_features = layer.GetFeatureCount()
    LOGGER.debug(f"Base vector feature count: {number_features}")
    five_perc_counter = int(number_features * 0.05)

    target_layer = target_vector.GetLayer(0)
    number_features_target = target_layer.GetFeatureCount()
    LOGGER.debug(f"Target vector feature count: {number_features_target}")

    # Get the number of fields in original_layer
    original_field_count = layer_dfn.GetFieldCount()
    LOGGER.debug(f"Original field count: {original_field_count}")

    LOGGER.info("Loading stats")
    with open(stats_pickle_path, 'rb') as pickle_file:
        vector_stats = pickle.load(pickle_file)

    # Calculate mean
    for key, value in vector_stats.items():
        if value['count'] != 0.0:
            vector_stats[key][mean_attr] = value['sum'] / value['count']
        else:
            vector_stats[key][mean_attr] = 0.0

    vector_stats_keys = list(vector_stats.keys())
    target_field_idx_name_list = []
    for key in vector_stats[vector_stats_keys[0]].keys():
        target_field = ogr.FieldDefn(key, ogr.OFTReal)
        target_layer.CreateField(target_field)
        target_field_idx_name_list.append(
            (target_layer.FindFieldIndex(key, 1), key) )
    LOGGER.debug(f"target fields to be added: {target_field_idx_name_list}")

    target_layer_dfn = target_layer.GetLayerDefn()
    target_field_count = target_layer_dfn.GetFieldCount()
    LOGGER.debug(f"Target field count: {target_field_count}")
    # Copy all of the features in layer to the new shapefile
    last_time = time.time()
    target_layer.StartTransaction()
    error_count = 0
    perc_total = 0
    for feature_index, target_feature in enumerate(target_layer):
        last_time = pygeoprocessing._invoke_timed_callback(
            last_time, lambda: LOGGER.info(
                f'{(feature_index / number_features_target):.2f} processed'), 5.0)

        fid = target_feature.GetFID()

        for field_idx, field_name in target_field_idx_name_list:
            field_value = vector_stats[fid][field_name]
            if field_value is None:
                field_value = 0.0

            target_feature.SetField(field_idx, float(field_value))
        target_layer.SetFeature(target_feature)
        target_feature = None
    target_layer.CommitTransaction()
    if error_count > 0:
        LOGGER.debug(
            '%d features out of %d were unable to be transformed and are'
            ' not in the output vector at %s', error_count,
            layer.GetFeatureCount(), vector_out_path)
    layer = None
    target_layer = None
    base_vector = None
    target_vector = None

def pickle_zonal_stats(
        base_vector_path, base_raster_path, target_pickle_path):
    """Calculate Zonal Stats for a vector/raster pair and pickle result.

    Args:
        base_vector_path (str): path to vector file
        base_raster_path (str): path to raster file to aggregate over.
        target_pickle_path (str): path to desired target pickle file that will
            be a pickle of the pygeoprocessing.zonal_stats function.

    Returns:
        None.
    """
    LOGGER.info(
        f'Taking zonal statistics of {base_vector_path} over {base_raster_path}')
    zonal_stats = pygeoprocessing.zonal_statistics(
        (base_raster_path, 1), base_vector_path, polygons_might_overlap=False)
    with open(target_pickle_path, 'wb') as pickle_file:
        pickle.dump(zonal_stats, pickle_file)

def calculate_percentiles_to_vector(
    input_vector_path, target_vector_path, field_to_percentile,
    percentile_field_name):
    """Calculate percentiles.

    Args:
        input_vector_path (string):
        target_vector_path (string):
        field_to_percentile (string):
        percentile_field_name (string): name for the output percentile field

    Returns:
        None
    """
    LOGGER.debug("Add percentiles to vector")
    input_vector_info = pygeoprocessing.get_vector_info(input_vector_path)

    input_vector = gdal.OpenEx(input_vector_path, gdal.OF_VECTOR)
    input_layer = input_vector.GetLayer(0)
    input_layer_dfn = input_layer.GetLayerDefn()

    # if this file already exists, then remove it
    if os.path.isfile(target_vector_path):
        os.remove(target_vector_path)

    # create a new shapefile from the orginal_datasource
    target_driver = ogr.GetDriverByName('GPKG')
    target_vector = target_driver.CreateDataSource(target_vector_path)
    target_vector.CopyLayer(input_layer, input_layer_dfn.GetName())

    input_layer = None
    input_vector = None

    target_layer = target_vector.GetLayer(0)
    number_features_target = target_layer.GetFeatureCount()
    LOGGER.debug(f"Target vector feature count: {number_features_target}")
    five_perc_counter = int(number_features_target * 0.05)

    # Create new percentile field
    target_field = ogr.FieldDefn(percentile_field_name, ogr.OFTReal)
    target_layer.CreateField(target_field)

    target_layer_dfn = target_layer.GetLayerDefn()
    target_field_count = target_layer_dfn.GetFieldCount()
    LOGGER.debug(f"Target field count: {target_field_count}")

    country_means_dict = {}

    for feat in target_layer:
        country_name = feat.GetFieldAsString('ISO_SOV1')
        mean_value = feat.GetFieldAsDouble(field_to_percentile)

        if country_name in country_means_dict:
            country_means_dict[country_name].append(mean_value)
        else:
            country_means_dict[country_name] = [mean_value]

        feat = None

    target_layer.ResetReading()

    country_pctile_dict = {}
    for key, value in country_means_dict.items():
        percentile_groups = numpy.percentile(value, range(0, 100, 5))
        country_pctile_dict[key] = percentile_groups

    country_means_dict = None

    last_time = time.time()
    target_layer.StartTransaction()
    perc_total = 0
    for feat_index, feat in enumerate(target_layer):
        last_time = pygeoprocessing._invoke_timed_callback(
            last_time, lambda: LOGGER.info(
                f'{(feat_index / number_features_target):.2f} processed'), 5.0)

        country_name = feat.GetFieldAsString('ISO_SOV1')
        mean_value = feat.GetFieldAsDouble(field_to_percentile)

        pct_group = country_pctile_dict[country_name]
        LOGGER.debug(f"country name: {country_name}")
        LOGGER.debug(f"mean value: {mean_value}")
        LOGGER.debug(f"pct group: {pct_group}")

        pct_idx = numpy.where(mean_value <= pct_group)[0][0] * 5
        feat.SetField(percentile_field_name, float(pct_idx))

        target_layer.SetFeature(feat)
        feat = None

    target_layer.CommitTransaction()

    target_layer = None
    target_vector = None

if __name__ == "__main__":

    LOGGER.debug("Starting Coastal Protection Processing.")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data',
        'coastal_protection_stats_vectors')

    pickled_dir = os.path.join(output_root_dir, 'pickled-data')

    if not os.path.exists(output_root_dir):
        os.makedirs(output_root_dir)
    if not os.path.exists(pickled_dir):
        os.makedirs(pickled_dir)
    
    gadm_0_1_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'GADM36_levels_0_1',
        'GADM36_levels_0_1')

    gadm_0_path = os.path.join(gadm_0_1_directory, 'gadm36_0.shp')
    gadm_1_path = os.path.join(gadm_0_1_directory, 'gadm36_1.shp')


    coastal_prot_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Storm-Risk-Reduction',
        'realized_coastalprotection_md5_b8e0ec0c13892c2bf702c4d2d3e50536.tif')
    eez_vector_path = os.path.join(
        data_common_root_dir, 'boundaries', 'EEZ', 'World_EEZ_v11_20191118_gpkg',
        'eez_v11.gpkg')

    ### TaskGraph Set Up
    taskgraph_working_dir = os.path.join(
        output_root_dir, '_taskgraph_working_dir')

    n_workers = 5
    task_graph = taskgraph.TaskGraph(
        taskgraph_working_dir, n_workers, reporting_interval=60.0)
    ###

    global_grid_task = task_graph.add_task(
        func=global_degree_grid,
        args=(),
        target_path_list=[],
        store_result=True,
        task_name=f'global_grid_tupels_task')

    global_raster_pairs, global_poly_pairs = global_grid_task.get()

    coastal_task_match_list = []
    tmp_workspace_count = 0
    for raster_bbox, vector_bbox in zip(global_raster_pairs, global_poly_pairs):
        tmp_workspace = os.path.join(
            output_root_dir, f"test-algorithm-tmp-{tmp_workspace_count}")
        tmp_workspace_count += 1
        if not os.path.exists(tmp_workspace):
            os.makedirs(tmp_workspace)

        coastal_stats_task = task_graph.add_task(
            func=process_coastal_protection,
            args=(
                coastal_prot_path, gadm_1_path, raster_bbox, vector_bbox, 'GID_1',
                tmp_workspace),
            target_path_list=[],
            store_result=True,
            task_name=f'coastal_stats_task_{tmp_workspace_count}')
        coastal_task_match_list.append(coastal_stats_task)

    coastal_stats = coastal_stats_task.get()
    LOGGER.info(f"coastal stats: {coastal_stats}")

    task_graph.close()
    task_graph.join()

#    output_stat_dir = os.path.join(output_root_dir, f'eez_processed')
#    if not os.path.exists(output_stat_dir):
#        os.makedirs(output_stat_dir)
#
#    output_pickled_path_list = []
#    eez_basename = os.path.basename(eez_vector_path)
#    pickle_path = os.path.join(
#        pickled_dir,
#        os.path.splitext(eez_basename)[0] + f'_pickled.pickle')
#    output_pickled_path_list.append(pickle_path)
#
#    stats_task = task_graph.add_task(
#        func=pickle_zonal_stats,
#        args=(eez_vector_path, coastal_prot_path, pickle_path),
#        target_path_list=[pickle_path],
#        task_name=f'stat_eez_task')
#
#    output_vector_path = os.path.join(
#        output_stat_dir,
#        os.path.splitext(eez_basename)[0] + f'_stats.gpkg')
#
#    field_name = "cst_mean"
#    stats_to_vector_task = task_graph.add_task(
#        func=stats_to_vector,
#        args=(
#            eez_vector_path, pickle_path, output_vector_path,
#            field_name),
#        target_path_list=[output_vector_path],
#        dependent_task_list=[stats_task],
#        task_name=f'stat_to_eez_task')
#
#    percentile_field_name = "cst_pct"
#    output_perc_vector_path = os.path.join(
#        output_stat_dir,
#        os.path.splitext(eez_basename)[0] + f'_perc.gpkg')
#    percentile_to_vector_task = task_graph.add_task(
#        func=calculate_percentiles_to_vector,
#        args=(
#            output_vector_path, output_perc_vector_path, field_name,
#            percentile_field_name),
#        target_path_list=[output_perc_vector_path],
#        dependent_task_list=[stats_task, stats_to_vector_task],
#        task_name=f'perc_to_eez_task')
#
#    task_graph.close()
#    task_graph.join()

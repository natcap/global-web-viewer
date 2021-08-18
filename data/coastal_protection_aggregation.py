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

import test_cp_agg_core

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

    # Test U.S.
    #global_x_left = -130
    #global_x_right = -50
    #global_y_bottom = 10
    #global_y_top = 55

    raster_deg_grid_size = 10
    poly_deg_grid_buffer = 1

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
        vector_id_attr, tmp_workspace, target_pickle_path):

    if not os.path.exists(tmp_workspace):
        os.makedirs(tmp_workspace)

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
        with open(target_pickle_path, 'wb') as pickle_file:
            pickle.dump({"no-nearest": "no boundaries intersect"}, pickle_file)
        return

    file_idx = STRtree(feature_geom_list)

    layer.ResetReading()

    #clip raster to bbox
    clipped_raster_path = os.path.join(tmp_workspace, f'clipped_raster.tif')
    LOGGER.info(f"clipped path: {clipped_raster_path}")
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
    LOGGER.info("Run through iterblocks")
    for offset, array_block in pygeoprocessing.iterblocks((clipped_raster_path, 1)):
        valid_array = ~numpy.isclose(array_block, nodata)
        valid_idx = numpy.argwhere(valid_array == 1)

        if len(valid_idx) > 5000:
            LOGGER.info(f"number of valid pixels: {len(valid_idx)}")
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
                stats_dict["no-nearest"].append(idx_centroid)

    LOGGER.info(f"Done processing raster_bbox: {raster_bbox}")
    #return a dict like {vector_id_1: {count: x, sum: x}, vector_id_1: {count: x, sum: x}}
    #shutil.rmtree(tmp_workspace)
    LOGGER.info(f"rbbox: {raster_bbox} ; vbbox: {vector_bbox}")
    LOGGER.info(f"Stats dict: {stats_dict}")
    #return stats_dict
    with open(target_pickle_path, 'wb') as pickle_file:
        pickle.dump(stats_dict, pickle_file)


def process_coastal_protection_rasterize(
        input_raster_path, input_vector_path, raster_bbox, vector_bbox,
        vector_id_attr, tmp_workspace, target_pickle_path):

    if not os.path.exists(tmp_workspace):
        os.makedirs(tmp_workspace)

    #clip vector to bbox
    vector = gdal.OpenEx(input_vector_path, gdal.OF_VECTOR)
    layer = vector.GetLayer()
    layer_dfn = layer.GetLayerDefn()
    layer.SetSpatialFilterRect(*vector_bbox)

    vector_info = pygeoprocessing.get_vector_info(input_vector_path)

    ### Check that there are valid vector boundaries and raster pixels ###

    # check intersection of vector input and vector bbox. If not intersection
    # then nothing to do here
    feature_geom_list = []
    for feat in layer:
        fid = feat.GetFID()
        geom = feat.GetGeometryRef()
        shapely_geom = shapely.wkb.loads(geom.ExportToWkb())
        clipped_geom = shapely_geom.intersection(box(*vector_bbox))
        feature_geom_list.append(clipped_geom)

        feat = None

    if len(feature_geom_list) == 0:
        LOGGER.info(f"No boundaries intersected for {vector_bbox}")
        with open(target_pickle_path, 'wb') as pickle_file:
            pickle.dump({"no-nearest": "no boundaries intersect"}, pickle_file)
        return

    # tmp mask vector path from raster bbox
    temp_raster_mask_path = os.path.join(
        tmp_workspace, 'tmp_vector_mask_raster_bb.gpkg')
    if os.path.isfile(temp_raster_mask_path):
        os.remove(temp_raster_mask_path)

    raster_bb_geom = [shapely.geometry.box(*raster_bbox)]
    LOGGER.info(f"raster_bb_geom: {raster_bb_geom}")
    pygeoprocessing.shapely_geometry_to_vector(
        raster_bb_geom, temp_raster_mask_path, vector_info['projection_wkt'],
        'GPKG')

    stats_dict = pygeoprocessing.zonal_statistics(
        (input_raster_path, 1), temp_raster_mask_path, 
        polygons_might_overlap=False)

    LOGGER.info(f"zonal stats dict: {stats_dict}")
    if stats_dict[1]['count'] == 0:
        LOGGER.info(f"No valid raster pixels for {raster_bbox}")
        with open(target_pickle_path, 'wb') as pickle_file:
            pickle.dump({"no-pixels": "no non nodata pixels"}, pickle_file)
        return

    ### We have valid raster pixels and we have boundaries so continue ###

    # clipped out vector path
    clipped_vector_path = os.path.join(tmp_workspace, 'clipped_result.gpkg')
    if os.path.isfile(clipped_vector_path):
        os.remove(clipped_vector_path)

    # create a new shapefile from the orginal_datasource
    clip_driver = ogr.GetDriverByName('GPKG')
    clip_vector = clip_driver.CreateDataSource(clipped_vector_path)
    projection = osr.SpatialReference()
    projection.ImportFromWkt(vector_info['projection_wkt'])
    clip_vector.CreateLayer(
        layer_dfn.GetName(), srs=projection, geom_type=layer_dfn.GetGeomType())
    clip_result_layer = clip_vector.GetLayer()

    # tmp mask method vector path
    temp_mask_path = os.path.join(tmp_workspace, 'tmp_vector_mask.gpkg')
    if os.path.isfile(temp_mask_path):
        os.remove(temp_mask_path)

    bounding_box_geom = [shapely.geometry.box(*vector_bbox)]
    pygeoprocessing.shapely_geometry_to_vector(
        bounding_box_geom, temp_mask_path, vector_info['projection_wkt'],
        'GPKG')
    temp_mask_vector = gdal.OpenEx(temp_mask_path, gdal.OF_VECTOR)
    temp_mask_layer = temp_mask_vector.GetLayer()

    layer.Clip(temp_mask_layer, clip_result_layer)

    layer = None
    temp_mask_layer = None
    vector = None
    temp_mask_vector = None

    raster_info = pygeoprocessing.get_raster_info(input_raster_path)
    pixel_size = raster_info['pixel_size']
    # origin should be top left, so min_x, max_y
    origin = (vector_bbox[0], vector_bbox[3])
    target_x_size = int(abs(
        float(vector_bbox[2] - vector_bbox[0]) / pixel_size[0]))
    target_y_size = int(abs(
        float(vector_bbox[3] - vector_bbox[1]) / pixel_size[1]))
    new_raster_array = numpy.zeros((target_y_size, target_x_size))
    rasterize_nodata = -999.9

    distance_transform_raster_list = []
    dist_trans_id_list = []
    dist_trans_name_list = []
    for feat in clip_result_layer:
        id_val = feat.GetFieldAsInteger('idMap')
        name_val = feat.GetFieldAsString('GID_1')
        rasterize_path = os.path.join(tmp_workspace, f"rasterize_{id_val}.tif")

        pygeoprocessing.numpy_array_to_raster(
            new_raster_array, rasterize_nodata, pixel_size, origin,
            raster_info['projection_wkt'], rasterize_path)

        pygeoprocessing.rasterize(
            clipped_vector_path, rasterize_path,
            option_list=["ATTRIBUTE=idMap"], where_clause=f"idMap={id_val}")

        distance_transform_path = os.path.join(
            tmp_workspace, f"dist_trans_{id_val}.tif")
        pygeoprocessing.distance_transform_edt(
            (rasterize_path, 1), distance_transform_path)

        distance_transform_raster_list.append(distance_transform_path)
        dist_trans_id_list.append(id_val)
        dist_trans_name_list.append(name_val)

    clip_result_layer = None
    clip_vector = None

    # clip raster to bbox
    clipped_raster_path = os.path.join(tmp_workspace, f'clipped_raster.tif')
    LOGGER.info(f"clipped path: {clipped_raster_path}")
    if os.path.exists(clipped_raster_path):
        os.remove(clipped_raster_path)

    raster_info = pygeoprocessing.get_raster_info(input_raster_path)

    pygeoprocessing.align_and_resize_raster_stack(
        [input_raster_path], [clipped_raster_path], ['near'],
        raster_info['pixel_size'], raster_bbox)

    # Align distance transform rasters with clipped cv raster
    aligned_dist_trans_list = [
        f"{os.path.splitext(x)[0]}_aligned.tif" for x in distance_transform_raster_list]
    aligned_clipped_raster_path = os.path.join(
        tmp_workspace, f'clipped_raster_aligned.tif')

    clipped_and_dist_trans_list = [
        clipped_raster_path, *distance_transform_raster_list]
    aligned_clipped_dist_trans_list = [
        aligned_clipped_raster_path, *aligned_dist_trans_list]
    pygeoprocessing.align_and_resize_raster_stack(
        clipped_and_dist_trans_list, aligned_clipped_dist_trans_list,
        ['near'] * len(clipped_and_dist_trans_list),
        raster_info['pixel_size'], 'union')

    #for each raster pixel with value find nearest vector geom
    raster_info = pygeoprocessing.get_raster_info(clipped_raster_path)
    nodata = raster_info['nodata'][0]
    pixel_size = raster_info['pixel_size']
    bounding_box = raster_info['bounding_box']
    top_left = (bounding_box[0], bounding_box[3])

    stats_dict = {"no-nearest": []}
    #id_to_name = {value: key for key, value in attr_id_map.items()}

    #might be able to just to readAsArray from the raster_bbox
    stats_dict = test_cp_agg_core.find_close(
        aligned_clipped_raster_path, aligned_dist_trans_list,
        dist_trans_name_list, dist_trans_id_list)

    LOGGER.info(f"Done processing raster_bbox: {raster_bbox}")
    #return a dict like {vector_id_1: {count: x, sum: x}, vector_id_1: {count: x, sum: x}}
    #shutil.rmtree(tmp_workspace)
    LOGGER.info(f"rbbox: {raster_bbox} ; vbbox: {vector_bbox}")
    LOGGER.info(f"Stats dict: {stats_dict}")
    #return stats_dict
    with open(target_pickle_path, 'wb') as pickle_file:
        pickle.dump(stats_dict, pickle_file)


def admin_unique_identifiers(vector_path, vector_id_attr, vector_out_path):
    """ """
    vector = gdal.OpenEx(vector_path, gdal.OF_VECTOR)
    layer = vector.GetLayer()
    layer_dfn = layer.GetLayerDefn()

    hash_id_map = {}
    count = 1
    for feat in layer:
        fid = feat.GetFID()
        id_attr_value = feat.GetFieldAsString(vector_id_attr)
        if id_attr_value not in hash_id_map:
            hash_id_map[id_attr_value] = count
            count += 1

        feat = None

    # if this file already exists, then remove it
    if os.path.isfile(vector_out_path):
        os.remove(vector_out_path)

    # create a new shapefile from the orginal_datasource
    target_driver = ogr.GetDriverByName('GPKG')
    target_vector = target_driver.CreateDataSource(vector_out_path)
    target_vector.CopyLayer(layer, layer_dfn.GetName())
    target_layer = target_vector.GetLayer(0)

    target_field = ogr.FieldDefn('idMap', ogr.OFTInteger)
    target_layer.CreateField(target_field)

    fld_idx = target_layer.FindFieldIndex('idMap', 1)
    # Copy all of the features in layer to the new shapefile
    target_layer.StartTransaction()
    for feature_index, target_feature in enumerate(target_layer):
        fid = target_feature.GetFID()
        id_attr_value = target_feature.GetFieldAsString(vector_id_attr)

        target_feature.SetField(fld_idx, hash_id_map[id_attr_value])
        target_layer.SetFeature(target_feature)
        target_feature = None
    target_layer.CommitTransaction()

    layer = None
    vector = None
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

    n_workers = -1
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

    copied_gadm_path = os.path.join(output_root_dir, 'gadm_id_hash.gpkg')
    if os.path.isfile(copied_gadm_path):
        os.remove(copied_gadm_path)

    hash_country_task = task_graph.add_task(
        func=admin_unique_identifiers,
        args=(gadm_1_path, 'GID_1', copied_gadm_path),
        target_path_list=[copied_gadm_path],
        task_name=f'admin_unique_id_task')

    output_pickled_path_list = []
    coastal_task_match_list = []
    tmp_workspace_count = 0
    for raster_bbox, vector_bbox in zip(global_raster_pairs, global_poly_pairs):
        tmp_workspace = os.path.join(
            output_root_dir, f"test-algorithm-tmp-{tmp_workspace_count}")
        pickle_path = os.path.join(
            tmp_workspace, f'stats_pickled_{tmp_workspace_count}.pickle')
        output_pickled_path_list.append(pickle_path)

#        coastal_stats_task = task_graph.add_task(
#            func=process_coastal_protection,
#            args=(
#                coastal_prot_path, gadm_1_path, raster_bbox, vector_bbox, 'GID_1',
#                tmp_workspace, pickle_path),
#            target_path_list=[pickle_path],
#            task_name=f'coastal_stats_task_{tmp_workspace_count}')
#        coastal_task_match_list.append(coastal_stats_task)

        coastal_stats_task = task_graph.add_task(
            func=process_coastal_protection_rasterize,
            args=(
                coastal_prot_path, copied_gadm_path, raster_bbox, vector_bbox,
                'GID_1', tmp_workspace, pickle_path),
            target_path_list=[pickle_path],
            task_name=f'coastal_stats_task_{tmp_workspace_count}')
        coastal_task_match_list.append(coastal_stats_task)

        tmp_workspace_count += 1

    task_graph.close()
    task_graph.join()
    #coastal_stats = coastal_stats_task.get()
    #LOGGER.info(f"coastal stats: {coastal_stats}")


import os
import sys
import time
import logging
import numpy
import pickle
from rtree import index
import shapely
import shapely.wkb
import shapely.speedups

from osgeo import gdal, osr, ogr

import pygeoprocessing
import taskgraph

logging.basicConfig(
    level=logging.DEBUG,
    format=(
        '%(asctime)s (%(relativeCreated)d) %(levelname)s %(name)s'
        ' [%(funcName)s:%(lineno)d] %(message)s'),
    stream=sys.stdout)
LOGGER = logging.getLogger(__name__)

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
    target_layer = target_vector.GetLayer(0)
    number_features_target = target_layer.GetFeatureCount()

    layer = None
    base_vector = None

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
    for feature_index, target_feature in enumerate(target_layer):
        last_time = pygeoprocessing._invoke_timed_callback(
            last_time, lambda: LOGGER.info(
                f'{(feature_index / number_features_target):.2f} processed'), 30.0)

        fid = target_feature.GetFID()

        for field_idx, field_name in target_field_idx_name_list:
            field_value = vector_stats[fid][field_name]
            if field_value is None:
                field_value = 0.0

            target_feature.SetField(field_idx, float(field_value))
        target_layer.SetFeature(target_feature)
        target_feature = None
    target_layer.CommitTransaction()

    target_layer = None
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

def build_vector_path_list(vector_directory):
    """Walk a directory and return GDAL vector paths."""
    vector_list = []
    for file in os.listdir(vector_directory):
        if file.endswith(".shp"):
            vector_list.append(os.path.join(vector_directory, file))
        if file.endswith(".gpkg"):
            vector_list.append(os.path.join(vector_directory, file))

    return vector_list

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

    # Create new percentile field
    target_field = ogr.FieldDefn(percentile_field_name, ogr.OFTReal)
    target_layer.CreateField(target_field)

    target_layer_dfn = target_layer.GetLayerDefn()
    target_field_count = target_layer_dfn.GetFieldCount()
    LOGGER.debug(f"Target field count: {target_field_count}")

    country_means_dict = {}

    for feat in target_layer:
        country_name = feat.GetFieldAsString('NAME_0')
        mean_value = feat.GetFieldAsDouble(field_to_percentile)

        if country_name in country_means_dict:
            country_means_dict[country_name].append(mean_value)
        else:
            country_means_dict[country_name] = [mean_value]

        feat = None

    target_layer.ResetReading()

    country_pctile_dict = {}
    for key, value in country_means_dict.items():
        percentile_groups = numpy.percentile(value, range(0, 105, 5))
        country_pctile_dict[key] = percentile_groups

    country_means_dict = None

    last_time = time.time()
    target_layer.StartTransaction()
    for feat_index, feat in enumerate(target_layer):
        last_time = pygeoprocessing._invoke_timed_callback(
            last_time, lambda: LOGGER.info(
                f'{(feat_index / number_features_target):.2f} processed'), 30.0)

        country_name = feat.GetFieldAsString('NAME_0')
        mean_value = feat.GetFieldAsDouble(field_to_percentile)

        pct_group = country_pctile_dict[country_name]

        pct_idx = numpy.where(mean_value <= pct_group)[0][0] * 5
        feat.SetField(percentile_field_name, float(pct_idx))

        target_layer.SetFeature(feat)
        feat = None

    target_layer.CommitTransaction()

    target_layer = None
    target_vector = None

def spatial_join_vector_attribute(
        input_vector_path, join_vector_path, target_vector_path,
        join_attribute):
    """Join vector attribute to input vector on spatial overlap.

    Creates a copy of ``input_vector_path`` to ``target_vector_path``.
    Adds ``join_attribute`` from ``join_vector_path`` to ``target_vector_path``
    based on majority overlap between features.

    Args:
        input_vector_path (string): path to a GDAL vector file. Used as the 
            base for the output and spatial joining.
        join_vector_path (string): path to a GDAL vector file with feature
            attribute ``join_attribute``.
        target_vector_path (string): path to a GDAL vector file for the
            output.
        join_attribute (string): attribute name to be joined to output.

    Returns:
        None
    """
    LOGGER.debug(f"Join {join_attribute} to vector.")
    input_vector_info = pygeoprocessing.get_vector_info(input_vector_path)

    join_vector = gdal.OpenEx(join_vector_path, gdal.OF_VECTOR)
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

    join_layer = join_vector.GetLayer(0)
    join_layer_dfn = join_layer.GetLayerDefn()

    number_join_features = join_layer.GetFeatureCount()
    LOGGER.debug(f"Join vector feature count: {number_join_features}")

    target_layer = target_vector.GetLayer(0)
    number_features_target = target_layer.GetFeatureCount()
    LOGGER.debug(f"Target vector feature count: {number_features_target}")
    five_perc_counter = int(number_features_target * 0.05)

    # Create new join field
    target_field = ogr.FieldDefn(join_attribute, ogr.OFTString)
    target_layer.CreateField(target_field)

    target_layer_dfn = target_layer.GetLayerDefn()
    target_field_count = target_layer_dfn.GetFieldCount()
    LOGGER.debug(f"Target field count: {target_field_count}")

    # Create rtree index from target features with their FIDs
    target_vector_basename = os.path.basename(target_vector_path)
    target_vector_dirname = os.path.dirname(target_vector_path)
    rtree_path = os.path.join(
        target_vector_dirname,
        os.path.splitext(target_vector_basename)[0] + '_rtree.dat')
    rtree_base = os.path.splitext(rtree_path)[0]
    if os.path.exists(rtree_path):
        for ext in ['.dat', '.idx']:
            os.remove(rtree_base + ext)

    file_idx = index.Index(rtree_base)
    for join_feat in join_layer:
        fid = join_feat.GetFID()
        join_name = join_feat.GetFieldAsString(join_attribute)
        join_geom = join_feat.GetGeometryRef()
        shapely_geom = shapely.wkb.loads(join_geom.ExportToWkb())
        if shapely_geom.type == 'MultiPolygon':
            for geom in shapely_geom.geoms:
                file_idx.insert(fid, geom.bounds)
        else:
            file_idx.insert(fid, shapely_geom.bounds)

        join_feat = None

    join_layer.ResetReading()

    target_layer.StartTransaction()
    last_time = time.time()
    for target_index, target_feat in enumerate(target_layer):
        last_time = pygeoprocessing._invoke_timed_callback(
            last_time, lambda: LOGGER.info(
                f'{(feat_index / number_features_target):.2f} processed'), 30.0)

        target_fid = target_feat.GetFID()
        target_geom = target_feat.GetGeometryRef()
        target_env = target_geom.GetEnvelope()
        target_bb = (target_env[0], target_env[2], target_env[1], target_env[3])
        target_geom_area_majority = target_geom.GetArea() / 2.0

        join_fid_intersections = list(file_idx.intersection(target_bb))
        unique_fid_list = []
        for fid in join_fid_intersections:
            if fid not in unique_fid_list:
                unique_fid_list.append(fid)

        join_name_largest = ''
        join_area_largest =  0
        field_set = False
        for join_fid in unique_fid_list:
            join_feature = join_layer.GetFeature(join_fid)
            join_geom = join_feature.GetGeometryRef()
            join_name = join_feature.GetFieldAsString(join_attribute)

            intersect_geom = target_geom.Intersection(join_geom)
            if intersect_geom:
                intersect_geom_area = intersect_geom.GetArea()
                if intersect_geom_area >= target_geom_area_majority:
                    target_feat.SetField(join_attribute, join_name)
                    field_set = True
                    break
                else:
                    if intersect_geom_area > join_area_largest:
                        join_name_largest = join_name
                        join_area_largest = intersect_geom_area
            join_feature = None

        if not field_set and join_area_largest > 0:
            target_feat.SetField(join_attribute, join_name_largest)
            field_set = True

        if not field_set:
            LOGGER.debug(f"ERROR: no country identified for watershed {target_fid}")

        target_layer.SetFeature(target_feat)
        target_feat = None

    target_layer.CommitTransaction()

    target_layer = None
    join_layer = None
    join_vector = None
    target_vector = None

    # Clean up rtree path files
    if os.path.exists(rtree_path):
        for ext in ['.dat', '.idx']:
            os.remove(rtree_base + ext)

if __name__ == "__main__":

    LOGGER.debug("Starting Processing")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data')

    if not os.path.exists(output_root_dir):
        os.makedirs(output_root_dir)

    #sed_retention_path = os.path.join(
    #    data_common_root_dir, 'pixel-data', 'Sediment-Retention',
    #    'realized_sedimentdeposition_nathab_md5_96c3424924c752e9b1f7ccfffe9b102a.tif')
    #nit_retention_path = os.path.join(
    #    data_common_root_dir, 'pixel-data', 'Nitrogen-Retention',
    #    'realized_nitrogenretention_nathab_md5_7656b23f9ad0eb1d55b18367bad00635.tif')
    sed_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'land_ocean_mask_workspace',
        'sed', 'sed_gadm36_0_clipped_nodata_mask.tif')
    nit_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'land_ocean_mask_workspace',
        'nit', 'nit_gadm36_0_clipped_nodata_mask.tif')
    nature_access_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Nature-Access',
        'realized_natureaccess10_nathab_md5_af07e76ecea7fb5be0fa307dc7ff4eed.tif')
    crop_pollination_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Realized-Crop-Pollination',
        'realized_pollination_nathab_md5_feab479b3d6bf25a928c355547c9d9ab.tif')

    gadm_0_1_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'GADM36_levels_0_1',
        'GADM36_levels_0_1')

    hydro_basin_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'HydroBASINS_levels6-9',
        'HydroBASINS_levels6-9')

    hydro_basin_country_directory = os.path.join(
        output_root_dir, 'hybas_country_lev08')

    gadm_0_path = os.path.join(
        gadm_0_1_directory, 'clipped_gadm36_0_antarctica',
        'gadm36_0_clipped.gpkg')
    gadm_1_path = os.path.join(
        gadm_0_1_directory, 'clipped_gadm36_1_antarctica',
        'gadm36_1_clipped.gpkg')

    ### TaskGraph Set Up
    taskgraph_working_dir = os.path.join(
        output_root_dir, '_stats_taskgraph_working_dir')

    n_workers = -1
    task_graph = taskgraph.TaskGraph(taskgraph_working_dir, n_workers)
    ###

    gadm_vector_paths = [gadm_0_path, gadm_1_path]
    #hydro_basin_paths_full = build_vector_path_list(hydro_basin_directory)
    hydro_basin_paths_full = build_vector_path_list(hydro_basin_country_directory)
    LOGGER.debug(f'gadm vector paths {gadm_vector_paths}')

    # Refine hydro files by level
    hydro_level = 'lev08'
    hydro_basin_paths = [x for x in hydro_basin_paths_full if hydro_level in x]
    LOGGER.debug(f'hydro basin paths {hydro_basin_paths}')

    input_raster_path_list = [
        sed_retention_path, nit_retention_path, nature_access_path,
        crop_pollination_path]
    raster_field_prefix_list = ['sed', 'nit', 'acc', 'crop']

    compute_country_join = False
    run_gadm = False
    run_hydro_basins = True

    if run_hydro_basins:
        for hydro_basin_path in hydro_basin_paths:
            hydro_basin_basename = os.path.basename(hydro_basin_path)
            if compute_country_join:
                # Map country to hydro basin
                output_hydro_country_path = os.path.join(
                    output_root_dir,
                    os.path.splitext(hydro_basin_basename)[0] + '_country.gpkg')

                country_attr = "NAME_0"
                map_country_to_hydro_task = task_graph.add_task(
                    func=spatial_join_vector_attribute,
                    args=(
                        hydro_basin_path, gadm_0_path, output_hydro_country_path,
                        country_attr),
                    target_path_list=[output_hydro_country_path],
                    task_name=f'map_country_to_{hydro_basin_basename[0:8]}_task')
                stats_dep_tasks = [map_country_to_hydro_task]
            else:
                output_hydro_country_path = hydro_basin_path
                stats_dep_tasks = []

            for input_raster_path, field_prefix in zip(input_raster_path_list, raster_field_prefix_list):
                if not field_prefix == 'sed':
                    continue
                output_stat_dir = os.path.join(
                    output_root_dir, 'hybas_stats_vectors',
                    f'hybas_{field_prefix}_processed_vectors')
                if not os.path.exists(output_stat_dir):
                    os.makedirs(output_stat_dir)

                pickle_path = os.path.join(
                    output_stat_dir,
                    os.path.splitext(hydro_basin_basename)[0] + f'_{field_prefix}_pickled.pickle')

                stats_task = task_graph.add_task(
                    func=pickle_zonal_stats,
                    args=(
                        output_hydro_country_path, input_raster_path, pickle_path),
                    target_path_list=[pickle_path],
                    dependent_task_list=stats_dep_tasks,
                    task_name=f'{hydro_basin_basename[0:8]}_{field_prefix}_stat_task')

                output_vector_path = os.path.join(
                    output_stat_dir,
                    os.path.splitext(hydro_basin_basename)[0] + f'_{field_prefix}_stats.gpkg')

                field_name = field_prefix + "_mean"
                stats_to_vector_task = task_graph.add_task(
                    func=stats_to_vector,
                    args=(
                        output_hydro_country_path, pickle_path, output_vector_path,
                        field_name),
                    target_path_list=[output_vector_path],
                    dependent_task_list=[stats_task],
                    task_name=f'stats_to_{hydro_basin_basename[0:8]}_{field_prefix}_task')

                output_perc_vector_path = os.path.join(
                    output_stat_dir,
                    os.path.splitext(hydro_basin_basename)[0] + f'_{field_prefix}_perc.gpkg')

                percentile_field_name = field_prefix + "_pct"
                percentile_to_vector_task = task_graph.add_task(
                    func=calculate_percentiles_to_vector,
                    args=(
                        output_vector_path, output_perc_vector_path, field_name,
                        percentile_field_name),
                    target_path_list=[output_perc_vector_path],
                    dependent_task_list=[stats_to_vector_task],
                    task_name=f'percentile_{hydro_basin_basename[0:8]}_{field_prefix}_task')

    if run_gadm:
        output_stat_dir = os.path.join(output_root_dir, f'gadm_stats_vectors')
        if not os.path.exists(output_stat_dir):
            os.mkdir(output_stat_dir)

        for gadm_vector_path in gadm_vector_paths:
            # gadm36_[0|1].shp
            gadm_basename = os.path.basename(gadm_vector_path)
            # gadm36_[0|1]
            gadm_type = os.path.splitext(gadm_basename)[0]
            output_stat_gadm_dir = os.path.join(
                output_stat_dir, f'{gadm_type}_stats')
            if not os.path.exists(output_stat_gadm_dir):
                os.mkdir(output_stat_gadm_dir)

            for input_raster_path, field_prefix in zip(input_raster_path_list, raster_field_prefix_list):
                pickle_path = os.path.join(
                    output_stat_gadm_dir,
                    f'{gadm_type}_{field_prefix}_pickled.pickle')

                stats_task = task_graph.add_task(
                    func=pickle_zonal_stats,
                    args=(gadm_vector_path, input_raster_path, pickle_path),
                    target_path_list=[pickle_path],
                    task_name=f'stat_{gadm_type}_task_{field_prefix}')

                output_vector_path = os.path.join(
                    output_stat_gadm_dir,
                    f'{gadm_type}_{field_prefix}_stats.gpkg')

                field_name = field_prefix + "_mean"
                stats_to_vector_task = task_graph.add_task(
                    func=stats_to_vector,
                    args=(
                        gadm_vector_path, pickle_path, output_vector_path,
                        field_name),
                    target_path_list=[output_vector_path],
                    dependent_task_list=[stats_task],
                    task_name=f'stat_to_{gadm_type}_task_{field_prefix}')

                percentile_field_name = field_prefix + "_pct"
                if 'gadm36_1' in gadm_vector_path:
                    output_perc_vector_path = os.path.join(
                        output_stat_gadm_dir,
                        f'{gadm_type}_{field_prefix}_perc.gpkg')
                    percentile_to_vector_task = task_graph.add_task(
                        func=calculate_percentiles_to_vector,
                        args=(
                            output_vector_path, output_perc_vector_path, field_name,
                            percentile_field_name),
                        target_path_list=[output_perc_vector_path],
                        dependent_task_list=[stats_task, stats_to_vector_task],
                        task_name=f'perc_to_gadm_task_{field_prefix}')

    task_graph.close()
    task_graph.join()

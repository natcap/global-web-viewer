import os
import shutil
import sys
import logging
import numpy
import json
import tempfile
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

logging.getLogger('taskgraph').setLevel('DEBUG')

#gdal.UseExceptions()

def create_percentile_rasters(
    base_raster_path, target_raster_path, percentile_list, working_dir):
    """Create a percentile raster.

    An attribute table is also constructed for the raster_dataset that displays
    the ranges provided by taking the quartile of values.

    Args:
        base_raster_path (str): path to a GDAL raster with data of type
            integer
        target_raster_path (str): path to the destination of the new raster.
        percentile_list (list): A list of the percentile ranges,
            ex: [25, 50, 75, 90].
        working_dir (string):

    Returns:
        None

    """
    LOGGER.info('Creating Percentile Rasters')
    temp_dir = tempfile.mkdtemp(dir=working_dir)

    # If the target_raster_path is already a file, delete it
    if os.path.isfile(target_raster_path):
        os.remove(target_raster_path)

    target_nodata = 255
    base_raster_info = pygeoprocessing.get_raster_info(base_raster_path)
    base_nodata = base_raster_info['nodata'][0]
    base_dtype = base_raster_info['datatype']

    # Get the percentile values for each percentile
    percentile_values = pygeoprocessing.raster_band_percentile(
        (base_raster_path, 1),
        os.path.join(temp_dir, 'percentile'),
        percentile_list)

    shutil.rmtree(temp_dir, ignore_errors=True)

    def raster_percentile(band):
        """Group the band pixels together based on percentiles."""
        valid_data_mask = (band != base_nodata)
        band[valid_data_mask] = numpy.searchsorted(
            percentile_values, band[valid_data_mask]) + 1
        band[~valid_data_mask] = target_nodata
        return band

    # Classify the pixels of raster_dataset into groups and write to output
    pygeoprocessing.raster_calculator(
        [(base_raster_path, 1)], raster_percentile, target_raster_path,
        gdal.GDT_Byte, target_nodata)

def get_unique_vector_attributes(input_vector_path, feature_attribute):
    """Return a list of unique values from the vector features field.

    Args:
        input_vector_path (string): path to a GDAL vector file.
        feature_attribute (string): attribute name to be compiled into list.

    Returns:
        A unique list of values.
    """
    LOGGER.debug(f"Get unique feature attributes.")

    input_vector = gdal.OpenEx(input_vector_path, gdal.OF_VECTOR)
    input_layer = input_vector.GetLayer(0)

    unique_list = []
    for feat in input_layer:
        feat_fid = feat.GetFID()
        feat_value = feat.GetFieldAsString(feature_attribute)
        if feat_value not in unique_list:
            unique_list.append((feat_value, feat_fid))

        feat = None

    input_layer = None
    input_vector = None

    return unique_list

def create_percentile_raster_from_vector_feature(
        input_raster_path, input_vector_path, output_raster_path,
        feature_info, attr_key, working_dir):
    """Clips a raster from a vector feature and creates a percentile raster.

    Args:
        input_raster_path (string): path to a GDAL vector file.
        input_vector_path (string): path to a GDAL vector file.
        output_raster_path (string):
        feature_info (tuple):
        attr_key (string):
        working_dir (string):

    Returns:
        None
    """
    raster_info = pygeoprocessing.get_raster_info(input_raster_path)
    input_vector = gdal.OpenEx(input_vector_path, gdal.OF_VECTOR)
    input_layer = input_vector.GetLayer(0)

    feature = input_layer.GetFeature(feature_info[1])
    feature_geom = feature.GetGeometryRef()
    envelope = feature_geom.GetEnvelope()
    feature_bb = [envelope[i] for i in [0, 2, 1, 3]]
    feature = None
    input_layer = None
    input_vector = None

    # Protect against the clipping feature bb being outside the extents of 
    # the raster.
    target_bb = pygeoprocessing.merge_bounding_box_list(
        [feature_bb, raster_info['bounding_box']], 'intersection')

    clipped_raster_path = os.path.join(
        working_dir, f'clipped_raster_{feature_info[0]}')

    vector_options = {
            'mask_vector_path': input_vector_path,
            'mask_vector_where_filter':f"{attr_key}='{feature_info[0]}'"
            }

    pygeoprocessing.align_and_resize_raster_stack(
        [input_raster_path], [clipped_raster_path], ['near'],
        raster_info['pixel_size'], target_bb,
        vector_mask_options=vector_options)

    percentile_list = list(range(0,100,1))

    create_percentile_rasters(
        clipped_raster_path, output_raster_path, percentile_list,
        working_dir)

    os.remove(clipped_raster_path)

def gdaldem_color_relief(input_raster_path, color_file_path, out_raster_path):
    """Conver input raster to a stylized RGB raster using gdaldem.

    Args:
        input_raster_path (string):
        color_file_path (string):
        out_raster_path (string):

    Returns:
        None
    """
    gdaldem_options = gdal.DEMProcessingOptions(
        colorFilename=color_file_path, format="GTiff", addAlpha=True,
        creationOptions=["COMPRESS=LZW"])
    gdal.DEMProcessing(
        out_raster_path, input_raster_path, "color-relief",
        options=gdaldem_options)

def stitch_rasters_wrapper(
        input_path_band_list, target_base_path, output_path):
    """ """
    raster_out_dtype = gdal.GDT_Byte
    target_nodata_list = [255]
    pygeoprocessing.new_raster_from_base(
        target_base_path, output_path, raster_out_dtype, target_nodata_list)

    resample_method_list = len(input_path_band_list) * ['near']

    pygeoprocessing.stitch_rasters(
        input_path_band_list, resample_method_list, (output_path, 1))

def build_vector_path_list(vector_directory):
    """Walk a directory and return GDAL vector paths."""
    vector_list = []
    for file in os.listdir(vector_directory):
        if file.endswith(".shp"):
            vector_list.append(os.path.join(vector_directory, file))
        if file.endswith(".gpkg"):
            vector_list.append(os.path.join(vector_directory, file))

    return vector_list

if __name__ == "__main__":

    LOGGER.debug("Starting calculate_raster_percentiles Processing.")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data')

    if not os.path.exists(output_root_dir):
        os.makedirs(output_root_dir)

    gadm_0_1_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'GADM36_levels_0_1',
        'GADM36_levels_0_1')

    hydro_basin_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'HydroBASINS_levels6-9',
        'HydroBASINS_levels6-9')

    hydro_basin_country_directory = os.path.join(
        output_root_dir, 'hybas_country_lev08')

    hydro_basin_paths = build_vector_path_list(hydro_basin_country_directory)
    hydro_basin_info_list = [
        (hybas_path, os.path.basename(hybas_path)[0:14], 'PFAF_ID') for hybas_path in hydro_basin_paths]

    gadm_0_path = os.path.join(gadm_0_1_directory, 'gadm36_0.shp')
    gadm_1_path = os.path.join(gadm_0_1_directory, 'gadm36_1.shp')
    gadm_vector_info_list = [
        (gadm_0_path, 'gadm0', 'GID_0'),
        (gadm_1_path, 'gadm1', 'GID_1')]

    sed_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Sediment-Retention',
        'realized_sedimentdeposition_nathab_md5_96c3424924c752e9b1f7ccfffe9b102a.tif')
    nit_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Nitrogen-Retention',
        'realized_nitrogenretention_nathab_md5_7656b23f9ad0eb1d55b18367bad00635.tif')
    grazing_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Grazing',
        'current_meat_revenue_per_ha_4c87c97694a88ee547a906a90d860b3d.tif')
    nature_access_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Nature-Access',
        'realized_natureaccess10_nathab_md5_af07e76ecea7fb5be0fa307dc7ff4eed.tif')
    crop_pollination_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Realized-Crop-Pollination',
        'realized_pollination_nathab_md5_feab479b3d6bf25a928c355547c9d9ab.tif')

    input_raster_path_list = [
        sed_retention_path, nit_retention_path, grazing_path, nature_access_path,
        crop_pollination_path]
    raster_service_id_list = ['sed', 'nit', 'graz', 'acc', 'crop']

    ### TaskGraph Set Up
    taskgraph_pct_dir = os.path.join(output_root_dir, 'taskgraph_pct')
    if not os.path.isdir(taskgraph_pct_dir):
        os.mkdir(taskgraph_pct_dir)
    taskgraph_working_dir = os.path.join(
        taskgraph_pct_dir, '_taskgraph_working_dir')

    n_workers = 3
    task_graph = taskgraph.TaskGraph(taskgraph_working_dir, n_workers)
    ###

    run_gadm = True
    run_hydro_basins = False
    run_global = False

    if run_gadm:
        # For each boundary feature
        for boundary_vector_path, boundary_identifier, boundary_field_attr in gadm_vector_info_list:
            # Get unique attribute for each boundary feature
            unique_boundary_names = get_unique_vector_attributes(
                boundary_vector_path, boundary_field_attr)
            LOGGER.debug(
                f"Number of {boundary_identifier} features is {len(unique_boundary_names)}")
            for input_raster_path, service_id in zip(
                    input_raster_path_list, raster_service_id_list):
                percentile_service_out_dir = os.path.join(
                    output_root_dir, 'gadm_pct_rasters', f'{service_id}',
                    f'{service_id}_{boundary_identifier}_pct_rasters')
                if not os.path.exists(percentile_service_out_dir):
                    os.makedirs(percentile_service_out_dir)

                intermediate_dir = os.path.join(
                    percentile_service_out_dir, f'percentile_{service_id}_temp')
                if not os.path.exists(intermediate_dir):
                    os.makedirs(intermediate_dir)

                stitch_path_band_list = []
                pct_task_list = []
                for idx, feat_info in enumerate(unique_boundary_names):
                    attr_name = feat_info[0]
                    #if "NGA.32_1" in attr_name:
                    #if "COD" in attr_name or "USA" in attr_name or "SDN" in attr_name:
                    raster_percentile_path = os.path.join(
                        percentile_service_out_dir,
                        f'{service_id}_{attr_name}_percentile.tif')
                    # Clip raster to boundary and calculate percentile
                    individual_pct_task = task_graph.add_task(
                        func=create_percentile_raster_from_vector_feature,
                        args=(
                            input_raster_path, boundary_vector_path, raster_percentile_path,
                            feat_info, boundary_field_attr, intermediate_dir),
                        target_path_list=[raster_percentile_path],
                        task_name=f'{service_id}_{attr_name}_percentile_task',
                        dependent_task_list=[])

                    # Currently a bad raster from Nature Access and ATA so 
                    # don't try to stitch it in
                    if service_id == 'acc' and 'ATA' in raster_percentile_path:
                        continue

                    stitch_path_band_list.append((raster_percentile_path, 1))
                    pct_task_list.append(individual_pct_task)

                # Merge individual pct rasters into one
                stitched_pct_out_path = os.path.join(
                    output_root_dir, 'gadm_pct_rasters', f'{service_id}',
                    f'{service_id}_{boundary_identifier}_pct_stitched.tif')

                stitch_percentiles_task = task_graph.add_task(
                    func=stitch_rasters_wrapper,
                    args=(
                        stitch_path_band_list, input_raster_path,
                        stitched_pct_out_path),
                    target_path_list=[stitched_pct_out_path],
                    task_name=f'{service_id}_{boundary_identifier}_stitch_task',
                    dependent_task_list=pct_task_list)

                task_graph.join()

    if run_hydro_basins:
        # For each boundary feature
        for input_raster_path, service_id in zip(input_raster_path_list, raster_service_id_list):
            stitch_global_path_band_list = []
            for boundary_vector_path, boundary_identifier, boundary_field_attr in hydro_basin_info_list:
                # Get unique attribute for each boundary feature
                unique_boundary_names = get_unique_vector_attributes(
                    boundary_vector_path, boundary_field_attr)
                LOGGER.debug(
                    f"Number of {boundary_identifier} features is {len(unique_boundary_names)}")

                percentile_service_out_dir = os.path.join(
                    output_root_dir, 'hybas_pct_rasters', f'{service_id}',
                    f'{service_id}_{boundary_identifier}_pct_rasters')
                if not os.path.exists(percentile_service_out_dir):
                    os.makedirs(percentile_service_out_dir)

                intermediate_dir = os.path.join(
                    percentile_service_out_dir,
                    f'percentile_{service_id}_temp')
                if not os.path.exists(intermediate_dir):
                    os.makedirs(intermediate_dir)

                stitch_path_band_list = []
                pct_task_list = []
                for idx, feat_info in enumerate(unique_boundary_names):
                    attr_name = feat_info[0]

                    raster_percentile_path = os.path.join(
                        percentile_service_out_dir,
                        f'{service_id}_{attr_name}_percentile.tif')
                    # Clip raster to boundary and calculate percentile
                    individual_pct_task = task_graph.add_task(
                        func=create_percentile_raster_from_vector_feature,
                        args=(
                            input_raster_path, boundary_vector_path, raster_percentile_path,
                            feat_info, boundary_field_attr, intermediate_dir),
                        target_path_list=[raster_percentile_path],
                        task_name=f'{service_id}_{attr_name}_percentile_task',
                        dependent_task_list=[])

                    stitch_path_band_list.append((raster_percentile_path, 1))
                    pct_task_list.append(individual_pct_task)

                # Merge individual pct rasters into one
                stitched_pct_out_path = os.path.join(
                    output_root_dir, 'hybas_pct_rasters', f'{service_id}',
                    f'{service_id}_{boundary_identifier}_pct_stitched.tif')

                stitch_percentiles_task = task_graph.add_task(
                    func=stitch_rasters_wrapper,
                    args=(
                        stitch_path_band_list, input_raster_path,
                        stitched_pct_out_path),
                    target_path_list=[stitched_pct_out_path],
                    task_name=f'{service_id}_{boundary_identifier}_stitch_task',
                    dependent_task_list=pct_task_list)

                stitch_global_path_band_list.append((stitched_pct_out_path, 1))

                task_graph.join()

            # Merge hybro basin zones into one global raster
            stitched_pct_global_out_path = os.path.join(
                output_root_dir, 'hybas_pct_rasters', f'{service_id}',
                f'{service_id}_hybas_lev08_pct_stitched.tif')

            stitch_global_percentiles_task = task_graph.add_task(
                func=stitch_rasters_wrapper,
                args=(
                    stitch_global_path_band_list, input_raster_path,
                    stitched_pct_global_out_path),
                target_path_list=[stitched_pct_global_out_path],
                task_name=f'{service_id}_global_stitch_task',
                dependent_task_list=[stitch_percentiles_task])

    if run_global:
        for input_raster_path, service_id in zip(
                input_raster_path_list, raster_service_id_list):

            percentile_service_out_dir = os.path.join(
                output_root_dir, 'global_pct_rasters', f'{service_id}')
            if not os.path.isdir(percentile_service_out_dir):
                os.makedirs(percentile_service_out_dir)

            intermediate_dir = os.path.join(
                percentile_service_out_dir, f'percentile_{service_id}_temp')
            if not os.path.exists(intermediate_dir):
                os.makedirs(intermediate_dir)

            raster_percentile_path = os.path.join(
                percentile_service_out_dir,
                f'global_{service_id}_percentile.tif')
            pct_buckets = list(range(0,100,1))
            global_pct_task = task_graph.add_task(
                func=create_percentile_rasters,
                args=(
                    input_raster_path, raster_percentile_path, pct_buckets,
                    intermediate_dir),
                target_path_list=[raster_percentile_path],
                task_name=f'global_{service_id}_percentile_task',
                dependent_task_list=[])

    task_graph.close()
    task_graph.join()

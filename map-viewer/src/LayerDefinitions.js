const mapLayers = [
  {
    layerID: 'sed-pct-global',
    name: 'Sediment Deposition Pct',
    serviceType: 'sediment',
    scaleID: 'global',
    mapLayer: {
      id: 'sed-pct-global',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'sed-pct-global',
    },
  },
  {
    layerID: 'global-nit-pct',
    name: 'Nitrogen Pct',
    serviceType: 'nitrogen',
    scaleID: 'global',
    mapLayer: {
      id: 'global-nit-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'global-nit-pct',
    },
  },
  {
    layerID: 'gadm0-sed-pct',
    name: 'GADM0 Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'national',
    mapLayer: {
      id: 'gadm0-sed-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'gadm0-sed-pct',
    },
  },
  {
    layerID: 'gadm0-nit-pct',
    name: 'GADM0 Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'national',
    mapLayer: {
      id: 'gadm0-nit-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'gadm0-nit-pct',
    },
  },
  {
    layerID: 'gadm1-sed-pct',
    name: 'GADM1 Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'admin',
    mapLayer: {
      id: 'gadm1-sed-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'gadm1-sed-pct',
    },
  },
  {
    layerID: 'gadm1-nit-pct',
    name: 'GADM1 Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'admin',
    mapLayer: {
      id: 'gadm1-nit-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'gadm1-nit-pct',
    },
  },
  {
    layerID: 'hybas-sed-pct',
    name: 'HYBAS Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'watershed',
    mapLayer: {
      id: 'hybas-sed-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'hybas-sed-pct',
    },
  },
  {
    layerID: 'hybas-nit-pct',
    name: 'HYBAS Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'watershed',
    mapLayer: {
      id: 'hybas-nit-pct',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: 'hybas-nit-pct',
    }
  },
  {
    layerID: 'hybas-sed-stats',
    name: 'Hybas Lev08 Sed',
    serviceType: 'sediment',
    mapLayer: {
      id: 'hybas-sed-stats',
      type: 'fill',
      source: 'hybas-sed-stats',
      'source-layer': 'hybas_sed_stats',
      paint: {
        'fill-color': 'rgba(99, 99, 99, 0.0)',
        'fill-outline-color': 'rgba(43, 140, 190, 1.0)',
      },
      layout: {
        visibility: 'none',
      },
    }
  },
]

export default mapLayers;

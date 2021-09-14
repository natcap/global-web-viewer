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
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.33r0lkjs'
      },
    },
  },
  {
    layerID: 'nit-pct-global',
    name: 'Nitrogen Pct',
    serviceType: 'nitrogen',
    scaleID: 'global',
    mapLayer: {
      id: 'nit-pct-global',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.9q9phcqp'
      },
    },
  },
  {
    layerID: 'acc-pct-global',
    name: 'Access to Nature Pct',
    serviceType: 'natureAccess',
    scaleID: 'global',
    mapLayer: {
      id: 'acc-pct-global',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.arhkdcnr'
      },
    },
  },
  {
    layerID: 'sed-pct-gadm0',
    name: 'GADM0 Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'national',
    mapLayer: {
      id: 'sed-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.7bd8mt7n'
      },
    },
  },
  {
    layerID: 'nit-pct-gadm0',
    name: 'GADM0 Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'national',
    mapLayer: {
      id: 'nit-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.ah2yvpwa'
      },
    },
  },
  {
    layerID: 'acc-pct-gadm0',
    name: 'Access to Nature Gadm0',
    serviceType: 'natureAccess',
    scaleID: 'national',
    mapLayer: {
      id: 'acc-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.81vt2qno',
      },
    },
  },
  {
    layerID: 'sed-pct-gadm1',
    name: 'GADM1 Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'admin',
    mapLayer: {
      id: 'sed-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.5gp8uedb'
      },
    },
  },
  {
    layerID: 'nit-pct-gadm1',
    name: 'GADM1 Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'admin',
    mapLayer: {
      id: 'nit-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.80hd6f8c'
      },
    },
  },
  {
    layerID: 'acc-pct-gadm1',
    name: 'Access to Nature Gadm1',
    serviceType: 'natureAccess',
    scaleID: 'admin',
    mapLayer: {
      id: 'acc-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.avvpojjm',
      },
    },
  },
  {
    layerID: 'sed-pct-hybas',
    name: 'HydroBASIN Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'local',
    mapLayer: {
      id: 'sed-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.4nnudyg3',
      },
    },
  },
  {
    layerID: 'nit-pct-hybas',
    name: 'HydroBASIN Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'local',
    mapLayer: {
      id: 'nit-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.188ctii9',
      },
    }
  },
  {
    layerID: 'acc-pct-hybas',
    name: 'Access to Nature HydroBASIN',
    serviceType: 'natureAccess',
    scaleID: 'local',
    mapLayer: {
      id: 'acc-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.99qy4mlp',
      },
    }
  },
  {
    layerID: 'stats-gadm0',
    name: 'Service Stats Gadm0',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-gadm0',
      type: 'fill',
      'source-layer': 'gadm0_all_stats_rcp',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgb(245, 245, 245)',
        'fill-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.4c107okb',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-gadm1',
    name: 'Service Stats Gadm1',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-gadm1',
      type: 'fill',
      'source-layer': 'gadm1_all_stats_rcp',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgb(245, 245, 245)',
        'fill-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.bn0gvfer',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-hybas',
    name: 'HydroBASIN Lev08 Sed',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-hybas',
      minzoom: 5,
      type: 'fill',
      'source-layer': 'hybas_all_stats',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgb(245, 245, 245)',
        'fill-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.cme0lyel',
        generatedId: true
      },
    }
  },
  {
    layerID: 'rcp-points',
    name: 'Realized Coastal Protection',
    serviceType: 'coastalProtection',
    scaleID: 'all',
    mapLayer: {
      id: 'rcp-points',
      minzoom: 1,
      type: 'circle',
      'source-layer': 'realized_coastal_protection_points',
      paint: {
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'grid_code'],
          0,
          '#f3deff',
          4.6,
          '#e2c7ec',
          29.3,
          '#d1afdc',
          101.1,
          '#c098cd',
          284.4,
          '#ae81bd',
          732.2,
          '#9d69ad',
          1790.7,
          '#8c529d',
          4555.7,
          '#7b3a8d',
          14861.5,
          '#500066'
        ],
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 0.25,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.38tijv0y',
        generatedId: true
      },
    }
  },
  {
    layerID: 'lulc',
    name: 'ESA Land Use Land Cover',
    serviceType: 'lulc',
    scaleID: 'all',
    mapLayer: {
      id: 'lulc',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.9x3nkjh1',
      },
    }
  },
  {
    layerID: 'population',
    name: 'LandScan Population 2017',
    serviceType: 'population',
    scaleID: 'all',
    mapLayer: {
      id: 'population',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.1x4xnqfg',
      },
    }
  },
  {
    layerID: 'wetland',
    name: 'Wetlands',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'wetland',
      'source-layer': 'Wetland_ESA_CV',
      type: 'fill',
      paint: {
        'fill-color': '#6FACED',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.djwp4p9g',
      },
    }
  },
  {
    layerID: 'seagrass',
    name: 'Seagrass',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'seagrass',
      'source-layer': 'Seagrass',
      type: 'fill',
      paint: {
        'fill-color': '#99CF78',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.4m9y52by',
      },
    }
  },
  {
    layerID: 'mangroves',
    name: 'Mangroves',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'mangroves',
      'source-layer': 'Mangroves_2016_v2',
      type: 'fill',
      paint: {
        'fill-color': '#FFEC42',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.55cle2yq',
      },
    }
  },
  {
    layerID: 'forest-scrub',
    name: 'Coastal Forest/Scrub',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'forest-scrub',
      'source-layer': 'Coastal_forest_scrub_natural_ESA_CV',
      type: 'fill',
      paint: {
        'fill-color': '#D4B577',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.c27wlmyx',
      },
    }
  },
  {
    layerID: 'coral-reef',
    name: 'Coral Reefs',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'coral-reef',
      'source-layer': 'Coral_reefs',
      type: 'fill',
      paint: {
        'fill-color': '#FC8D62',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.40utsiiz',
      },
    }
  },
]

export default mapLayers;

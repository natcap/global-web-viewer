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
    serviceType: 'access',
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
  /*
  {
    layerID: 'acc-pct-gadm0',
    name: 'Access to Nature Gadm0',
    serviceType: 'access',
    scaleID: 'national',
    mapLayer: {
      id: 'acc-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
//      type: 'raster',
//      url: 'mapbox://'
      },
    },
  },
  */
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
  /*
  {
    layerID: 'acc-pct-gadm1',
    name: 'Access to Nature Gadm1',
    serviceType: 'access',
    scaleID: 'admin',
    mapLayer: {
      id: 'acc-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
//      type: 'raster',
//      url: 'mapbox://'
      },
    },
  },
  {
    layerID: 'sed-pct-hybas',
    name: 'HYBAS Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'watershed',
    mapLayer: {
      id: 'sed-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {

      },
    },
  },
  {
    layerID: 'nit-pct-hybas',
    name: 'HYBAS Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'watershed',
    mapLayer: {
      id: 'nit-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {

      },
    }
  },
  {
    layerID: 'acc-pct-hybas',
    name: 'Access to Nature Hybas',
    serviceType: 'access',
    scaleID: 'watershed',
    mapLayer: {
      id: 'acc-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {

      },
    }
  },
  */
  {
    layerID: 'stats-gadm0',
    name: 'Service Stats Gadm0',
    serviceType: 'all',
    mapLayer: {
      id: 'stats-gadm0',
      type: 'fill',
      'source-layer': 'gadm0_all_stats',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgba(9, 9, 9, 0.51)',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.00,
          0.00
        ]
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.c1c79s1n',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-gadm1',
    name: 'Service Stats Gadm1',
    serviceType: 'all',
    mapLayer: {
      id: 'stats-gadm1',
      type: 'fill',
      'source-layer': 'gadm1_all_stats',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgba(9, 9, 9, 0.51)',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.00,
          0.00
        ]
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.8s375kz0',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-hybas',
    name: 'Hybas Lev08 Sed',
    serviceType: 'all',
    mapLayer: {
      id: 'stats-hybas',
      type: 'fill',
      'source-layer': 'hybas_all_stats',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgba(9, 9, 9, 0.01)',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.00,
          0.00
        ]
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
]

export default mapLayers;

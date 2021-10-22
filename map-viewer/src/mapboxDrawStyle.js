export const modifiedDefaultStyle = [
  // ACTIVE (being drawn)
  // line stroke
  {
    "id": "gl-draw-line",
    "type": "line",
    "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      //"line-color": "#D20C0C",
      "line-color": "#1bcafa",
      "line-dasharray": [0.2, 2],
      "line-width": 3
    }
  },
  // polygon fill
  {
    "id": "gl-draw-polygon-fill",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "paint": {
      //"fill-color": "#D20C0C",
      "fill-color": "#1bcafa",
      //"fill-outline-color": "#D20C0C",
      "fill-opacity": 0.1
    }
  },
  // polygon mid points
  {
    'id': 'gl-draw-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    "id": "gl-draw-polygon-stroke-active",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      //"line-color": "#D20C0C",
      "line-color": "#1bcafa",
      "line-dasharray": [0.2, 2],
      "line-width": 3
    }
  },
  // vertex point halos
  {
    "id": "gl-draw-polygon-and-line-vertex-halo-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 5,
      "circle-color": "#FFF"
    }
  },
  // vertex points
  {
    "id": "gl-draw-polygon-and-line-vertex-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 3,
      "circle-color": "#D20C0C",
    }
  },

  // INACTIVE (static, already drawn)
  // line stroke
  {
    "id": "gl-draw-line-static",
    "type": "line",
    "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "simple_select"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      //"line-color": "#000",
      "line-color": "#1bcafa",
      "line-width": 3,
    }
  },
  // polygon fill
  {
    "id": "gl-draw-polygon-fill-static",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "simple_select"]],
    "paint": {
      //"fill-color": "#000",
      "fill-color": "#1bcafa",
      "fill-outline-color": "#000",
      "fill-opacity": 0.1
    }
  },
  // polygon outline
  {
    "id": "gl-draw-polygon-stroke-static",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "simple_select"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      //"line-color": "#000",
      "line-color": "#1bcafa",
      "line-width": 3,
    }
  }
];


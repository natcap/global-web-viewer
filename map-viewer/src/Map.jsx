import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

// eslint-disable-next-line import/no-webpack-loader-syntax
//import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import mapboxgl from 'mapbox-gl';
// Had to npm install @mapbox/mapbox-gl-geocoder and import like below
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import './Map.css';

import LayerSelect from './components/LayerSelect';
import Legend from './components/Legend';

// import MyComponent from './components/MyComponent';

//mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw';


const Map = () => {

  let layers = [
    {
      layerID: 'dem-stats',
      name: 'Max DEM',
    },
    {
      layerID: 'hybas-lev06-seddep',
      name: 'HyBasin SedDep Sum',
    },
    {
      layerID: 'sed-pct-global',
      name: 'Sediment Deposition Pct',
    },
  ]

  let legend = [
    {
      legendID: 'sed-pct-global',
      name: 'Sediment Deposition Pct',
    },
  ]

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(16.8);
  const [lat, setLat] = useState(30.0);
  const [zoom, setZoom] = useState(1.64);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add the control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
    );

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());


    map.on('load', () => {
      map.addSource('dem-stats', {
        type: 'vector',
        url: 'mapbox://ddenu.hello-world-tiles'
        //url: 'mapbox://styles/ddenu/cknor29xj2rlo17p1jdvyn4gg'
      });

      map.addLayer({
        id: 'dem-stats',
        type: 'fill',
        source: 'dem-stats',
        'source-layer': 'hello_world', // layer name from Tilesets > hello world > Vector Layers
        paint: {
          'fill-outline-color': 'rgba(200, 100, 240, 1)',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'max'],
            -600,
            '#F2F12D',
            0,
            '#EED322',
            1000,
            '#E6B71E',
            2000,
            '#DA9C20',
            3000,
            '#CA8323',
            5000,
            '#B86B25',
            7000,
            '#A25626',
          ],
          'fill-opacity': 0.75
        },
        layout: {
          visibility: 'none',
        },
      });

      map.addSource('sed-pct-global', {
        type: 'raster',
        url: 'mapbox://ddenu.sed-pct-global'
      });

      map.addLayer({
        id: 'sed-pct-global',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'sed-pct-global',
      });
      
      map.addSource('hybas-lev06-seddep', {
        type: 'vector',
        url: 'mapbox://ddenu.hybas-06-seddep'
        //ddenu.hybas-06-seddep
      });

      map.addLayer({
        id: 'hybas-lev06-seddep',
        type: 'fill',
        source: 'hybas-lev06-seddep',
        //hybas_lev06_seddep
        'source-layer': 'hybas_lev06_seddep', // layer name from Tilesets > hello world > Vector Layers
        paint: {
          'fill-outline-color': 'rgba(200, 100, 240, 1)',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'sum'],
            0,
            '#4ce0fa',
            700000,
            '#047f95',
          ],
          'fill-opacity': 0.75
        },
        layout: {
          visibility: 'none',
        },
      });

      setMap(map);
    });

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'dem-stats', function (e) {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`Max Dem Value: ${e.features[0].properties.max}`)
    .addTo(map);
    });
    
    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'hybas-lev06-seddep', function (e) {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`Sed Sum Value: ${e.features[0].properties.sum}`)
    .addTo(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line-react-hooks/exhaustive-deps

  const changeVisibilityState = (i, checked) => {
    //setActive(options[i]);
    //map.setPaintProperty('countries', 'fill-color', {
    //  property: active.property,
    //  stops: active.stops
    //});
    console.log("i ", i);
    console.log("checked ", checked);
    if(!checked) {
      map.setLayoutProperty(layers[i]['layerID'], 'visibility', 'none');
    }
    else {
      map.setLayoutProperty(layers[i]['layerID'], 'visibility', 'visible');
    }
  };

  return (
    <div>
      <div className="map-container" ref={mapContainer} >
        <LayerSelect
          layers={layers}
          changeVisibilityState={changeVisibilityState}
        />
        <div className="coordinatebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <Legend
          legend={legend}
          //changeVisibilityState={changeVisibilityState}
        />
      </div>
    </div>
  );
};

export default Map;

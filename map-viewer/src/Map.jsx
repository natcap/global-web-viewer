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

import './Map.css';

import LayerSelect from './components/LayerSelect';

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
  ]

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

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
          'fill-color': 'rgba(200, 100, 240, 0.4)',
          'fill-outline-color': 'rgba(200, 100, 240, 1)',
        },
      });
      setMap(map);
    });

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
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
      <div className="map-container" ref={mapContainer} />
      <LayerSelect
        layers={layers}
        changeVisibilityState={changeVisibilityState}
      />
      <div className="coordinatebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
};

export default Map;

import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

import './index.css';

// Wrapper is a component made by styled-components using JS tagged templates
const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  min-height: 40rem;
  border: 2px solid black;
  `;

function getColor(d) {
    return d > 5000  ? '#800026' :
           d > 4000  ? '#BD0026' :
           d > 3000  ? '#E31A1C' :
           d > 2000  ? '#FC4E2A' :
           d > 1000  ? '#FD8D3C' :
           d > 500   ? '#FEB24C' :
           d > 0     ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

export default class Map extends React.Component {

  componentDidMount() {
    let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjRiNWdyMzFwYjJ5bzl5eHZiemFzZCJ9.KopFh5uduOIW8nSbBr4_ZQ'
    });

    let demLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'MapBox Global DEM',
        maxZoom: 18,
        id: 'ddenu/cknor6of301e317mcqa1337z2',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw',
    });

    let demMaxVector = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'MapBox Global DEM',
        maxZoom: 18,
        id: 'ddenu/cknor29xj2rlo17p1jdvyn4gg',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw',
    });


    mapboxgl.accessToken = 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw';

    let map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [58, 16], // starting position [lng, lat]
      zoom: 2, // starting zoom
      maxZoom: 12,
    });

    map.on('load', function () {
      map.addSource('dem-stats', {
        type: 'vector',
        url: 'mapbox://ddenu.hello-world-tiles'
        //url: 'mapbox://styles/ddenu/cknor29xj2rlo17p1jdvyn4gg'
      });

      map.addLayer({
        'id': 'dem-stats',
        'type': 'fill',
        'source': 'dem-stats', 
        'source-layer': 'hello_world', // layer name from Tilesets > hello world > Vector Layers
        'paint': {
          'fill-color': 'rgba(200, 100, 240, 0.4)',
          'fill-outline-color': 'rgba(200, 100, 240, 1)',
        },
      });
    });
    
    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'dem-stats', function (e) {
      new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(e.features[0].properties.max)
      .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'dem-stats', function () {
      map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'dem-stats', function () {
      map.getCanvas().style.cursor = '';
    });

    const baseMaps = {
      "Streets": streets,
      "DEM": demLayer,
    };

    const overlayMaps = {
      "Max DEM": demMaxVector,
    };

    const controlLayersOptions = {
      collapsed: false,
      position: 'topleft',
    };

    //L.control.layers(baseMaps, overlayMaps, controlLayersOptions).addTo(this.map);
  }

  render() {
    return <Wrapper width="100%" height="80%" id="map" />
  }
}

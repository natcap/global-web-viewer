import React from 'react';
import L from 'leaflet';
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


export default class Map extends React.Component {

  componentDidMount() {
    //const mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw';

    let map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [58, 16], // starting position [lng, lat]
      zoom: 2, // starting zoom
      maxZoom: 12,
    });
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', function () {
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

      map.addSource('dem-global', {
        type: 'raster',
        url: 'mapbox://ddenu.global-dem'
      });

      map.addLayer({
        id: 'dem-global',
        type: 'raster',
        source: 'dem-global',
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

    /* 
    // After the last frame rendered before the map enters an "idle" state.
    map.on('idle', function () {
      // If these two layers have been added to the style, add the toggle buttons.
      if (map.getLayer('dem-stats') && map.getLayer('dem-global')) {
        // Enumerate ids of the layers.
        var toggleableLayerIds = ['dem-stats', 'dem-global'];
        // Set up the corresponding toggle button for each layer.
        for (var i = 0; i < toggleableLayerIds.length; i++) {
          var id = toggleableLayerIds[i];
          if (!document.getElementById(id)) {
            // Create a link.
            var link = document.createElement('a');
            link.id = id;
            link.href = '#';
            link.textContent = id;
            link.className = 'active';
            // Show or hide layer when the toggle is clicked.
            link.onclick = function (e) {
              var clickedLayer = this.textContent;
              e.preventDefault();
              e.stopPropagation();
               
              var visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
              );
               
              // Toggle layer visibility by changing the layout object's visibility property.
              if (visibility === 'visible') {
                map.setLayoutProperty(
                  clickedLayer,
                  'visibility',
                  'none'
                );
                this.className = '';
              } else {
                this.className = 'active';
                map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
                );
              }
            };
       
            var layers = document.getElementById('menu');
            layers.appendChild(link);
          }
        }
      }
    });
    */
  }

  render() {
    return <Wrapper width="100%" height="80%" id="map" />
  }
}

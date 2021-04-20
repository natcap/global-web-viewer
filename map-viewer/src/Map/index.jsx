import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

// Wrapper is a component made by styled-components using JS tagged templates
const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  min-height: 40rem;
  border: 2px solid black;
  `;

export default class Map extends React.Component {

  componentDidMount() {
    let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjRiNWdyMzFwYjJ5bzl5eHZiemFzZCJ9.KopFh5uduOIW8nSbBr4_ZQ'
    });//.addTo(this.map);

    let demLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'MapBox Global DEM',
        maxZoom: 18,
        id: 'ddenu/cknor6of301e317mcqa1337z2',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw',
    });//.addTo(this.map);

    let demMaxVector = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'MapBox Global DEM',
        maxZoom: 18,
        id: 'ddenu/cknor29xj2rlo17p1jdvyn4gg',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw',
    });//.addTo(this.map);
    
    this.map = L.map('map', {
      center: [58, 16],
      zoom: 2,
      zoomControl: false,
      crs: L.CRS.EPSG3857,
      layers: [demMaxVector, demLayer],
    });
    
    const baseMaps = {
      "Streets": streets,
      "DEM": demLayer,
    };

    const overlayMaps = {
      "Max DEM": demMaxVector,
    };
    
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    //https://api.mapbox.com/styles/v1/YOUR_USERNAME/YOUR_STYLE_ID/tiles/256/{z}/{x}/{y}?access_token=YOUR_ACCESS_TOKEN

    //mapbox://styles/ddenu/ckn90yb4s1qab18pdbckcymyn
    // Mapbox country boundaires
    //mapbox.country-boundaries-v1

    // Mask layers attempt
    //function polyMask(mask, bounds) {
    //  var bboxPoly  = turf.bboxPolygon(bounds);
    //  return turf.difference(bboxPoly, mask);
    //}

/*
    let boundary = {
      "type": "Feature", 
      "properties": { "id": 1 }, 
      "geometry": { 
        "type": "MultiPolygon", 
        "coordinates": [ 
          [ 
            [ 
              [ -72.6633466, 3.2808765 ],
              [ -75.6752988, -1.2370518 ],
              [ -75.6752988, -1.2370518 ],
              [ -74.5458167, -3.6035857 ],
              [ -55.7749004, -12.1015936 ],
              [ -46.7390438, -0.1075697 ],
              [ -66.9621514, 9.3585657 ],
              [ -72.6633466, 3.2808765 ] 
            ] 
          ] 
        ]
      }
    }

    let boundaryLayer = L.TileLayer.BoundaryCanvas.createFromLayer(
      demLayer, {boundary: boundary}).addTo(this.map);
      */
    /*
    var marker = L.marker([58.5, 16]).addTo(this.map);
    var circle = L.circle([58.508, 16.11], {
                  color: 'red',
                  fillColor: '#f03',
                  fillOpacity: 0.5,
                  radius: 500
                }).addTo(this.map);
    var polygon = L.polygon([
                    [58.509, 16.08],
                    [58.503, 16.05],
                    [58.51, 16.047]
                  ]).addTo(this.map);


    //marker.bindPopup("<b>Hello world!</b>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(this.map);
    }

    this.map.on('click', onMapClick);
  }
  */

  }

  render() {
    return <Wrapper width="100%" height="80%" id="map" />
  }
}

/**    
<div id = "mapid"></div>
          <script>
            var mymap = L.map('mapid').setView([51.505, -0.09], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjRiNWdyMzFwYjJ5bzl5eHZiemFzZCJ9.KopFh5uduOIW8nSbBr4_ZQ'
            }).addTo(mymap);

            var marker = L.marker([51.5, -0.09]).addTo(mymap);
            var circle = L.circle([51.508, -0.11], {
                          color: 'red',
                          fillColor: '#f03',
                          fillOpacity: 0.5,
                          radius: 500
                        }).addTo(mymap);
            var polygon = L.polygon([
                            [51.509, -0.08],
                            [51.503, -0.05],
                            [51.51, -0.047]
                          ]).addTo(mymap);


            marker.bindPopup("<b>Hello world!</b>I am a popup.").openPopup();
            circle.bindPopup("I am a circle.");
            polygon.bindPopup("I am a polygon.");

            var popup = L.popup();

            function onMapClick(e) {
              popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(mymap);
            }

            mymap.on('click', onMapClick);
          </script>
          */


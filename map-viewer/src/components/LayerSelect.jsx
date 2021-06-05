import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';


const LayerSelect = (props) => {

  function handleChange(event) {
    const { id, checked } = event.target;
    console.log("event value: ", checked);
    props.changeVisibilityState(parseInt(id.slice(id.length - 1)), checked);
  };

  const renderLayers = (layer, i) => {
    return (
      <div key={i} className="layer-container">
        <Form.Check
          onChange={handleChange}
          defaultChecked={false}
          type="switch"
          id={layer.layerID + i}
          label={layer.name}
          className="layer-label"
          value="false"
          name="map-layers"
        />
      </div>
    );
  };

  return (
    <div className="layer-group">
      {props.layers.map(renderLayers)}
    </div>
  );
};

export default LayerSelect;

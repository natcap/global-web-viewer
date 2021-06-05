import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const BasemapControl = (props) => {

  function handleChange(event) {
    const { id, checked } = event.target;
    console.log("event value: ", checked);
    props.changeBasemapState(id, checked);
  };

  return (
    <Form className="basemap-control">
      {props.basemaps.map((basemap) => (
        <Form.Check
          defaultChecked={basemap.layerID == 'streets-v11'}
          key={`radio-key-${basemap.layerID}`}
          type="radio"
          id={`${basemap.layerID}`}
          name="radio-basemaps"
          label={`${basemap.name}`}
          onChange={handleChange}
          inline
        />
      ))}
      <div>
        zoom: {props.zoom} | long, lat: {props.lng} , {props.lat}
      </div>
    </Form>
  );
};

export default BasemapControl;

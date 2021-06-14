import React from 'react';
import PropTypes from 'prop-types'; // ES6

import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const BasemapControl = (props) => {

  function handleChange(event) {
    const { id, checked } = event.target;
    console.log("event value: ", checked);
    props.changeBasemapState(id, checked);
  }

  return (
    <Form className="basemap-control">
      {props.basemaps.map((basemap) => (
        <OverlayTrigger
          //show={true}
          placement="top"
          delay={{ show: 250, hide: 0 }}
          key={`overlay-${basemap.layerID}`}
          overlay={
            <Tooltip id={`tooltip-${basemap.layerID}`} className="show">
              {`${basemap.name}`}
            </Tooltip>
          }
          >
            <span>
              <Form.Check
                defaultChecked={basemap.layerID == 'streets-v11'}
                key={`radio-key-${basemap.layerID}`}
                type="radio"
                id={`${basemap.layerID}`}
                name="radio-basemaps"
                label={
                  <span>
                    <img
                      src="./icons/street-map-small.jpg"
                      className="img-fluid labelMaps"
                      alt={`${basemap.name}`}
                    />
                  </span>
                }
                onChange={handleChange}
                inline
              />
            </span>
          </OverlayTrigger>
      ))}
      <div>
        zoom: {props.zoom} | long, lat: {props.lng} , {props.lat}
      </div>
    </Form>
  );
};

BasemapControl.propTypes = {
  lng: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  basemaps: PropTypes.array.isRequired,
  changeBasemapState: PropTypes.func.isRequired,
}

export default BasemapControl;

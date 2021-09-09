import React from 'react';
import PropTypes from 'prop-types';

import { IoWaterOutline, IoWater } from 'react-icons/io5';
import { GiBee, GiCow } from 'react-icons/gi';
import { BiWater } from 'react-icons/bi';
import { TiTree } from 'react-icons/ti';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

//import { serviceMenuDetails } from '../ScaleDefinitions';
import ServicePopover from './ServicePopover';

const IconMap = {
  iowateroutline: <IoWaterOutline className="labelIcons"/>,
  iowater: <IoWater className="labelIcons"/>,
  gibee: <GiBee className="labelIcons"/>,
  biwater: <BiWater className="labelIcons"/>,
  titree: <TiTree className="labelIcons"/>,
  gicow: <GiCow className="labelIcons"/>,
}

const LayerSelect = (props) => {

  function handleChange(event) {
    const { id, checked } = event.target;
    console.log("event: ", event.target);
    //props.changeVisibilityState(parseInt(id.slice(id.length - 1)), checked);
    props.changeVisibilityState(id, checked);
  }

  const renderLayers = (service, i) => {
    return (
      <Form.Row key={i} className="align-items-center layer-container">
        <Col key={`form-col-layer-check-${i}`}>
          <Form.Check
            disabled={service.disable}
            onChange={handleChange}
            defaultChecked={false}
            type="switch"
            id={service.id}
            value="false"
            name="map-layers"
            label={
              <span className="menu-main-label">
                {IconMap[`${service.iconKey}`]}
                <span className="menu-desc-text">{service.label}</span>
              </span>
            }
          />
        </Col>
        <Col xs="auto">
          <ServicePopover
            title={service.label}
            content={service.helpText}
          />
        </Col>
      </Form.Row>
    );
  };

  return (
    <div className="layer-group">
      {props.layerDetails.map(renderLayers)}
    </div>
  );
};

LayerSelect.propTypes = {
  changeVisibilityState: PropTypes.func.isRequired,
  layerDetails: PropTypes.array.isRequired,
}

export default LayerSelect;

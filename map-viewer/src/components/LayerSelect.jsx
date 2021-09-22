import React from 'react';
import PropTypes from 'prop-types';

import { IoWaterOutline, IoWater } from 'react-icons/io5';
import { GiBee, GiCow, GiCoral } from 'react-icons/gi';
import { BiWater } from 'react-icons/bi';
import { TiTree } from 'react-icons/ti';
import { MdLandscape } from 'react-icons/md';
import { IoIosPeople, IoIosConstruct } from 'react-icons/io';
import { FiLock } from 'react-icons/fi';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import ServicePopover from './ServicePopover';

const IconMap = {
  iowateroutline: <IoWaterOutline className="labelIcons"/>,
  iowater: <IoWater className="labelIcons"/>,
  gibee: <GiBee className="labelIcons"/>,
  biwater: <BiWater className="labelIcons"/>,
  titree: <TiTree className="labelIcons"/>,
  gicow: <GiCow className="labelIcons"/>,
  ioiospeople: <IoIosPeople className="labelIcons"/>,
  ioiosconstruct: <IoIosConstruct className="labelIcons"/>,
  mdlandscape: <MdLandscape className="labelIcons"/>,
  gicoral: <GiCoral className="labelIcons"/>,
  filock: <FiLock className="labelIcons"/>,
}

const LayerSelect = (props) => {

  function handleChange(event) {
    const { id, checked } = event.target;
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

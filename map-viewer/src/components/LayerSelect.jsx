import React from 'react';
import PropTypes from 'prop-types';

import { FcGlobe } from 'react-icons/fc';
import { GrMapLocation } from 'react-icons/gr';
import { GiAfrica } from 'react-icons/gi';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { serviceMenuDetails } from '../ScaleDefinitions';
import InfoPopover from './InfoPopover';

const IconMap = {
  fcglobe: <FcGlobe className="labelIcons"/>,
  grmaplocation: <GrMapLocation className="labelIcons"/>,
  giafrica: <GiAfrica className="labelIcons"/>,
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
          <InfoPopover
            title={`Cool Title`}
            content={`Cool Content`}
          />
        </Col>
      </Form.Row>
    );
  };

  return (
    <div className="layer-group">
      {serviceMenuDetails.map(renderLayers)}
    </div>
  );
};

LayerSelect.propTypes = {
  changeVisibilityState: PropTypes.func.isRequired,
}

export default LayerSelect;

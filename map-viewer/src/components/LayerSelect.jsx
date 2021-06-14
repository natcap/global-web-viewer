import React from 'react';
import PropTypes from 'prop-types';

import { FcGlobe } from 'react-icons/fc';
import { GrMapLocation } from 'react-icons/gr';
import { GiAfrica } from 'react-icons/gi';

import Form from 'react-bootstrap/Form';

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
      <div key={i} className="layer-container">
        <Form.Check
          onChange={handleChange}
          defaultChecked={false}
          type="switch"
          id={service.id}
          className="layer-label"
          value="false"
          name="map-layers"
          label={
            <span className="menu-main-label">
              {IconMap[`${service.iconKey}`]}
              <span className="menu-desc-text">{service.label}</span>
              <InfoPopover
                title={`Cool Title`}
                content={`Cool Content`}
              />
            </span>
          }
        />
      </div>
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

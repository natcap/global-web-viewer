import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { BsInfoCircle} from 'react-icons/bs';

const InfoPopover = (props) => {
  const popover = (
    <Popover id="popover-service">
      <Popover.Title as="h3">{props.title}</Popover.Title>
      <Popover.Content>
        {props.content}
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
      <Button variant="info" className="button-info" bsPrefix="info-btn">
        <BsInfoCircle />
      </Button>
    </OverlayTrigger>
  );
};

InfoPopover.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

export default InfoPopover;

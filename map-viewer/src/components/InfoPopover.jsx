import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { BsInfoCircle} from 'react-icons/bs';

const InfoPopover = (props) => {
  let popover = null;
  if(props.title) {
    popover = (
      <Popover id="popover-service">
        <Popover.Title className="popover-service-title">
          <Row>
            <Col>
              {props.title}
            </Col>
            <Col xs="auto" className="service-info-close-col">
              <Button
                className="service-info-close-button"
                bsPrefix="popover-close-btn"
                onClick={() => document.body.click()}
              >
              x
              </Button>
            </Col>
          </Row>
        </Popover.Title>
        <Popover.Content>
          {props.content}
        </Popover.Content>
      </Popover>
    );
  }
  else {
   popover = (
    <Popover id="popover-service">
      <Popover.Content>
        {props.content}
      </Popover.Content>
    </Popover>
   );
  }

  return (
    <OverlayTrigger trigger="click" rootClose placement="auto" overlay={popover}>
      <Button variant="info" className="button-info" bsPrefix="info-btn">
        <BsInfoCircle />
      </Button>
    </OverlayTrigger>
  );
};

InfoPopover.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
}

export default InfoPopover;

import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { BsInfoCircle, BsFillSquareFill } from 'react-icons/bs';

const ServicePopover = (props) => {
  const sourceArray = Array.isArray(props.content.source);
  const resolutionArray = Array.isArray(props.content.resolution);
  const dateArray = Array.isArray(props.content.date);
  const licenseArray = Array.isArray(props.content.license);
  const citationArray = Array.isArray(props.content.citation);

  const renderMarkup = (inputObj, i) => {
    let renderResult = "N/A";
    if(inputObj.type === "text") {
      renderResult = <span key={`source-text${i}`}>{inputObj.text}</span>
    }
    else if(inputObj.type === "link") {
      renderResult = <a key={`source-link${i}`} href={inputObj.link}>{inputObj.linkText}</a>
    }
    else if(inputObj.type === "break") {
      renderResult = <br key={`source-br${i}`}></br>
    }
    return renderResult;
  };

  const popover = (
    <Popover id="popover-service" className="popover-service">
      <Popover.Title className="popover-service-title">
        <Form.Row>
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
        </Form.Row>
      </Popover.Title>
      <Popover.Content>
        <h5>Metric</h5>
        {props.content.metric}
        {props.content.nodata &&
          <><br/><br/><BsFillSquareFill color={props.content.nodata}/> = Nodata.
            Areas in dark gray are not providing a service to the modeled beneficiaries.</>
        }
        <h5>Desciption</h5>
        {props.content.text}
        <h5>Source</h5>
        {sourceArray
          ? props.content.source.map(renderMarkup)
          : props.content.source
        }
        <h5>Resolution</h5>
        {resolutionArray
          ? props.content.resolution.map(renderMarkup)
          : props.content.resolution
        }
        <h5>Data Date</h5>
        {dateArray
          ? props.content.date.map(renderMarkup)
          : props.content.date
        }
        <h5>Geographic coverage</h5>
        {props.content.coverage}
        <h5>License</h5>
        {licenseArray
          ? props.content.license.map(renderMarkup)
          : <a href={props.content.license.link}>{props.content.license.text}</a>
        }
        <h5>Citation</h5>
        {citationArray
          ? props.content.citation.map(renderMarkup)
          : <a href={props.content.citation.link}>{props.content.citation.text}</a>
        }
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" rootClose={true} placement="right" overlay={popover}>
      <Button id="service-popover" variant="info" className="button-info" bsPrefix="info-btn">
        <BsInfoCircle />
      </Button>
    </OverlayTrigger>
  );
};

ServicePopover.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
}

export default ServicePopover;

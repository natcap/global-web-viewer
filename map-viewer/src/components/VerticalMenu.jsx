import React from 'react';
import PropTypes from 'prop-types';

import { FcGlobe } from 'react-icons/fc';
import { GrMapLocation } from 'react-icons/gr';
import { GiAfrica } from 'react-icons/gi';
import { IoIosArrowDropdown } from 'react-icons/io';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

import LayerSelect from './LayerSelect';
import { scales } from '../ScaleDefinitions';
import InfoPopover from './InfoPopover';

const IconMap = {
  fcglobe: <FcGlobe className="labelIcons"/>,
  grmaplocation: <GrMapLocation className="labelIcons"/>,
  giafrica: <GiAfrica className="labelIcons"/>,
IoIosArrowDropdown
}

const VerticalMenu = (props) => {

  function handleScaleChange(event) {
    const { id, checked } = event.target;
    props.changeScaleState(id, checked);
  }

  //<span className="menu-desc-text">{scaleObj.label}</span>
  return (
    <Form className="vertical-menu">
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0" className="accordion-header">
            <Row>
              <Col>Select Area of Focus</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0" className="accordion-header">
            <Card.Body>
              {scales.map((scaleObj) => (
                <Form.Row key={`form-row-${scaleObj.id}`} className="align-items-center">
                  <Col key={`form-col-check-${scaleObj.id}`}>
                    <Form.Check
                      key={`radio-key-${scaleObj.id}`}
                      type="radio"
                      onChange={handleScaleChange}
                      defaultChecked={scaleObj.defaultChecked}
                      id={scaleObj.id}
                      name="radio-scales"
                          //<p className="menu-desc-text">{scaleObj.label}</p>
                          //{IconMap[`${scaleObj.iconKey}`]}
                      label={
                          <span className="menu-main-label">
                            {IconMap[`${scaleObj.iconKey}`]}
                            <span className="menu-main-text">{scaleObj.name}</span>
                          </span>
                      }
                    />
                  </Col>
                  <Col xs="auto" key={`form-col-popover-${scaleObj.id}`}>
                    <InfoPopover
                      key={`scale-popover-${scaleObj.id}`}
                      title={scaleObj.name}
                      content={scaleObj.label}
                    />
                  </Col>
                </Form.Row>
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1" className="accordion-header">
            <Row>
              <Col>Explore Ecosystem Services</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="accordion-header">
            <Card.Body>
              <LayerSelect
                changeVisibilityState={props.changeVisibilityState}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="2" className="accordion-header">
            <Row>
              <Col>Explore Other Layers</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2" className="accordion-header">
            <Card.Body>
              <div> Other services here </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="3" className="accordion-header">
            <Row>
              <Col>Discover and Case Studies</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="3" className="accordion-header">
            <Card.Body>
              <div> Discover! </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

    </Form>
  );
};

VerticalMenu.propTypes = {
  changeScaleState: PropTypes.func.isRequired,
  changeVisibilityState: PropTypes.func.isRequired,
}

export default VerticalMenu;

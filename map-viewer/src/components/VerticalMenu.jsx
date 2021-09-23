import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaGlobe } from 'react-icons/fa';
import { GiAfrica } from 'react-icons/gi';
import { BiPolygon, BiMapPin } from 'react-icons/bi';
import { IoIosArrowDropdown } from 'react-icons/io';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

import LayerSelect from './LayerSelect';
import { scales } from '../ScaleDefinitions';
import InfoPopover from './InfoPopover';
import { serviceMenuDetails, supportMenuDetails } from '../ScaleDefinitions';

import { TestSortable } from './TestSortable';

const IconMap = {
  faglobe: <FaGlobe className="labelIcons"/>,
  giafrica: <GiAfrica className="labelIcons"/>,
  bipolygon: <BiPolygon className="labelIcons"/>,
  bimappin: <BiMapPin className="labelIcons"/>,
IoIosArrowDropdown
}

const VerticalMenu = (props) => {

  useEffect(() => {
    props.geocoderNational.addTo('#geocoder-national');
    props.geocoderAdmin.addTo('#geocoder-admin');
  }, []);

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
              <Col>1) Select Area of Focus</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0" className="accordion-header scale-accordion">
            <Card.Body>
              {scales.map((scaleObj) => (
                <div key={`form-${scaleObj.id}`}>
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
                        content={scaleObj.label}
                      />
                    </Col>
                  </Form.Row>
                  <div
                    key={`geocoder-${scaleObj.id}`}
                    id={`geocoder-${scaleObj.id}`}>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1" className="accordion-header">
            <Row>
              <Col>2) Explore Ecosystem Services</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="accordion-header">
            <Card.Body>
              <LayerSelect
                changeVisibilityState={props.changeVisibilityState}
                layerDetails={serviceMenuDetails}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="2" className="accordion-header">
            <Row>
              <Col>3) Explore Other Layers</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2" className="accordion-header">
            <Card.Body>
              <LayerSelect
                changeVisibilityState={props.changeVisibilityState}
                layerDetails={supportMenuDetails}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="3" className="accordion-header">
            <Row>
              <Col>Discover and Case Studies -- Coming Soon</Col>
              <Col xs="auto"><IoIosArrowDropdown className="dropdown-icon"/></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="3" className="accordion-header">
            <Card.Body>
              <div> More soon. </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <TestSortable />
    </Form>
  );
};

VerticalMenu.propTypes = {
  changeScaleState: PropTypes.func.isRequired,
  changeVisibilityState: PropTypes.func.isRequired,
  geocoderNational: PropTypes.object.isRequired,
  geocoderAdmin: PropTypes.object.isRequired,
}

export default VerticalMenu;

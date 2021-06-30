import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const WelcomeModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="welcome-title">
        <Modal.Title id="contained-modal-title-vcenter">
          Prototype Global Data Viewer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Getting Started</h4>
        <p>
          Welcome to the NatCap Data Viewer, a web map app to investigate 
          global data. We have uploaded a sample of our data and implemented 
          a subset of features for this demo. Currently a prototype, we hope 
          to gather user feedback and interest for a production version in the 
          future. Enjoy! 
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            <span> P.S. Because this is a prototype we have not had a 
              chance to run this through the testing gauntlet. If something breaks,
              simply hit the refresh button. Thanks for understanding.
            </span>
          </Col>
          <Col xs="auto">
            <Button onClick={props.onHide}>Close</Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

WelcomeModal.propTypes = {
  onHide: PropTypes.func.isRequired,
}

export default WelcomeModal;

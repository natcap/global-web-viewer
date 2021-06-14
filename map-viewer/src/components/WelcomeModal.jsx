import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const WelcomeModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Natural Capital Web Viewer: Welcome!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Getting Started</h4>
        <p>
          Welcome to the global data web viewer by the Natural Capital Project!
          We have curated some of our global data products for your pleasure.
          Enjoy.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

WelcomeModal.propTypes = {
  onHide: PropTypes.func.isRequired,
}

export default WelcomeModal;

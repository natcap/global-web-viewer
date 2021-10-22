import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BsInfoCircle} from 'react-icons/bs';
import { GrDrag } from 'react-icons/gr';

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
          Natural Capital World Viewer (Prototype)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Welcome!</h4>
        <p>
          The Natural Capital World Viewer is designed to make nature’s diverse
          benefits to people easily accessible and understandable. To explore
          the map, use the menu on the left side of the screen. In Step 1,
          select the level (global, national, or specific local scale) to view
          data layers. In Step 2, turn on and off different ecosystem services.
          In Step 3, interact with additional layers. In the legend, reorganize
          which layers are on top by clicking and dragging
          <span>  <GrDrag/>  </span>. Click the <span>  <BsInfoCircle/>  </span>
          to learn more about the data. Change the basemap to your preference
          in the bottom right of the screen.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            This prototype contains just a sample of the extensive
            global data that we use at the Natural Capital Project. In this
            stage, we’re still testing, learning, and gathering user feedback
            and interest. If something breaks, simply hit the refresh button
            on your browser (and thanks for understanding!). We are eager to
            hear your thoughts, so please send us feedback at
            <a href="naturalcapitalproject@stanford.edu"> naturalcapitalproject@stanford.edu</a>.
          </Col>
        </Row>
        <Row>
          <Col xs="auto">
            <Button onClick={props.onHide}>Start Exploring</Button>
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

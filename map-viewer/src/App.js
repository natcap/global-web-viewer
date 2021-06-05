import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React, { useSate } from 'react';

import Map from './Map';
import WelcomeModal from './components/WelcomeModal';
import './App.css';


function App() {
  const [modalShow, setModalShow] = React.useState(true);

    return (
      <Container fluid className="appContainer vh-100 d-flex flex-column">
        <WelcomeModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <Row>
          <Col className="banner">Natural Capital Project Global Viewer
          </Col>
        </Row>
        <Row className="h-100">
          <Map />
        </Row>
        <Row>
          <div className="footer"/>
        </Row>
      </Container>
    );
}

export default App;

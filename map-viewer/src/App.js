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
      <Container fluid>
        <WelcomeModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <Row>
          <Col className="banner">Natural Capital Project Global Viewer
          </Col>
        </Row>
        <Row>
          <Col>
            <Map />
          </Col>
        </Row>
      </Container>
    );
}

export default App;

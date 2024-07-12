import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Card, Col, Row, OverlayTrigger, Tooltip , Button, ButtonGroup} from 'react-bootstrap';

const QRGenerator = ({ link }) => {
  const [text, setText] = useState('');
  const qrRef = useRef();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  // Función para descargar el QR


  return (
    <Card bg='black'>
      <Card.Body>
        <Row>
          <Col>
            <Card>
              <Card.Body >
                {link && <QRCode value={link} ref={qrRef} />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QRGenerator;

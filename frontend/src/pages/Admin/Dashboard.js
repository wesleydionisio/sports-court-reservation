import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaFutbol } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Painel Administrativo</h2>
      <Row>
        <Col md={4}>
          <Card as={Link} to="/admin/reservations" className="mb-3 text-decoration-none">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="me-3" size={24} />
                <div>
                  <Card.Title>Agendamentos</Card.Title>
                  <Card.Text>Gerenciar reservas</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card as={Link} to="/admin/users" className="mb-3 text-decoration-none">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaUsers className="me-3" size={24} />
                <div>
                  <Card.Title>Usuários</Card.Title>
                  <Card.Text>Gerenciar usuários</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card as={Link} to="/admin/courts" className="mb-3 text-decoration-none">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaFutbol className="me-3" size={24} />
                <div>
                  <Card.Title>Quadras</Card.Title>
                  <Card.Text>Gerenciar quadras</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 
// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCourts = async () => {
    try {
      const response = await api.get('/courts');
      setCourts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar quadras:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">Erro ao carregar quadras. Tente novamente mais tarde.</Alert>;
  }

  return (
    <Row>
      {courts.map((court) => (
        <Col md={4} key={court._id} className="mb-4">
          <Card>
            <Card.Img variant="top" src={court.mainPhoto} alt={court.name} style={{ height: '200px', objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>{court.name}</Card.Title>
              <Card.Text>{court.description.substring(0, 100)}...</Card.Text>
              <Button as={Link} to={`/booking/${court._id}`} variant="primary">
                Agendar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Home;
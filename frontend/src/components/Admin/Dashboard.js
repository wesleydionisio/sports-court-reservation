// src/components/Admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats'); // Você precisará criar esta rota no backend
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError(true);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  if (error) {
    return <Alert variant="danger">Erro ao carregar estatísticas.</Alert>;
  }
  
  return (
    <div>
      <h2>Dashboard Admin</h2>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total de Quadras</Card.Title>
              <Card.Text>{stats.totalCourts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total de Usuários</Card.Title>
              <Card.Text>{stats.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total de Reservas</Card.Title>
              <Card.Text>{stats.totalReservations}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
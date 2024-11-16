// src/components/Admin/Courts/CourtsList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';

const CourtsList = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const fetchCourts = async () => {
    try {
      const response = await api.get('/api/courts'); // Rota pública ou protegida, dependendo da sua implementação
      setCourts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar quadras:', err);
      setError(true);
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta quadra?')) {
      try {
        await api.delete(`/api/courts/${id}`); // Rota protegida (admin)
        setCourts(courts.filter(court => court._id !== id));
      } catch (err) {
        console.error('Erro ao remover quadra:', err);
        alert('Erro ao remover quadra');
      }
    }
  };
  
  useEffect(() => {
    fetchCourts();
  }, []);
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  if (error) {
    return <Alert variant="danger">Erro ao carregar quadras.</Alert>;
  }
  
  return (
    <div>
      <h2>Gerenciamento de Quadras</h2>
      <Button as={Link} to="/admin/courts/add" className="mb-3">
        Adicionar Quadra
      </Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Esportes Permitidos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {courts.map(court => (
            <tr key={court._id}>
              <td>{court.name}</td>
              <td>{court.description}</td>
              <td>{court.allowedSports.join(', ')}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/courts/edit/${court._id}`}
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(court._id)}
                >
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CourtsList;
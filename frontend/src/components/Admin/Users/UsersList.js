// src/components/Admin/Users/UsersList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users'); // Você precisará criar esta rota no backend
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(true);
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await api.delete(`/api/users/${id}`); // Rota protegida (admin)
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        console.error('Erro ao remover usuário:', err);
        alert('Erro ao remover usuário');
      }
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  if (error) {
    return <Alert variant="danger">Erro ao carregar usuários.</Alert>;
  }
  
  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <Button as={Link} to="/admin/users/add" className="mb-3">
        Adicionar Usuário
      </Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Papel</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/users/edit/${user._id}`}
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(user._id)}
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

export default UsersList;
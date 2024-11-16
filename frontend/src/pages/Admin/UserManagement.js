import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cliente'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        setError('Erro ao excluir usuário');
        console.error(error);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser._id}`, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      setError('Erro ao atualizar usuário');
      console.error(error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'cliente' });
      fetchUsers();
    } catch (error) {
      setError('Erro ao criar usuário');
      console.error(error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Usuários</h2>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          Novo Usuário
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  name: e.target.value
                })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  email: e.target.value
                })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Função</Form.Label>
              <Form.Select
                value={selectedUser?.role || 'cliente'}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  role: e.target.value
                })}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Salvar Alterações
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Criação */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Função</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success" type="submit">
              Criar Usuário
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserManagement; 
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import api from '../../utils/api';

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  
  const initialCourtState = {
    name: '',
    description: '',
    location: '',
    sports: [],
    pricePerHour: '',
    imageUrls: [''],
    operatingHours: {
      'Segunda-feira': { open: '08:00', close: '22:00' },
      'Terça-feira': { open: '08:00', close: '22:00' },
      'Quarta-feira': { open: '08:00', close: '22:00' },
      'Quinta-feira': { open: '08:00', close: '22:00' },
      'Sexta-feira': { open: '08:00', close: '22:00' },
      'Sábado': { open: '08:00', close: '18:00' },
      'Domingo': { open: '08:00', close: '18:00' }
    }
  };

  const [newCourt, setNewCourt] = useState(initialCourtState);

  const daysOfWeek = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];

  const sportOptions = ['Futebol', 'Basquete', 'Vôlei', 'Tênis'];

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await api.get('/courts');
      setCourts(response.data);
    } catch (error) {
      setError('Erro ao carregar quadras');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (court) => {
    setSelectedCourt(court);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      try {
        await api.delete(`/courts/${id}`);
        fetchCourts();
      } catch (error) {
        setError('Erro ao excluir quadra');
        console.error(error);
      }
    }
  };

  const handleUpdateCourt = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/courts/${selectedCourt._id}`, selectedCourt);
      setShowEditModal(false);
      fetchCourts();
    } catch (error) {
      setError('Erro ao atualizar quadra');
      console.error(error);
    }
  };

  const handleCreateCourt = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courts', newCourt);
      setShowCreateModal(false);
      setNewCourt(initialCourtState);
      fetchCourts();
    } catch (error) {
      setError('Erro ao criar quadra');
      console.error(error);
    }
  };

  const handleOperatingHoursChange = (day, field, value, isNewCourt = false) => {
    const courtData = isNewCourt ? newCourt : selectedCourt;
    const setCourt = isNewCourt ? setNewCourt : setSelectedCourt;

    setCourt({
      ...courtData,
      operatingHours: {
        ...courtData.operatingHours,
        [day]: {
          ...courtData.operatingHours[day],
          [field]: value
        }
      }
    });
  };

  const handleSportsChange = (sport, isNewCourt = false) => {
    const courtData = isNewCourt ? newCourt : selectedCourt;
    const setCourt = isNewCourt ? setNewCourt : setSelectedCourt;
    
    const updatedSports = courtData.sports.includes(sport)
      ? courtData.sports.filter(s => s !== sport)
      : [...courtData.sports, sport];
    
    setCourt({
      ...courtData,
      sports: updatedSports
    });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Quadras</h2>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          Nova Quadra
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Localização</th>
            <th>Esportes</th>
            <th>Preço/Hora</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {courts.map((court) => (
            <tr key={court._id}>
              <td>{court.name}</td>
              <td>{court.location}</td>
              <td>{court.sports.join(', ')}</td>
              <td>R$ {court.pricePerHour}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(court)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(court._id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Quadra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCourt}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedCourt?.name || ''}
                onChange={(e) => setSelectedCourt({
                  ...selectedCourt,
                  name: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedCourt?.description || ''}
                onChange={(e) => setSelectedCourt({
                  ...selectedCourt,
                  description: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={selectedCourt?.location || ''}
                onChange={(e) => setSelectedCourt({
                  ...selectedCourt,
                  location: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preço por Hora</Form.Label>
              <Form.Control
                type="number"
                value={selectedCourt?.pricePerHour || ''}
                onChange={(e) => setSelectedCourt({
                  ...selectedCourt,
                  pricePerHour: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Esportes</Form.Label>
              <div>
                {sportOptions.map(sport => (
                  <Form.Check
                    key={sport}
                    type="checkbox"
                    label={sport}
                    checked={selectedCourt?.sports.includes(sport)}
                    onChange={() => handleSportsChange(sport)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Horários de Funcionamento</Form.Label>
              {daysOfWeek.map(day => (
                <Row key={day} className="mb-2">
                  <Col xs={4}>
                    <Form.Label>{day}</Form.Label>
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="time"
                      value={selectedCourt?.operatingHours[day]?.open || ''}
                      onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="time"
                      value={selectedCourt?.operatingHours[day]?.close || ''}
                      onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                    />
                  </Col>
                </Row>
              ))}
            </Form.Group>

            <Button variant="primary" type="submit">
              Salvar Alterações
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Criação */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nova Quadra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateCourt}>
            {/* Mesmos campos do modal de edição, mas usando newCourt ao invés de selectedCourt */}
            {/* ... */}
            <Button variant="success" type="submit">
              Criar Quadra
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourtManagement; 
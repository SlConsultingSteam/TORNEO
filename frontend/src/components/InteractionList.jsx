import { useState, useEffect } from 'react';
import { Table, Badge, Card, Spinner, Alert, Row, Col, Modal, Button } from 'react-bootstrap';
import InteractionForm from './InteractionForm';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function InteractionList({ refreshFlag, showToast }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [interactionToDelete, setInteractionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [interactionToEdit, setInteractionToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' para más reciente, 'asc' para más antigua

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching interactions...');
        const res = await fetch('/api/interactions');
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error('No se pudieron cargar las interacciones.');
        const data = await res.json();
        console.log('Interactions data:', data);
        setInteractions(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error('Error fetching interactions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, [refreshFlag, localRefresh]);

  const handleDeleteClick = (interaction) => {
    setInteractionToDelete(interaction);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!interactionToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/interactions/${interactionToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar la interacción.');
      setShowDeleteModal(false);
      setInteractionToDelete(null);
      setLocalRefresh(f => !f);
      showToast('Interacción eliminada con éxito!', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (interaction) => {
    setInteractionToEdit(interaction);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setInteractionToEdit(null);
    setLocalRefresh(f => !f);
    showToast('Interacción editada con éxito!', 'success');
  };

  const renderContent = (sortedAndFilteredInteractions) => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <div className="loading-container">
            <Spinner 
              animation="border" 
              variant="info" 
              size="lg"
              style={{ 
                width: '3rem', 
                height: '3rem',
                borderWidth: '0.25em'
              }}
            />
            <p className="mt-4 fs-5 fw-medium">Cargando interacciones...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="danger" className="border-0 shadow">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      );
    }
    if (sortedAndFilteredInteractions.length === 0) {
      return (
        <div className="text-center p-5">
          <div 
            className="mb-4"
            style={{ 
              fontSize: '4rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <i className="bi bi-chat-dots"></i>
          </div>
          <h4 className="fw-bold mb-2">Aún no hay interacciones</h4>
          <p className="opacity-75">¡Registra la primera interacción!</p>
        </div>
      );
    }
    return (
      <div className="table-responsive">
        <Table 
          striped 
          bordered 
          hover 
          responsive
          className="interaction-table"
          style={{
            background: 'var(--color-bg-table)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <thead>
            <tr>
              <th className="fw-bold text-center" style={{ padding: '1rem' }}>
                <i className="bi bi-person me-2"></i>
                Cliente
              </th>
              <th className="fw-bold text-center" style={{ padding: '1rem' }}>
                <i className="bi bi-tag me-2"></i>
                Tipo
              </th>
              <th className="fw-bold text-center" style={{ padding: '1rem' }}>
                <i className="bi bi-calendar me-2"></i>
                Fecha
              </th>
              <th className="fw-bold text-center" style={{ padding: '1rem' }}>
                <i className="bi bi-star me-2"></i>
                Potencial Recompra
              </th>
              <th className="fw-bold text-center" style={{ padding: '1rem', minWidth: 120 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredInteractions.map((inter) => (
              <tr 
                key={inter.id}
                className="interaction-row"
                style={{ 
                  transition: 'all 0.2s ease'
                }}
              >
                <td className="align-middle fw-bold text-center" style={{ padding: '1rem' }}>
                  {inter.clientId}
                </td>
                <td className="align-middle text-center">
                  <Badge 
                    bg={inter.type === 'Estratégica' ? 'info' : inter.type === 'Preventa' ? 'warning' : 'success'}
                    className="fw-medium px-3 py-2"
                    style={{
                      backgroundColor: inter.type === 'Estratégica' ? 'var(--color-info)' : 
                                    inter.type === 'Preventa' ? 'var(--color-warning)' : 'var(--color-success)'
                    }}
                  >
                    {inter.type}
                  </Badge>
                </td>
                <td className="align-middle text-center" style={{ padding: '1rem' }}>
                  {new Date(inter.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="align-middle text-center">
                  {inter.repurchasePotential ? 
                    <Badge 
                      bg="success" 
                      className="fw-medium px-3 py-2"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    >
                      <i className="bi bi-star-fill me-1"></i>
                      Sí
                    </Badge> : 
                    <Badge 
                      bg="secondary" 
                      className="fw-medium px-3 py-2"
                      style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                    >
                      No
                    </Badge>
                  }
                </td>
                <td className="align-middle text-center" style={{ minWidth: 120, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                      title="Editar"
                      style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, background: '#0d6efd', borderColor: '#0d6efd' }}
                      onClick={() => handleEditClick(inter)}
                    >
                      <i className="bi bi-pencil" style={{ fontSize: 20, color: 'white' }}></i>
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                      title="Eliminar"
                      style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, background: '#dc3545', borderColor: '#dc3545' }}
                      onClick={() => handleDeleteClick(inter)}
                    >
                      <i className="bi bi-trash" style={{ fontSize: 20, color: 'white' }}></i>
                    </button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const sortedAndFilteredInteractions = interactions
    .filter(interaction =>
      interaction.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <Card 
      className="h-100 shadow border-0 interaction-list-card"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        className="list-gradient-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          opacity: 0.8
        }}
      />
      <Card.Header className="bg-surface border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
        <Row className="align-items-center mb-3">
          <Col xs={12} md={6}>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--color-text-header)' }}>
              Interacciones Recientes ({sortedAndFilteredInteractions.length})
            </h5>
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-end align-items-center mt-3 mt-md-0">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <input 
                type="text" 
                className="form-control"
                placeholder="Buscar cliente o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border-input)', color: 'var(--color-text-main)' }}
              />
              <button 
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
                style={{ borderColor: 'var(--color-border-input)', color: 'var(--color-text-main)' }}
              >
                <i className={`bi bi-sort-numeric-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
              </button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="p-0">
        {renderContent(sortedAndFilteredInteractions)}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar esta interacción?
            <br />
            <span className="text-danger fw-bold">Esta acción no se puede deshacer.</span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="md">
          <Modal.Body className="position-relative" style={{ background: 'var(--color-bg-card-dark)', padding: '0' }}>
            <button
              type="button"
              className="btn-close-custom"
              onClick={() => setShowEditModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                padding: '0.5rem',
                opacity: 1,
                transition: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1050
              }}
            >
              <i className="bi bi-x-lg" style={{ color: 'white', fontSize: 24 }}></i>
            </button>
            <InteractionForm
              initialValues={interactionToEdit}
              editMode={true}
              onSuccess={handleEditSuccess}
              onError={(msg) => showToast(msg, 'danger')}
            />
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
}

export default InteractionList; 
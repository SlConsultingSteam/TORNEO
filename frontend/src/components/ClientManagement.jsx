import { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Row, Col, Spinner, Alert, Badge, Modal } from 'react-bootstrap';

function ClientJourneyModal({ client, interactions, show, onHide }) {
  if (!client) return null;

  const clientInteractions = interactions
    .filter(i => i.clientId === client.name)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <i className="bi bi-graph-up me-3 fs-4"></i>
          <span>Historial de Interacciones: {client.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {clientInteractions.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="fw-bold">
                    <i className="bi bi-calendar me-2"></i>
                    Fecha
                  </th>
                  <th className="fw-bold">
                    <i className="bi bi-tag me-2"></i>
                    Tipo
                  </th>
                  <th className="fw-bold">
                    <i className="bi bi-chat me-2"></i>
                    Notas
                  </th>
                  <th className="fw-bold">
                    <i className="bi bi-star me-2"></i>
                    Potencial Recompra
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientInteractions.map((inter) => (
                  <tr key={inter.id}>
                    <td>
                      {new Date(inter.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
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
                    <td>
                      {inter.notes || '-'}
                    </td>
                    <td className="align-middle">
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-4">
            <i className="bi bi-graph-down" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3">No hay interacciones registradas para este cliente.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

function ClientManagement({ showToast }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Activo');
  const [type, setType] = useState('Ordinario');
  const [loading, setLoading] = useState(false);
  
  const [clients, setClients] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchClients = async () => {
    setListLoading(true);
    setListError('');
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('No se pudieron cargar los clientes.');
      const data = await res.json();
      setClients(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      setListError(err.message);
    } finally {
      setListLoading(false);
    }
  };

  const fetchInteractions = async () => {
    try {
      const res = await fetch('/api/interactions');
      const data = await res.json();
      setInteractions(data);
    } catch (err) {
      // Manejar error silenciosamente
    }
  };

  useEffect(() => {
    fetchClients();
    fetchInteractions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status, type })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar el cliente');
      }
      setName('');
      setStatus('Activo');
      setType('Ordinario');
      fetchClients();
      showToast('Cliente registrado con éxito!', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Activo': 
        return (
          <Badge 
            bg="success" 
            className="fw-medium px-3 py-2"
            style={{ backgroundColor: 'var(--color-success)' }}
          >
            <i className="bi bi-check-circle me-1"></i>
            Activo
          </Badge>
        );
      case 'Dormido': 
        return (
          <Badge 
            bg="warning" 
            className="fw-medium px-3 py-2"
            style={{ backgroundColor: 'var(--color-warning)' }}
          >
            <i className="bi bi-moon me-1"></i>
            Dormido
          </Badge>
        );
      default: 
        return (
          <Badge 
            bg="secondary" 
            className="fw-medium px-3 py-2"
            style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
          >
            Desconocido
          </Badge>
        );
    }
  };

  const getTypeBadge = (type) => {
    return type === 'Premium' ? 
      <Badge 
        className="fw-medium px-3 py-2"
        bg="info"
        style={{ backgroundColor: 'var(--color-info)' }}
      >
        <i className="bi bi-gem me-1"></i>
        Premium
      </Badge> : 
      <Badge 
        bg="info" 
        className="fw-medium px-3 py-2"
        style={{ backgroundColor: 'var(--color-info)' }}
      >
        <i className="bi bi-person me-1"></i>
        Ordinario
      </Badge>;
  };

  return (
    <div className="clients-dashboard">
      <div className="mb-5 text-center">
        <h1 
          className="fw-bold mb-3 display-4"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <i className="bi bi-people me-3"></i>
          Gestión de Clientes
        </h1>
        <p 
          className="opacity-75 fs-5 fw-medium"
          style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            color: 'var(--color-text-secondary)'
          }}
        >
          Administra tu base de clientes y visualiza su historial de interacciones
        </p>
      </div>

      <Row className="g-4 align-items-stretch">
        <Col md={5} lg={4}>
          <Card 
            className="h-100 shadow border-0 client-form-card"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div 
              className="form-gradient-overlay"
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
            <Card.Body className="d-flex flex-column p-4 position-relative">
              <Card.Title 
                className="mb-4 fw-bold text-center"
                style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem'
                }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Añadir Cliente
              </Card.Title>
              <Form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                    <i className="bi bi-person me-2"></i>
                    Nombre del Cliente
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ingresa el nombre del cliente" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: '2px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                    <i className="bi bi-activity me-2"></i>
                    Estado
                  </Form.Label>
                  <Form.Select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)} 
                    required
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: '2px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <option>Activo</option>
                    <option>Dormido</option>
                    <option>Desconocido</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                    <i className="bi bi-tag me-2"></i>
                    Tipo
                  </Form.Label>
                  <Form.Select 
                    value={type} 
                    onChange={e => setType(e.target.value)} 
                    required
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: '2px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <option>Ordinario</option>
                    <option>Premium</option>
                  </Form.Select>
                </Form.Group>
                <div className="mt-auto pt-3">
                  <Button 
                    type="submit" 
                    className="w-100 fw-bold btn-vibe" 
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Registrar Cliente
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7} lg={8}>
          <Card 
            className="h-100 shadow border-0 client-list-card"
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
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                opacity: 0.8
              }}
            />
            <Card.Body className="p-4 position-relative">
              <Card.Title 
                className="fw-bold mb-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem'
                }}
              >
                <i className="bi bi-people me-2"></i>
                Lista de Clientes
                <Badge 
                  className="ms-3 fw-bold px-3 py-2 fs-6"
                  style={{ 
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    border: 'none'
                  }}
                >
                  {clients.length}
                </Badge>
              </Card.Title>
              {listLoading && (
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
                    <p className="mt-4 fs-5 fw-medium">Cargando clientes...</p>
                  </div>
                </div>
              )}
              {listError && (
                <Alert variant="danger" className="border-0 shadow">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {listError}
                </Alert>
              )}
              {!listLoading && !listError && (
                <div className="table-responsive">
                  <Table 
                    striped 
                    bordered 
                    hover 
                    responsive
                    className="client-table"
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
                          Nombre
                        </th>
                        <th className="fw-bold text-center" style={{ padding: '1rem' }}>
                          <i className="bi bi-activity me-2"></i>
                          Estado
                        </th>
                        <th className="fw-bold text-center" style={{ padding: '1rem' }}>
                          <i className="bi bi-tag me-2"></i>
                          Tipo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((c) => (
                        <tr 
                          key={c.id} 
                          onClick={() => handleRowClick(c)} 
                          style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          className="client-row"
                        >
                          <td className="align-middle fw-bold text-center" style={{ padding: '1rem' }}>
                            {c.name}
                          </td>
                          <td className="align-middle text-center">{getStatusBadge(c.status)}</td>
                          <td className="align-middle text-center">{getTypeBadge(c.type)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {!listLoading && clients.length === 0 && (
                <div className="text-center p-5">
                  <div 
                    className="mb-4"
                    style={{ 
                      fontSize: '4rem',
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    <i className="bi bi-people"></i>
                  </div>
                  <h4 className="fw-bold mb-2">No hay clientes registrados</h4>
                  <p className="opacity-75">¡Comienza agregando tu primer cliente!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ClientJourneyModal 
        client={selectedClient} 
        interactions={interactions}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
}

export default ClientManagement; 
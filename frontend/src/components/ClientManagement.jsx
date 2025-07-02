import { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Row, Col, FloatingLabel, Spinner, Alert, Badge, Modal } from 'react-bootstrap';

function ClientJourneyModal({ client, interactions, show, onHide }) {
  if (!client) return null;

  const clientInteractions = interactions
    .filter(i => i.clientId === client.name) // Asumiendo que clientId es el nombre. Mejorar si se usa ID.
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-vibe-surface">
        <Modal.Title>Customer Journey: {client.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-vibe-surface">
        {clientInteractions.length > 0 ? (
          <Table borderless hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Notas</th>
                <th>Potencial Recompra</th>
              </tr>
            </thead>
            <tbody>
              {clientInteractions.map(inter => (
                <tr key={inter.id}>
                  <td>{new Date(inter.date).toLocaleDateString()}</td>
                  <td>{inter.type}</td>
                  <td>{inter.notes || '-'}</td>
                  <td>{inter.repurchasePotential ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted text-center">No hay interacciones registradas para este cliente.</p>
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
    // Cargar interacciones para el modal
    try {
      const res = await fetch('/api/interactions');
      const data = await res.json();
      setInteractions(data);
    } catch (err) {
      // Manejar error silenciosamente o con un toast
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
      fetchClients(); // Refrescar la lista
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
      case 'Activo': return <Badge bg="success">Activo</Badge>;
      case 'Dormido': return <Badge bg="warning">Dormido</Badge>;
      default: return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    return type === 'Premium' ? 
      <Badge style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>Premium</Badge> : 
      <Badge bg="info">Ordinario</Badge>;
  };

  return (
    <>
      <Row className="g-4 align-items-stretch">
        <Col md={5} lg={4}>
          <Card className="card-vibe h-100">
            <Card.Body className="d-flex flex-column">
              <h4 className="mb-4 fw-bold text-vibe-primary">Añadir Cliente</h4>
              <Form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
                <FloatingLabel controlId="floatingName" label="Cliente / Contactos" className="mb-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Cliente / Contactos (separados por comas)" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingStatus" label="Estado" className="mb-3">
                  <Form.Select value={status} onChange={e => setStatus(e.target.value)} required>
                    <option>Activo</option>
                    <option>Dormido</option>
                    <option>Desconocido</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingType" label="Tipo" className="mb-3">
                  <Form.Select value={type} onChange={e => setType(e.target.value)} required>
                    <option>Ordinario</option>
                    <option>Premium</option>
                  </Form.Select>
                </FloatingLabel>
                <Button type="submit" className="btn-vibe w-100 mt-auto" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Registrar Cliente'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7} lg={8}>
          <Card className="card-vibe h-100">
            <Card.Body>
              <h4 className="mb-4 fw-bold text-vibe-primary">Lista de Clientes</h4>
              {listLoading && <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>}
              {listError && <Alert variant="danger">{listError}</Alert>}
              {!listLoading && !listError && (
                <div className="table-responsive">
                  <Table borderless hover>
                    <thead style={{ borderBottom: '1px solid var(--color-primary)' }}>
                      <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(c => (
                        <tr key={c.id} onClick={() => handleRowClick(c)} style={{ cursor: 'pointer' }}>
                          <td className="align-middle">{c.name}</td>
                          <td className="align-middle">{getStatusBadge(c.status)}</td>
                          <td className="align-middle">{getTypeBadge(c.type)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {!listLoading && clients.length === 0 && <p className="text-muted text-center mt-3">No hay clientes registrados.</p>}
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
    </>
  );
}

export default ClientManagement; 
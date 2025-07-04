import { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';

function InteractionForm({ onSuccess, onError, initialValues = null, editMode = false }) {
  const [client, setClient] = useState(initialValues ? initialValues.clientId : '');
  const [type, setType] = useState(initialValues ? initialValues.type : 'Estratégica');
  const [date, setDate] = useState(initialValues ? initialValues.date : '');
  const [notes, setNotes] = useState(initialValues ? initialValues.notes : '');
  const [repurchasePotential, setRepurchasePotential] = useState(initialValues ? initialValues.repurchasePotential : false);
  const [loading, setLoading] = useState(false);
  const [clientsList, setClientsList] = useState([]);

  useEffect(() => {
    if (initialValues) {
      setClient(initialValues.clientId);
      setType(initialValues.type);
      setDate(initialValues.date);
      setNotes(initialValues.notes);
      setRepurchasePotential(initialValues.repurchasePotential);
    }

    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('No se pudieron cargar los clientes para el selector.');
        const data = await res.json();
        setClientsList(data);
        if (initialValues && initialValues.clientId) {
          const foundClient = data.find(c => c.name === initialValues.clientId);
          if (foundClient) {
            setClient(foundClient.name);
          }
        }
      } catch (err) {
        onError(`Error al cargar clientes: ${err.message}`);
      }
    };
    fetchClients();

  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res, data;
      if (editMode && initialValues && initialValues.id) {
        res = await fetch(`/api/interactions/${initialValues.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: client, type, date, notes, repurchasePotential })
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al editar la interacción');
      } else {
        res = await fetch('/api/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: client, type, date, notes, repurchasePotential })
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar la interacción');
        setClient('');
        setType('Estratégica');
        setDate('');
        setNotes('');
        setRepurchasePotential(false);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="h-100 shadow border-0 interaction-form-card"
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          opacity: 0.8
        }}
      />
      <Card.Body 
        className="d-flex flex-column position-relative"
        style={{
          background: 'var(--color-bg-card-dark)',
          padding: editMode ? '3.5rem 1.5rem 1.5rem 1.5rem' : '1.5rem'
        }}
      >
        <Card.Title 
          className="mb-4 fw-bold text-center"
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.5rem',
            marginTop: '0'
          }}
        >
          <i className={`bi ${editMode ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {editMode ? 'Editar Interacción' : 'Nueva Interacción'}
        </Card.Title>
        <Form onSubmit={handleSubmit} className="flex-grow-1">
          <Row className="g-3 align-items-start">
            <Col xs={12}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-person me-2"></i>
                  Nombre del Cliente
                </Form.Label>
                <Form.Select 
                  value={client} 
                  onChange={e => setClient(e.target.value)} 
                  required 
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-text-main)',
                    height: '48px',
                  }}
                >
                  <option value="">Selecciona un cliente</option>
                  {clientsList.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-2 d-flex flex-column">
                <Form.Label className="fw-bold fs-6 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-tag me-2"></i>
                  Tipo de Interacción
                </Form.Label>
                <Form.Select 
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  required
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-text-main)',
                    height: '48px',
                  }}
                >
                  <option value="Estratégica">Estratégica</option>
                  <option value="Preventa">Preventa</option>
                  <option value="Postventa">Postventa</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-2 d-flex flex-column">
                <Form.Label className="fw-bold fs-6 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-calendar me-2"></i>
                  Fecha
                </Form.Label>
                <Form.Control 
                  type="date" 
                  placeholder="Selecciona la fecha" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  required 
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-text-main)',
                    height: '48px',
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-chat-text me-2"></i>
                  Notas Breves
                </Form.Label>
                <Form.Control 
                  as="textarea" 
                  placeholder="Describe los detalles de la interacción..." 
                  style={{ 
                    height: '120px', 
                    resize: 'none',
                    background: 'var(--color-bg-surface)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-text-main)'
                  }} 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-2">
                <Form.Check 
                  type="switch"
                  id="repurchase-switch"
                  label={
                    <span className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                      <i className="bi bi-star me-2"></i>
                      Potencial de Recompra
                    </span>
                  }
                  checked={repurchasePotential}
                  onChange={e => setRepurchasePotential(e.target.checked)}
                  style={{
                    '--bs-form-check-bg': 'var(--color-bg-surface)',
                    '--bs-form-check-border-color': 'var(--color-border)'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-auto pt-3">
            <Button 
              type="submit" 
              className="w-100 fw-bold btn-vibe" 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '1.1rem',
                color: 'white'
              }}
            >
              {loading ? (
                <>
                  <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                    className="me-2"
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  {editMode ? 'Guardando...' : 'Registrando...'}
                </>
              ) : (
                <>
                  <i className={`bi ${editMode ? 'bi-save' : 'bi-check-circle'} me-2`}></i>
                  {editMode ? 'Guardar Cambios' : 'Registrar Interacción'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default InteractionForm; 
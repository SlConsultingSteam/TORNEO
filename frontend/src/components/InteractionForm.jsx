import { useState } from 'react';
import { Form, Button, Card, FloatingLabel, Spinner } from 'react-bootstrap';

function InteractionForm({ onSuccess, onError }) {
  const [client, setClient] = useState('');
  const [type, setType] = useState('Estratégica');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [repurchasePotential, setRepurchasePotential] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client, type, date, notes, repurchasePotential })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar la interacción');
      }
      setClient('');
      setType('Estratégica');
      setDate('');
      setNotes('');
      setRepurchasePotential(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-vibe h-100">
      <Card.Body className="d-flex flex-column">
        <h4 className="mb-4 fw-bold text-vibe-primary">Nueva Interacción</h4>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="floatingClient" label="Nombre del Cliente" className="mb-3">
            <Form.Control type="text" placeholder="Nombre del Cliente" value={client} onChange={e => setClient(e.target.value)} required />
          </FloatingLabel>
          
          <FloatingLabel controlId="floatingType" label="Tipo de Interacción" className="mb-3">
            <Form.Select value={type} onChange={e => setType(e.target.value)} required>
              <option value="Estratégica">Estratégica</option>
              <option value="Preventa">Preventa</option>
              <option value="Postventa">Postventa</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingDate" label="Fecha" className="mb-3">
            <Form.Control type="date" placeholder="Fecha" value={date} onChange={e => setDate(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="floatingNotes" label="Notas Breves" className="mb-3">
            <Form.Control as="textarea" placeholder="Notas Breves" style={{ height: '100px' }} value={notes} onChange={e => setNotes(e.target.value)} />
          </FloatingLabel>

          <Form.Group className="mb-4">
            <Form.Check 
              type="switch"
              id="repurchase-switch"
              label="Potencial de Recompra"
              checked={repurchasePotential}
              onChange={e => setRepurchasePotential(e.target.checked)}
            />
          </Form.Group>
          
          <Button type="submit" className="btn-vibe w-100 mt-auto" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Registrar'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default InteractionForm; 
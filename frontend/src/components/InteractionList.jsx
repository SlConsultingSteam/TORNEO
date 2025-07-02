import { useState, useEffect } from 'react';
import { Table, Badge, Card, Spinner, Alert } from 'react-bootstrap';

function InteractionList({ refreshFlag }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/interactions');
        if (!res.ok) throw new Error('No se pudieron cargar las interacciones.');
        const data = await res.json();
        setInteractions(data.sort((a, b) => b.id - a.id)); // Ordenar por más reciente
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, [refreshFlag]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (interactions.length === 0) {
      return (
        <div className="text-center p-5">
          <p className="h5 text-muted">Aún no hay interacciones.</p>
          <p>¡Registra la primera!</p>
        </div>
      );
    }

    return (
      <Table borderless hover responsive>
        <thead style={{ borderBottom: '1px solid var(--color-primary)' }}>
          <tr>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Potencial Recompra</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map(inter => (
            <tr key={inter.id}>
              <td className="align-middle">{inter.clientId}</td>
              <td className="align-middle">{inter.type}</td>
              <td className="align-middle">{new Date(inter.date).toLocaleDateString()}</td>
              <td className="align-middle">
                {inter.repurchasePotential ? 
                  <Badge pill bg="success" className="text-dark fw-bold">Sí</Badge> : 
                  <Badge pill bg="secondary" className="text-dark fw-bold">No</Badge>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card className="card-vibe h-100">
      <Card.Body>
        <h4 className="mb-4 fw-bold text-vibe-primary">Interacciones Recientes</h4>
        {renderContent()}
      </Card.Body>
    </Card>
  );
}

export default InteractionList; 
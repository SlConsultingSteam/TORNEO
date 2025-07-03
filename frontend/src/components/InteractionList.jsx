import { useState, useEffect } from 'react';
import { Table, Badge, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';

function InteractionList({ refreshFlag }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, [refreshFlag]);

  const renderContent = () => {
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
    if (interactions.length === 0) {
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
            </tr>
          </thead>
          <tbody>
            {interactions.map((inter) => (
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

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
      <Card.Body className="p-4 position-relative">
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
          <i className="bi bi-list-ul me-2"></i>
          Interacciones Recientes
          <Badge 
            className="ms-3 fw-bold px-3 py-2 fs-6"
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none'
            }}
          >
            {interactions.length}
          </Badge>
        </Card.Title>
        {renderContent()}
      </Card.Body>
    </Card>
  );
}

export default InteractionList; 
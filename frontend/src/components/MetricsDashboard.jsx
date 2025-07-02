import { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Spinner, Alert } from 'react-bootstrap';

function MetricCard({ title, value, children, unit = '' }) {
  return (
    <Card className="card-vibe h-100 text-center">
      <Card.Body>
        <Card.Title as="h5" className="text-muted mb-3">{title}</Card.Title>
        <div className="display-4 fw-bold mb-3">
          {value}
          {unit && <span className="fs-4 ms-2">{unit}</span>}
        </div>
        {children}
      </Card.Body>
    </Card>
  );
}

// Función auxiliar para calcular la diferencia en días
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const difference = Math.abs(d2 - d1);
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

function MetricsDashboard() {
  const [data, setData] = useState({ clients: [], interactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [clientsRes, interactionsRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/interactions')
        ]);
        if (!clientsRes.ok || !interactionsRes.ok) {
          throw new Error('No se pudieron cargar los datos para las métricas.');
        }
        const clients = await clientsRes.json();
        const interactions = await interactionsRes.json();
        setData({ clients, interactions });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Métricas
  const { clients, interactions } = data;
  const totalConversaciones = interactions.length;
  const totalRecompra = interactions.filter(i => i.repurchasePotential).length;
  const totalClientes = clients.length;
  
  const ordinarios = clients.filter(c => c.type === 'Ordinario').length;
  const premium = clients.filter(c => c.type === 'Premium').length;
  
  const activos = clients.filter(c => c.status === 'Activo').length;
  const dormidos = clients.filter(c => c.status === 'Dormido').length;

  const pct = (value, total) => total > 0 ? (value / total) * 100 : 0;

  // Cálculo de Duración Promedio de Relación
  const interactionsByClient = interactions.reduce((acc, inter) => {
    acc[inter.clientId] = acc[inter.clientId] || [];
    acc[inter.clientId].push(new Date(inter.date));
    return acc;
  }, {});
  
  const relationDurations = Object.values(interactionsByClient)
    .filter(dates => dates.length > 1) // Solo clientes con más de una interacción
    .map(dates => {
      const firstDate = new Date(Math.min.apply(null, dates));
      const lastDate = new Date(Math.max.apply(null, dates));
      return daysBetween(firstDate, lastDate);
    });

  const avgDuration = relationDurations.length > 0
    ? Math.round(relationDurations.reduce((a, b) => a + b, 0) / relationDurations.length)
    : 0;

  return (
    <Row className="g-4">
      <Col md={6} lg={3}>
        <MetricCard title="Total Conversaciones" value={totalConversaciones} />
      </Col>
      <Col md={6} lg={3}>
        <MetricCard title="Duración Media Relación" value={avgDuration} unit="días" />
      </Col>
      <Col md={6} lg={3}>
        <MetricCard title="Oportunidades Recompra" value={totalRecompra}>
          <ProgressBar 
            now={pct(totalRecompra, totalConversaciones)} 
            label={`${Math.round(pct(totalRecompra, totalConversaciones))}%`} 
            variant="info" visuallyHidden 
          />
        </MetricCard>
      </Col>
      <Col md={6} lg={3}>
        {/* Espacio para otra métrica si se necesita */}
      </Col>
      <Col md={6} lg={6}>
        <Card className="card-vibe h-100">
          <Card.Body>
            <h5 className="text-muted mb-3">Distribución por Tipo</h5>
            <div className="mb-2">Ordinario: <b>{ordinarios}</b> ({Math.round(pct(ordinarios, totalClientes))}%)</div>
            <ProgressBar now={pct(ordinarios, totalClientes)} style={{ backgroundColor: 'var(--color-primary)' }} className="mb-3" />
            
            <div>Premium: <b>{premium}</b> ({Math.round(pct(premium, totalClientes))}%)</div>
            <ProgressBar now={pct(premium, totalClientes)} style={{ backgroundColor: 'var(--color-secondary)' }} />
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} lg={6}>
        <Card className="card-vibe h-100">
          <Card.Body>
            <h5 className="text-muted mb-3">Distribución por Estado</h5>
            <ProgressBar>
              <ProgressBar striped variant="success" now={pct(activos, totalClientes)} key={1} label={`Activos (${activos})`} />
              <ProgressBar striped variant="warning" now={pct(dormidos, totalClientes)} key={2} label={`Dormidos (${dormidos})`} />
              <ProgressBar striped variant="secondary" now={100 - pct(activos, totalClientes) - pct(dormidos, totalClientes)} key={3} label={`Otros (${totalClientes - activos - dormidos})`} />
            </ProgressBar>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default MetricsDashboard; 
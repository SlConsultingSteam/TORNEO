import { useState, useEffect } from 'react';
import { Card, Row, Col, ProgressBar, Spinner, Alert, Badge } from 'react-bootstrap';

function MetricCard({ title, value, children, unit = '', icon, gradient = 'primary' }) {
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    purple: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  };

  return (
    <Card 
      className="h-100 shadow border-0 metric-card" 
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        className="metric-gradient-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradients[gradient],
          opacity: 0.8
        }}
      />
      <Card.Body className="p-4 text-center position-relative">
        <div 
          className="mb-4 metric-icon"
          style={{ 
            fontSize: '3.5rem',
            background: gradients[gradient],
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}
        >
          {icon}
        </div>
        <Card.Title 
          as="h5" 
          className="mb-3 fw-bold fs-6"
          style={{ 
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {title}
        </Card.Title>
        <div 
          className="display-5 fw-bold mb-3 metric-value"
          style={{
            background: gradients[gradient],
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {value}
          {unit && <span className="fs-6 ms-2 opacity-75">{unit}</span>}
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
          <p className="mt-4 fs-5 fw-medium">Cargando métricas...</p>
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

  // Métricas
  const { clients, interactions } = data;
  const totalConversaciones = interactions.length;
  const totalRecompra = interactions.filter(i => i.repurchasePotential).length;
  const totalClientes = clients.length;
  
  const ordinarios = clients.filter(c => c.type === 'Ordinario').length;
  const premium = clients.filter(c => c.type === 'Premium').length;
  
  const activos = clients.filter(c => c.status === 'Activo').length;
  const dormidos = clients.filter(c => c.status === 'Dormido').length;
  const otros = totalClientes - activos - dormidos;

  const pct = (value, total) => total > 0 ? (value / total) * 100 : 0;

  // Cálculo de Duración Promedio de Relación
  const interactionsByClient = interactions.reduce((acc, inter) => {
    acc[inter.clientId] = acc[inter.clientId] || [];
    acc[inter.clientId].push(new Date(inter.date));
    return acc;
  }, {});
  
  const relationDurations = Object.values(interactionsByClient)
    .filter(dates => dates.length > 1)
    .map(dates => {
      const firstDate = new Date(Math.min.apply(null, dates));
      const lastDate = new Date(Math.max.apply(null, dates));
      return daysBetween(firstDate, lastDate);
    });

  const avgDuration = relationDurations.length > 0
    ? Math.round(relationDurations.reduce((a, b) => a + b, 0) / relationDurations.length)
    : 0;

  return (
    <div className="metrics-dashboard">
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
          <i className="bi bi-graph-up me-3"></i>
          Dashboard de Métricas
        </h1>
        <p 
          className="opacity-75 fs-5 fw-medium"
          style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            color: 'var(--color-text-secondary)'
          }}
        >
          Análisis completo de tu base de clientes e interacciones
        </p>
      </div>

      <Row className="g-4 mb-5">
        <Col xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Total Conversaciones" 
            value={totalConversaciones}
            icon={<i className="bi bi-chat-dots"></i>}
            gradient="info"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Duración Media Relación" 
            value={avgDuration} 
            unit="días"
            icon={<i className="bi bi-calendar-range"></i>}
            gradient="success"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Oportunidades Recompra" 
            value={totalRecompra}
            icon={<i className="bi bi-star"></i>}
            gradient="warning"
          >
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold fs-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Tasa de Éxito
                </span>
                <span 
                  className="fw-bold fs-5"
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {Math.round(pct(totalRecompra, totalConversaciones))}%
                </span>
              </div>
              <ProgressBar 
                now={pct(totalRecompra, totalConversaciones)} 
                className="custom-progress"
                style={{ 
                  height: '12px', 
                  borderRadius: '6px',
                  background: 'var(--color-bg-elevated)'
                }}
              />
            </div>
          </MetricCard>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Total Clientes" 
            value={totalClientes}
            icon={<i className="bi bi-people"></i>}
            gradient="purple"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card 
            className="h-100 shadow border-0 distribution-card"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px'
            }}
          >
            <Card.Body className="p-4">
              <Card.Title 
                className="fw-bold mb-4 fs-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <i className="bi bi-tag me-2"></i>
                Distribución por Tipo
              </Card.Title>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-5">
                    <i className="bi bi-person me-2"></i>
                    Ordinario
                  </span>
                  <Badge 
                    className="fw-bold px-3 py-2 fs-6"
                    style={{ 
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      border: 'none'
                    }}
                  >
                    {ordinarios} ({Math.round(pct(ordinarios, totalClientes))}%)
                  </Badge>
                </div>
                <ProgressBar 
                  now={pct(ordinarios, totalClientes)} 
                  className="custom-progress"
                  style={{ 
                    height: '16px', 
                    borderRadius: '8px',
                    background: 'var(--color-bg-elevated)'
                  }}
                />
              </div>
              
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-5">
                    <i className="bi bi-gem me-2"></i>
                    Premium
                  </span>
                  <Badge 
                    className="fw-bold px-3 py-2 fs-6"
                    style={{ 
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      border: 'none'
                    }}
                  >
                    {premium} ({Math.round(pct(premium, totalClientes))}%)
                  </Badge>
                </div>
                <ProgressBar 
                  now={pct(premium, totalClientes)} 
                  className="custom-progress"
                  style={{ 
                    height: '16px', 
                    borderRadius: '8px',
                    background: 'var(--color-bg-elevated)'
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} lg={6}>
          <Card 
            className="h-100 shadow border-0 distribution-card"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px'
            }}
          >
            <Card.Body className="p-4">
              <Card.Title 
                className="fw-bold mb-4 fs-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <i className="bi bi-activity me-2"></i>
                Distribución por Estado
              </Card.Title>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-5">
                    <i className="bi bi-check-circle me-2"></i>
                    Activos
                  </span>
                  <Badge 
                    className="fw-bold px-3 py-2 fs-6"
                    style={{ 
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      border: 'none'
                    }}
                  >
                    {activos} ({Math.round(pct(activos, totalClientes))}%)
                  </Badge>
                </div>
                <ProgressBar 
                  now={pct(activos, totalClientes)} 
                  className="custom-progress"
                  style={{ 
                    height: '16px', 
                    borderRadius: '8px',
                    background: 'var(--color-bg-elevated)'
                  }}
                />
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-5">
                    <i className="bi bi-moon me-2"></i>
                    Dormidos
                  </span>
                  <Badge 
                    className="fw-bold px-3 py-2 fs-6"
                    style={{ 
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: 'none'
                    }}
                  >
                    {dormidos} ({Math.round(pct(dormidos, totalClientes))}%)
                  </Badge>
                </div>
                <ProgressBar 
                  now={pct(dormidos, totalClientes)} 
                  className="custom-progress"
                  style={{ 
                    height: '16px', 
                    borderRadius: '8px',
                    background: 'var(--color-bg-elevated)'
                  }}
                />
              </div>
              
              {otros > 0 && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold fs-5">
                      <i className="bi bi-question-circle me-2"></i>
                      Otros
                    </span>
                    <Badge 
                      className="fw-bold px-3 py-2 fs-6"
                      style={{ 
                        background: 'var(--color-bg-elevated)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {otros} ({Math.round(pct(otros, totalClientes))}%)
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={pct(otros, totalClientes)} 
                    className="custom-progress"
                    style={{ 
                      height: '16px', 
                      borderRadius: '8px',
                      background: 'var(--color-bg-elevated)'
                    }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default MetricsDashboard; 
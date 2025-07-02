import { useState } from 'react'
import { Container, Navbar, Nav, OverlayTrigger, Tooltip, Row, Col, Toast, ToastContainer } from 'react-bootstrap'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InteractionForm from './components/InteractionForm'
import InteractionList from './components/InteractionList'
import ClientManagement from './components/ClientManagement'
import MetricsDashboard from './components/MetricsDashboard'

function App() {
  const [view, setView] = useState('interaccion')
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' })

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant })
  }

  const renderTooltip = (props) => (
    <Tooltip id="vibe-tooltip" {...props}>
      ¡Vibe On!
    </Tooltip>
  )

  const renderView = () => {
    switch (view) {
      case 'interaccion':
        return (
          <Row className="g-4 align-items-stretch">
            <Col md={5} lg={4}>
              <InteractionForm onSuccess={() => {
                setRefreshFlag(f => !f)
                showToast('Interacción registrada con éxito!', 'success')
              }} onError={(msg) => showToast(msg, 'danger')} />
            </Col>
            <Col md={7} lg={8}>
              <InteractionList refreshFlag={refreshFlag} />
            </Col>
          </Row>
        )
      case 'clientes':
        return <ClientManagement showToast={showToast} />
      case 'metricas':
        return <MetricsDashboard />
      default:
        return null
    }
  }

  return (
    <div className="min-vh-100 w-100">
      <Navbar variant="dark" expand="lg" className="mb-4" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-primary)' }}>
        <Container fluid className="px-md-4">
          <OverlayTrigger placement="bottom" overlay={renderTooltip}>
            <Navbar.Brand href="#" className="fw-bold fs-4" onClick={() => showToast('¡Codificando con buena vibra! 🚀', 'info')}>
              CARE<span className="text-vibe-primary">Connect</span>
            </Navbar.Brand>
          </OverlayTrigger>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link active={view === 'interaccion'} onClick={() => setView('interaccion')}>Registrar Interacción</Nav.Link>
              <Nav.Link active={view === 'clientes'} onClick={() => setView('clientes')}>Clientes</Nav.Link>
              <Nav.Link active={view === 'metricas'} onClick={() => setView('metricas')}>Métricas</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        <Container fluid className="px-md-4 py-4">
          {renderView()}
        </Container>
      </main>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide bg={toast.variant}>
          <Toast.Header>
            <strong className="me-auto">Notificación</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
      </div>
  )
}

export default App

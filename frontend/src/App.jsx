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
  const [view, setView] = useState('clientes')
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
              <InteractionList refreshFlag={refreshFlag} showToast={showToast} />
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
    <div className="min-vh-100 w-100" style={{ backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}>
      <Navbar variant="dark" expand="lg" className="mb-4 navbar shadow-sm">
        <Container fluid className="px-md-4">
          <OverlayTrigger placement="bottom" overlay={renderTooltip}>
            <Navbar.Brand
              href="#"
              className="fw-bold fs-3 navbar-brand"
              onClick={() => showToast('¡Has encontrado el Vibe! Sigue codificando con energía.', 'info')}
            >
              CARE<span className="text-accent">Connect</span>
            </Navbar.Brand>
          </OverlayTrigger>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto gap-2">
              <Nav.Link
                className="nav-link"
                active={view === 'interaccion'}
                onClick={() => setView('interaccion')}
              >Registrar Interacción</Nav.Link>
              <Nav.Link
                className="nav-link"
                active={view === 'clientes'}
                onClick={() => setView('clientes')}
              >Clientes</Nav.Link>
              <Nav.Link
                className="nav-link"
                active={view === 'metricas'}
                onClick={() => setView('metricas')}
              >Métricas</Nav.Link>
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
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
          className="shadow"
          style={{ minWidth: 320 }}
        >
          <Toast.Header className="bg-surface border-main">
            <strong className="me-auto">Notificación</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default App

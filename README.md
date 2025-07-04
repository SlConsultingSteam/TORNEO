# CAREConnect - Vibe Coding Edition 🚀

## 📋 Descripción del Proyecto

**CAREConnect** es una aplicación web moderna y vibrante para la gestión de relaciones con clientes (CRM), desarrollada con un enfoque creativo de "vibe coding" que combina elegancia visual con funcionalidad robusta.

### 🎯 Propósito
Esta aplicación permite a las empresas gestionar eficientemente sus interacciones con clientes, realizar seguimiento de conversaciones, analizar métricas clave y optimizar el customer journey a través de una interfaz intuitiva y visualmente atractiva.

### ✨ Características Principales

#### 🎨 **Diseño "Vibe Coding"**
- **Paleta de colores vibrante**: Deep Nebula, Cybernetic Teal, Electric Magenta, Solar Flare Orange
- **Animaciones sutiles**: Transiciones fluidas y efectos hover elegantes
- **Responsive design**: Optimizado para todos los dispositivos
- **Tema oscuro moderno**: Interfaz cómoda para largas sesiones de trabajo

#### 🔧 **Funcionalidades Core**
- **Gestión de Interacciones**: Registro y seguimiento de conversaciones con clientes
- **Gestión de Clientes**: Base de datos completa con estados y tipos
- **Dashboard de Métricas**: Análisis visual de KPIs importantes
- **Customer Journey**: Vista detallada del historial de cada cliente
- **Sistema de Notificaciones**: Toasts elegantes para feedback del usuario

#### 🎯 **Métricas Clave**
- Total de conversaciones
- Duración promedio de relaciones
- Oportunidades de recompra
- Distribución por tipo de cliente (Ordinario/Premium)
- Distribución por estado (Activo/Dormido)

## 🚀 Instalación y Ejecución

### 📋 Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Git** (para clonar el repositorio)

### 🔧 Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd TORNEO
```

#### 2. Configurar el Backend
```bash
cd backend
npm install
npm start
```
El servidor backend se ejecutará en `http://localhost:3000`

#### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
npm run dev
```
La aplicación frontend estará disponible en `http://localhost:5173`

#### 4. Verificar la Instalación
- Abre tu navegador y navega a `http://localhost:5173`
- Deberías ver la interfaz principal de CAREConnect
- Verifica que el backend esté respondiendo correctamente

### 🛠️ Scripts Disponibles

#### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
```

#### Backend
```bash
npm start            # Iniciar servidor
npm run dev          # Modo desarrollo con nodemon
```

## 🎨 Enfoque Creativo: "Vibe Coding"

### 🎭 Filosofía de Diseño
El enfoque "vibe coding" se centra en crear experiencias digitales que no solo sean funcionales, sino que también inspiren y motiven a los usuarios. Nuestra filosofía se basa en:

- **Energía Visual**: Colores vibrantes que inspiran creatividad y productividad
- **Elegancia Funcional**: Belleza que no compromete la usabilidad
- **Experiencia Fluida**: Transiciones suaves y feedback inmediato
- **Modernidad**: Técnicas y patrones de diseño actuales

### 🎨 Paleta de Colores "Vibe Coding"

#### Variables CSS Principales
```css
--color-deep-nebula: #1A1A2E      /* Fondo principal */
--color-starry-void: #21213D      /* Fondo secundario */
--color-cosmic-dust: #E0E0E0      /* Texto principal */
--color-cybernetic-teal: #00FFFF  /* Acento principal */
--color-electric-magenta: #FF00FF /* Acento secundario */
--color-solar-flare-orange: #FFA500 /* Advertencias */
--color-nebula-border: #404060    /* Bordes */
```

### 🎯 Principios de UX/UI
- **Intuitividad**: Interfaz clara para usuarios no técnicos
- **Eficiencia**: Flujos de trabajo optimizados
- **Feedback**: Confirmaciones visuales en cada acción
- **Consistencia**: Patrones de diseño uniformes
- **Accesibilidad**: Contraste alto y navegación por teclado

### 🎮 Elementos Creativos
- **Animaciones sutiles**: Fade In Up, hover effects, loading states
- **Easter Eggs**: Interacciones ocultas que sorprenden al usuario
- **Toast Notifications**: Mensajes de confirmación elegantes
- **Responsive Design**: Adaptación inteligente a todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal para la interfaz de usuario
- **Vite**: Build tool moderno y servidor de desarrollo rápido
- **React Bootstrap**: Componentes UI responsivos y accesibles
- **Bootstrap Icons**: Iconografía moderna y consistente
- **CSS Variables**: Sistema de diseño modular y mantenible

### Backend
- **Node.js**: Runtime de JavaScript para el servidor
- **Express**: Framework web minimalista y flexible
- **JSON**: Persistencia de datos local simple y eficiente

## 📊 Estructura del Proyecto

```
TORNEO/
├── backend/
│   ├── data.json           # Base de datos local
│   ├── package.json        # Dependencias del backend
│   └── server.js           # Servidor Express
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InteractionForm.jsx      # Formulario de interacciones
│   │   │   ├── InteractionList.jsx      # Lista de interacciones
│   │   │   ├── ClientManagement.jsx     # Gestión de clientes
│   │   │   └── MetricsDashboard.jsx     # Dashboard de métricas
│   │   ├── App.jsx                      # Componente principal
│   │   ├── App.css                      # Estilos específicos
│   │   └── index.css                    # Variables y estilos globales
│   ├── public/                          # Assets estáticos
│   └── package.json                     # Dependencias del frontend
└── README.md                            # Documentación principal
```

## 📱 Responsividad y Compatibilidad

La aplicación está optimizada para:
- **Desktop** (1200px+): Layout completo con sidebar y métricas detalladas
- **Tablet** (768px - 1199px): Reorganización inteligente de columnas
- **Mobile** (< 768px): Navegación optimizada y formularios adaptados

## 🚀 Próximas Mejoras

- [ ] **Gráficos interactivos**: Visualizaciones de datos avanzadas con Chart.js
- [ ] **Filtros avanzados**: Búsqueda y filtrado sofisticado
- [ ] **Exportación de datos**: Reportes en PDF/Excel
- [ ] **Notificaciones push**: Alertas en tiempo real
- [ ] **Temas personalizables**: Múltiples paletas de colores
- [ ] **Autenticación**: Sistema de login y roles de usuario
- [ ] **Base de datos**: Migración a MongoDB o PostgreSQL

## 🤝 Contribución

Este proyecto fue desarrollado para el **Torneo de Vibe Coding** con un enfoque en:
- **Creatividad técnica**: Soluciones innovadoras y código limpio
- **Calidad de código**: Estándares profesionales y buenas prácticas
- **Experiencia de usuario**: Interfaz intuitiva, atractiva y accesible
- **Rendimiento**: Aplicación rápida, eficiente y escalable

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Revisa la documentación en este README
- Verifica que todos los prerrequisitos estén instalados
- Asegúrate de que tanto el backend como el frontend estén ejecutándose

---

**¡Disfruta codificando con buena vibra! 🎉**

*Desarrollado con ❤️ por Cursor para el Torneo de Vibe Coding*

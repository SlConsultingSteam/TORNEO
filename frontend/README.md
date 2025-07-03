# CAREConnect - Vibe Coding Edition 🚀

Una aplicación web moderna y vibrante para la gestión de relaciones con clientes, desarrollada con **React**, **Bootstrap 5** y una paleta de colores "vibe coding" que combina elegancia y energía.

## ✨ Características

### 🎨 **Diseño "Vibe Coding"**
- **Paleta de colores vibrante**: Deep Nebula, Cybernetic Teal, Electric Magenta, Solar Flare Orange
- **Animaciones sutiles**: Transiciones fluidas y efectos hover elegantes
- **Responsive design**: Optimizado para todos los dispositivos
- **Tema oscuro moderno**: Interfaz cómoda para largas sesiones de trabajo

### 🔧 **Funcionalidades Principales**
- **Gestión de Interacciones**: Registro y seguimiento de conversaciones con clientes
- **Gestión de Clientes**: Base de datos completa con estados y tipos
- **Dashboard de Métricas**: Análisis visual de KPIs importantes
- **Customer Journey**: Vista detallada del historial de cada cliente
- **Sistema de Notificaciones**: Toasts elegantes para feedback del usuario

### 🎯 **Métricas Clave**
- Total de conversaciones
- Duración promedio de relaciones
- Oportunidades de recompra
- Distribución por tipo de cliente (Ordinario/Premium)
- Distribución por estado (Activo/Dormido)

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd TORNEO/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### 🖥️ Backend (Requerido)
Asegúrate de que el backend esté ejecutándose en `http://localhost:3000`:

```bash
cd ../backend
npm install
npm start
```

## 🎨 Paleta de Colores "Vibe Coding"

### Variables CSS Principales
```css
--color-deep-nebula: #1A1A2E      /* Fondo principal */
--color-starry-void: #21213D      /* Fondo secundario */
--color-cosmic-dust: #E0E0E0      /* Texto principal */
--color-cybernetic-teal: #00FFFF  /* Acento principal */
--color-electric-magenta: #FF00FF /* Acento secundario */
--color-solar-flare-orange: #FFA500 /* Advertencias */
--color-nebula-border: #404060    /* Bordes */
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **Vite**: Build tool y servidor de desarrollo
- **React Bootstrap**: Componentes UI responsivos
- **Bootstrap Icons**: Iconografía moderna
- **CSS Variables**: Sistema de diseño modular

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **JSON**: Persistencia de datos local

## 📱 Responsividad

La aplicación está optimizada para:
- **Desktop**: Layout completo con sidebar y métricas detalladas
- **Tablet**: Reorganización inteligente de columnas
- **Mobile**: Navegación optimizada y formularios adaptados

## 🎯 Características de UX/UI

### Animaciones y Transiciones
- **Fade In Up**: Entrada suave de elementos
- **Hover Effects**: Feedback visual en interacciones
- **Loading States**: Indicadores de carga elegantes
- **Toast Notifications**: Mensajes de confirmación

### Accesibilidad
- **Contraste alto**: Texto legible en todos los fondos
- **Navegación por teclado**: Soporte completo
- **Screen readers**: Compatible con lectores de pantalla
- **Focus indicators**: Estados de foco claros

## 🎮 Easter Eggs

- **Clic en el título**: Descubre el mensaje "¡Has encontrado el Vibe!"
- **Tooltips**: Información adicional en elementos clave
- **Animaciones**: Efectos visuales sutiles en interacciones

## 📊 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── InteractionForm.jsx      # Formulario de interacciones
│   │   ├── InteractionList.jsx      # Lista de interacciones
│   │   ├── ClientManagement.jsx     # Gestión de clientes
│   │   └── MetricsDashboard.jsx     # Dashboard de métricas
│   ├── App.jsx                      # Componente principal
│   ├── App.css                      # Estilos específicos
│   └── index.css                    # Variables y estilos globales
├── public/                          # Assets estáticos
└── package.json                     # Dependencias y scripts
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
```

## 🎨 Enfoque Creativo: "Vibe Coding"

### Filosofía de Diseño
- **Energía Visual**: Colores vibrantes que inspiran creatividad
- **Elegancia Funcional**: Belleza que no compromete la usabilidad
- **Experiencia Fluida**: Transiciones suaves y feedback inmediato
- **Modernidad**: Técnicas y patrones de diseño actuales

### Principios de UX
- **Intuitividad**: Interfaz clara para usuarios no técnicos
- **Eficiencia**: Flujos de trabajo optimizados
- **Feedback**: Confirmaciones visuales en cada acción
- **Consistencia**: Patrones de diseño uniformes

## 🚀 Próximas Mejoras

- [ ] **Gráficos interactivos**: Visualizaciones de datos avanzadas
- [ ] **Filtros avanzados**: Búsqueda y filtrado sofisticado
- [ ] **Exportación de datos**: Reportes en PDF/Excel
- [ ] **Notificaciones push**: Alertas en tiempo real
- [ ] **Temas personalizables**: Múltiples paletas de colores

## 🤝 Contribución

Este proyecto fue desarrollado para el **Torneo de Vibe Coding** con un enfoque en:
- **Creatividad técnica**: Soluciones innovadoras
- **Calidad de código**: Estándares profesionales
- **Experiencia de usuario**: Interfaz intuitiva y atractiva
- **Rendimiento**: Aplicación rápida y eficiente

---

**¡Disfruta codificando con buena vibra! 🎉**

// Archivo inicial del servidor Express 

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = { clients: [], interactions: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    if (!fileContent.trim()) {
      return { clients: [], interactions: [] };
    }

    const data = JSON.parse(fileContent);

    // Garantizar que las propiedades existan como arrays
    return {
      clients: data.clients || [],
      interactions: data.interactions || [],
    };
  } catch (err) {
    console.error("Error crítico leyendo o parseando data.json. Se devolverá una estructura segura:", err);
    return { clients: [], interactions: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error escribiendo en data.json:", err);
  }
}

// Middleware de validación para clientes
const validateClient = (req, res, next) => {
  const { name, status, type } = req.body;
  if (!name || !status || !type) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: nombre, estado y tipo.' });
  }
  next();
};

// Middleware de validación para interacciones
const validateInteraction = (req, res, next) => {
  const { clientId, type, date } = req.body;
  if (!clientId || !type || !date) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: clientId, tipo y fecha.' });
  }
  next();
};

// GET /api/clients
app.get('/api/clients', (req, res) => {
  try {
    const data = readData();
    res.json(data.clients || []);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al obtener los clientes.' });
  }
});

// POST /api/clients
app.post('/api/clients', validateClient, (req, res) => {
  try {
    const { name, status, type } = req.body;
    const data = readData();
    const newClient = {
      id: Date.now(),
      name,
      status,
      type
    };
    data.clients.push(newClient);
    writeData(data);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al crear el cliente.' });
  }
});

// GET /api/interactions
app.get('/api/interactions', (req, res) => {
  try {
    const data = readData();
    res.json(data.interactions || []);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al obtener las interacciones.' });
  }
});

// POST /api/interactions
app.post('/api/interactions', validateInteraction, (req, res) => {
  try {
    const { clientId, type, date, notes, repurchasePotential } = req.body;
    const data = readData();
    const newInteraction = {
      id: Date.now(),
      clientId,
      type,
      date,
      notes: notes || '',
      repurchasePotential: repurchasePotential || false
    };
    data.interactions.push(newInteraction);
    writeData(data);
    res.status(201).json(newInteraction);
  } catch (error) {
    console.error('*** ERROR DETALLADO AL CREAR INTERACCIÓN:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la interacción.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 
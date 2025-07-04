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
    console.log('=== ESCRIBIENDO EN DATA.JSON ===');
    console.log('Datos a escribir:', data);
    const jsonString = JSON.stringify(data, null, 2);
    console.log('JSON generado:', jsonString);
    fs.writeFileSync(DATA_FILE, jsonString);
    console.log('Archivo data.json actualizado exitosamente');
    console.log('=== FIN DE ESCRITURA ===');
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
    console.log('=== CREANDO NUEVO CLIENTE ===');
    console.log('Datos recibidos:', req.body);
    
    const { name, status, type, product, brand } = req.body;
    console.log('Datos extraídos:', { name, status, type, product, brand });
    
    const data = readData();
    console.log('Datos actuales leídos:', data);
    
    const newClient = {
      id: Date.now(),
      name,
      status,
      type,
      product: product || '',
      brand: brand || ''
    };
    console.log('Nuevo cliente a crear:', newClient);
    
    data.clients.push(newClient);
    console.log('Array de clientes después de agregar:', data.clients);
    
    console.log('Guardando datos...');
    writeData(data);
    console.log('Datos guardados exitosamente');
    
    console.log('=== CLIENTE CREADO ===');
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el cliente.' });
  }
});

// PUT /api/clients/:id
app.put('/api/clients/:id', validateClient, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, status, type, product, brand } = req.body;
    const data = readData();
    const index = data.clients.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }
    data.clients[index] = {
      ...data.clients[index],
      name,
      status,
      type,
      product: product || '',
      brand: brand || ''
    };
    writeData(data);
    res.json(data.clients[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al editar el cliente.' });
  }
});

// DELETE /api/clients/:id
app.delete('/api/clients/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = readData();
    const index = data.clients.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }
    data.clients.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al eliminar el cliente.' });
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

// DELETE /api/interactions/:id
app.delete('/api/interactions/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = readData();
    const index = data.interactions.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Interacción no encontrada.' });
    }
    data.interactions.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al eliminar la interacción.' });
  }
});

// PUT /api/interactions/:id
app.put('/api/interactions/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { clientId, type, date, notes, repurchasePotential } = req.body;
    const data = readData();
    const index = data.interactions.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Interacción no encontrada.' });
    }
    // Validación básica
    if (!clientId || !type || !date) {
      return res.status(400).json({ error: 'Todos los campos son requeridos: clientId, tipo y fecha.' });
    }
    data.interactions[index] = {
      ...data.interactions[index],
      clientId,
      type,
      date,
      notes: notes || '',
      repurchasePotential: repurchasePotential || false
    };
    writeData(data);
    res.json(data.interactions[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al editar la interacción.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 
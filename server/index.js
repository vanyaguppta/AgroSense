const path = require('path');
const express = require('express');
const store = require('./store');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'change-me';
const FIELDS = ['moisture', 'temperature', 'ph', 'ec', 'nitrogen', 'phosphorus', 'potassium'];

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const clients = new Set();

// Sensors post here
app.post('/api/readings', (req, res) => {
  if (req.get('x-api-key') !== API_KEY) return res.status(401).json({ error: 'Invalid API key' });
  const { device_id } = req.body || {};
  if (!device_id || typeof device_id !== 'string') {
    return res.status(400).json({ error: 'device_id is required' });
  }
  const reading = { device_id, timestamp: new Date().toISOString() };
  for (const f of FIELDS) {
    if (req.body[f] === undefined) continue;
    const v = Number(req.body[f]);
    if (!Number.isFinite(v)) return res.status(400).json({ error: `${f} must be a number` });
    reading[f] = v;
  }
  store.add(reading);
  for (const c of clients) c.write(`data: ${JSON.stringify(reading)}\n\n`);
  res.status(201).json(reading);
});

app.get('/api/devices', (_req, res) => res.json(store.devices()));

app.get('/api/readings', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 1000);
  res.json(store.list({ device: req.query.device, limit }));
});

app.get('/api/readings/latest', (req, res) => {
  const r = store.latest(req.query.device);
  if (!r) return res.status(404).json({ error: 'No readings yet' });
  res.json(r);
});

// Live updates (Server-Sent Events)
app.get('/api/stream', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  res.write(': connected\n\n');
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.listen(PORT, () => console.log(`Soil monitor running at http://localhost:${PORT}`));

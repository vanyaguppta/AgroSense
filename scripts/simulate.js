// Sends fake readings so you can test the dashboard without hardware.
// Usage: node scripts/simulate.js [intervalSeconds]
const URL = process.env.URL || 'http://localhost:3000/api/readings';
const KEY = process.env.API_KEY || 'change-me';
const every = (Number(process.argv[2]) || 3) * 1000;
const devices = ['field-A', 'field-B'];
const state = Object.fromEntries(devices.map(d => [d, 45 + Math.random() * 20]));
const rnd = (a, b) => a + Math.random() * (b - a);

async function tick() {
  for (const d of devices) {
    state[d] = Math.max(8, Math.min(90, state[d] + rnd(-3, 2)));
    const body = {
      device_id: d,
      moisture: +state[d].toFixed(1),
      temperature: +rnd(24, 33).toFixed(1),
      ph: +rnd(6.2, 7.2).toFixed(2),
      ec: +rnd(0.6, 1.6).toFixed(2),
      nitrogen: Math.round(rnd(30, 80)),
      phosphorus: Math.round(rnd(15, 45)),
      potassium: Math.round(rnd(60, 140))
    };
    try {
      const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': KEY }, body: JSON.stringify(body) });
      console.log(d, r.status, body.moisture + '%');
    } catch (e) { console.error('Server not reachable:', e.message); }
  }
}
tick();
setInterval(tick, every);

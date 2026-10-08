const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DIR, 'readings.json');
const MAX = 5000;

let readings = [];
try {
  readings = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch (_) { /* first run */ }

let timer = null;
function save() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFile(FILE, JSON.stringify(readings), () => {});
  }, 500);
}

module.exports = {
  add(r) {
    readings.push(r);
    if (readings.length > MAX) readings.splice(0, readings.length - MAX);
    save();
    return r;
  },
  list({ device, limit = 100 } = {}) {
    const rows = device ? readings.filter(r => r.device_id === device) : readings;
    return rows.slice(-limit);
  },
  latest(device) {
    for (let i = readings.length - 1; i >= 0; i--) {
      if (!device || readings[i].device_id === device) return readings[i];
    }
    return null;
  },
  devices() {
    const seen = new Map();
    for (const r of readings) seen.set(r.device_id, r.timestamp);
    return [...seen].map(([id, last_seen]) => ({ id, last_seen }));
  }
};

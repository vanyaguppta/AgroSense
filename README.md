# Soil Monitor

Dashboard + API for IoT soil sensor readings (moisture, temperature, pH, EC, N-P-K).

```
Sensor (ESP32) --HTTP POST--> Express API --stores--> data/readings.json
                                   |
                                   +--SSE live stream--> Browser dashboard
```

## Run it
Requires Node.js 18+.

```bash
npm install
API_KEY=my-secret npm start        # http://localhost:3000
```
No hardware yet? In a second terminal: `API_KEY=my-secret npm run simulate`

## Connect your sensor
Send a POST to `/api/readings` with header `x-api-key` and JSON (only `device_id` is required):

```json
{ "device_id": "field-A", "moisture": 42.5, "temperature": 28.1, "ph": 6.8, "ec": 1.1,
  "nitrogen": 55, "phosphorus": 30, "potassium": 90 }
```
A ready ESP32 sketch is in `firmware/esp32_soil_sensor/`. Calibrate `AIR_VALUE` and `WATER_VALUE`,
set your Wi-Fi, server IP and API key.

## API
| Method | Path | Purpose |
|---|---|---|
| POST | /api/readings | Sensor submits a reading (needs API key) |
| GET | /api/readings?device=ID&limit=100 | History |
| GET | /api/readings/latest?device=ID | Newest reading |
| GET | /api/devices | Known sensors |
| GET | /api/stream | Live updates (SSE) |

## Notes
- Dry/wet thresholds are in `public/app.js` (`LOW`, `HIGH`). Tune them per crop.
- Storage is a JSON file (last 5000 readings). For production, swap `server/store.js` for a database.
- Change the default API key before deploying, and use HTTPS.

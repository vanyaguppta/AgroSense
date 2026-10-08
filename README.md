<img width="1672" height="941" alt="Agrosense" src="https://github.com/user-attachments/assets/a0612394-dd43-48b1-be60-666f9d54b62b" />


# 🌱 Soil Monitor

An IoT-based soil monitoring system that collects and displays real-time agricultural sensor data through a web dashboard.

The system is designed to monitor important soil and environmental parameters such as **soil moisture, temperature, pH, electrical conductivity (EC), and N-P-K nutrients** and present the readings through a live dashboard.

---

## 🚀 Features

- 🌱 Real-time soil moisture monitoring
- 🌡️ Temperature monitoring
- 🧪 Soil pH monitoring
- ⚡ Electrical Conductivity (EC) monitoring
- 🧬 Nitrogen (N), Phosphorus (P), and Potassium (K) monitoring
- 📊 Live dashboard visualization
- 📡 HTTP-based IoT communication
- 🔄 Server-Sent Events (SSE) for live updates
- 💾 JSON-based local data storage
- 🧪 Built-in sensor simulation mode
- 🔐 API-key authentication

---

## 🏗️ System Architecture

```text
┌─────────────────────────┐
│     IoT Soil Sensor     │
│        ESP-12E          │
│       (ESP8266)         │
└────────────┬────────────┘
             │
             │ HTTP POST
             ▼
┌─────────────────────────┐
│       Express API       │
│      /api/readings      │
└────────────┬────────────┘
             │
             │ Stores Data
             ▼
┌─────────────────────────┐
│     readings.json       │
│    Local Data Storage   │
└────────────┬────────────┘
             │
             │ SSE Live Stream
             ▼
┌─────────────────────────┐
│     Web Dashboard       │
│   Real-Time Readings    │
└─────────────────────────┘
````

---

## 🛠️ Technology Stack

### Hardware

* ESP-12E (ESP8266)
* Soil Moisture Sensor v2.0
* DHT11 Temperature & Humidity Sensor
* Additional sensors can be integrated for:

  * Soil pH
  * Electrical Conductivity (EC)
  * Nitrogen (N)
  * Phosphorus (P)
  * Potassium (K)

### Software

* Node.js
* Express.js
* JavaScript
* HTML
* CSS
* Server-Sent Events (SSE)
* JSON

---

## 📋 Requirements

Before running the project, make sure you have:

* [Node.js](https://nodejs.org/) **18 or higher**
* npm
* ESP-12E / ESP8266 *(required for hardware integration)*

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Navigate into the project:

```bash
cd soil-monitor
```

Install the required dependencies:

```bash
npm install
```

---

## ▶️ Running the Dashboard

### Windows PowerShell

Set the API key:

```powershell
$env:API_KEY="my-secret"
```

Start the server:

```powershell
npm start
```

The dashboard will be available at:

```text
http://localhost:3000
```

---

## 🧪 Running Without Hardware

A simulator is included to test the dashboard without connecting the ESP-12E.

Open a **second PowerShell terminal**:

```powershell
cd C:\Users\Asus\Downloads\soil-monitor
$env:API_KEY="my-secret"
npm run simulate
```

The simulator generates sample sensor readings such as:

```text
field-A 200 26.8%
field-B 200 10.5%
```

These readings are sent to the Express API and displayed on the dashboard.

---

## 🔌 Connecting the ESP-12E

The ESP-12E sends sensor readings to:

```text
POST /api/readings
```

The request must contain the API key in the `x-api-key` header.

### Example Request

```json
{
  "device_id": "field-A",
  "moisture": 42.5,
  "temperature": 28.1,
  "ph": 6.8,
  "ec": 1.1,
  "nitrogen": 55,
  "phosphorus": 30,
  "potassium": 90
}
```

Only `device_id` is required by the API.

---

## 🌱 Soil Moisture Calibration

The **Soil Moisture Sensor v2.0** provides an analog raw value.

The ESP-12E reads this value through its analog input and converts it into a moisture percentage using calibration values.

```text
Dry Soil  → Lower Moisture %
Wet Soil  → Higher Moisture %
```

The actual calibration values depend on the individual sensor and soil conditions.

The firmware can use calibration values such as:

```cpp
AIR_VALUE
WATER_VALUE
```

These values should be adjusted using actual readings from the sensor.

### Example

```text
Raw Value → Moisture %

900 → 0%
750 → 25%
600 → 50%
450 → 75%
300 → 100%
```

> These values are only examples. Actual values must be obtained by calibrating the sensor.

---

## 🌡️ Temperature and Humidity

The project can use a **DHT11 sensor** to measure:

* Temperature (°C)
* Air Humidity (%)

Example:

```text
Temperature: 32.2 °C
Air Humidity: 48.0 %
```

---

## 📡 API Endpoints

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| `POST` | `/api/readings`        | Submit a sensor reading        |
| `GET`  | `/api/readings`        | Retrieve reading history       |
| `GET`  | `/api/readings/latest` | Get the latest reading         |
| `GET`  | `/api/devices`         | Get registered devices         |
| `GET`  | `/api/stream`          | Receive live updates using SSE |

### Reading History

```text
GET /api/readings?device=field-A&limit=100
```

### Latest Reading

```text
GET /api/readings/latest?device=field-A
```

---

## 📊 Dashboard

The web dashboard provides:

* Current soil moisture
* Temperature
* pH
* EC
* N-P-K values
* Recent trends
* Latest sensor readings
* Live sensor status

New readings are delivered to the dashboard using **Server-Sent Events (SSE)**.

---

## 📁 Project Structure

```text
soil-monitor/
│
├── data/
│   └── readings.json
│
├── firmware/
│   └── esp32_soil_sensor/
│       └── esp32_soil_sensor.ino
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── scripts/
│   └── simulate.js
│
├── server/
│   └── store.js
│
├── package.json
└── README.md
```

> If you rename the firmware folder from `esp32_soil_sensor` to `esp8266_soil_sensor`, update the structure above accordingly.

---

## 🔐 API Security

The API uses an API key to authenticate sensor requests.

The key is sent using:

```text
x-api-key: my-secret
```

For deployment:

* Change the default API key
* Store the key securely in environment variables
* Do not commit API keys to GitHub
* Use HTTPS for production deployments

---

## 💾 Data Storage

Sensor readings are currently stored locally in:

```text
data/readings.json
```

The system stores up to **5000 readings**.

For production use, the storage system can be replaced with a database such as:

* MongoDB
* PostgreSQL
* MySQL
* Firebase

---

## 🔮 Future Improvements

* 📱 Mobile application
* ☁️ Cloud database integration
* 📈 Advanced data visualization
* 🚨 Automatic irrigation alerts
* 🤖 AI-based crop recommendations
* 🌦️ Weather API integration
* 👨‍🌾 Farmer-friendly notifications
* 🔋 Battery monitoring
* 📍 Multi-field monitoring

---

## 🎯 Project Objective

The objective of Soil Monitor is to provide an affordable IoT-based solution for monitoring soil and environmental conditions and presenting the collected data in an easy-to-understand dashboard.

The system can help farmers make better decisions regarding **irrigation, soil conditions, and crop management** using real-time sensor data.

---

## 👨‍💻 Project

**Soil Monitor — IoT-Based Smart Agriculture System**

Developed as an educational prototype for real-time soil and environmental monitoring using **ESP-12E (ESP8266)** and web-based IoT technologies.

---

## 📄 License

This project is developed for educational and prototype purposes.

````


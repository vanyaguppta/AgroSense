
/* =========================================================
   SOIL MONITOR - REAL TIME DASHBOARD
   ========================================================= */

const deviceSelect = document.getElementById("device");
const statusEl = document.getElementById("status");

let moistureChart;
let temperatureChart;

const MAX_POINTS = 30;


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

  const now = new Date();

  document.getElementById("currentTime").textContent =
    now.toLocaleTimeString();

}

setInterval(updateClock, 1000);
updateClock();


/* =========================================================
   STATUS
   ========================================================= */

function setOnline() {

  statusEl.className = "status on";

  statusEl.innerHTML = `
    <span class="status-dot"></span>
    Live
  `;

}

function setOffline() {

  statusEl.className = "status off";

  statusEl.innerHTML = `
    <span class="status-dot"></span>
    Offline
  `;

}


/* =========================================================
   CHART SETUP
   ========================================================= */

function createCharts() {

  const ctx = document
    .getElementById("chart")
    .getContext("2d");

  const tempCtx = document
    .getElementById("temperatureChart")
    .getContext("2d");


  moistureChart = new Chart(ctx, {

    type: "line",

    data: {
      labels: [],
      datasets: [{
        label: "Moisture %",
        data: [],

        borderColor: "#20a464",

        backgroundColor: "rgba(32,164,100,0.12)",

        fill: true,

        tension: 0.4,

        pointRadius: 3,

        pointHoverRadius: 6
      }]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      animation: {
        duration: 500
      },

      scales: {

        y: {
          min: 0,
          max: 100,

          grid: {
            color: "#edf2ef"
          }
        },

        x: {
          grid: {
            display: false
          }
        }

      },

      plugins: {
        legend: {
          display: false
        }
      }
    }

  });


  temperatureChart = new Chart(tempCtx, {

    type: "line",

    data: {

      labels: [],

      datasets: [{
        label: "Temperature °C",

        data: [],

        borderColor: "#f59e0b",

        backgroundColor: "rgba(245,158,11,0.10)",

        fill: true,

        tension: 0.4,

        pointRadius: 3
      }]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      scales: {

        y: {
          grid: {
            color: "#edf2ef"
          }
        },

        x: {
          grid: {
            display: false
          }
        }

      },

      plugins: {
        legend: {
          display: false
        }
      }
    }

  });

}


/* =========================================================
   UPDATE CHARTS
   ========================================================= */

function updateCharts(data) {

  const time = new Date(data.timestamp || Date.now())
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });


  moistureChart.data.labels.push(time);

  moistureChart.data.datasets[0].data.push(
    Number(data.moisture)
  );


  temperatureChart.data.labels.push(time);

  temperatureChart.data.datasets[0].data.push(
    Number(data.temperature)
  );


  if (moistureChart.data.labels.length > MAX_POINTS) {

    moistureChart.data.labels.shift();
    moistureChart.data.datasets[0].data.shift();

    temperatureChart.data.labels.shift();
    temperatureChart.data.datasets[0].data.shift();

  }


  moistureChart.update();
  temperatureChart.update();

}


/* =========================================================
   MOISTURE GAUGE
   ========================================================= */

function updateGauge(moisture) {

  moisture = Math.max(
    0,
    Math.min(100, Number(moisture))
  );


  document.getElementById("moistureVal")
    .textContent = Math.round(moisture);


  document.getElementById("moistureMetric")
    .textContent = Math.round(moisture);


  document.getElementById("moistureProgress")
    .style.width = moisture + "%";


  /*
     Conic gradient creates a circular gauge.
  */

  document.getElementById("fill").style.background =
    `conic-gradient(
      #38bdf8 0deg,
      #22c55e ${moisture * 3.6}deg,
      #edf3ef ${moisture * 3.6}deg
    )`;


  document.getElementById("healthMoistureBar")
    .style.width = moisture + "%";

}


/* =========================================================
   ADVICE
   ========================================================= */

function updateAdvice(moisture) {

  const title = document.getElementById("adviceTitle");

  const text = document.getElementById("adviceText");

  const alert = document.getElementById("alertBanner");

  const alertTitle = document.getElementById("alertTitle");

  const alertText = document.getElementById("alertText");


  moisture = Number(moisture);


  if (moisture < 25) {

    title.textContent = "Irrigation Recommended";

    text.textContent =
      "The soil is very dry. Consider watering the crop soon.";

    alert.classList.remove("hidden");

    alertTitle.textContent =
      "Low Soil Moisture";

    alertText.textContent =
      "Your soil moisture is below the recommended range.";

  }

  else if (moisture < 40) {

    title.textContent = "Soil is Getting Dry";

    text.textContent =
      "Monitor the field and prepare for irrigation.";

    alert.classList.remove("hidden");

    alertTitle.textContent =
      "Moisture Warning";

    alertText.textContent =
      "Soil moisture is approaching the lower limit.";

  }

  else if (moisture <= 75) {

    title.textContent = "Excellent Soil Moisture";

    text.textContent =
      "Moisture level is suitable for healthy plant growth.";

    alert.classList.add("hidden");

  }

  else {

    title.textContent = "High Moisture";

    text.textContent =
      "Soil is quite wet. Avoid unnecessary irrigation.";

    alert.classList.remove("hidden");

    alertTitle.textContent =
      "High Soil Moisture";

    alertText.textContent =
      "Excess water may affect root health.";

  }

}


/* =========================================================
   TEMPERATURE
   ========================================================= */

function updateTemperature(value) {

  value = Number(value);

  document.getElementById("temperatureMetric")
    .textContent = value.toFixed(1);

  document.getElementById("healthTemperature")
    .textContent = value.toFixed(1) + " °C";


  /*
     Example scale:
     0°C = 0%
     40°C = 100%
  */

  const percentage =
    Math.max(0, Math.min(100, (value / 40) * 100));

  document.getElementById("healthTemperatureBar")
    .style.width = percentage + "%";


  const status =
    document.getElementById("temperatureStatus");


  if (value >= 35) {

    status.textContent = "High";

    status.style.background = "#fee2e2";
    status.style.color = "#b91c1c";

  }

  else if (value < 10) {

    status.textContent = "Low";

    status.style.background = "#e0f2fe";
    status.style.color = "#0369a1";

  }

  else {

    status.textContent = "Normal";

  }

}


/* =========================================================
   PH
   ========================================================= */

function updatePH(value) {

  value = Number(value);

  document.getElementById("phMetric")
    .textContent = value.toFixed(1);

  document.getElementById("healthPh")
    .textContent = value.toFixed(1);


  /*
     pH ideal range approximately 6 - 7.5
  */

  const percentage =
    Math.max(
      0,
      Math.min(
        100,
        ((value - 4) / 5) * 100
      )
    );


  document.getElementById("healthPhBar")
    .style.width = percentage + "%";


  const status =
    document.getElementById("phStatus");


  if (value >= 6 && value <= 7.5) {

    status.textContent = "Healthy";

  }

  else {

    status.textContent = "Check";

    status.style.background = "#fff1d5";
    status.style.color = "#9a6200";

  }

}


/* =========================================================
   EC
   ========================================================= */

function updateEC(value) {

  value = Number(value);

  document.getElementById("ecMetric")
    .textContent = value.toFixed(2);

  document.getElementById("healthEc")
    .textContent = value.toFixed(2);


  const percentage =
    Math.min(100, (value / 3) * 100);


  document.getElementById("healthEcBar")
    .style.width = percentage + "%";

}


/* =========================================================
   NPK
   ========================================================= */

function updateNPK(data) {

  document.getElementById("nitrogen")
    .textContent = data.nitrogen ?? "--";

  document.getElementById("phosphorus")
    .textContent = data.phosphorus ?? "--";

  document.getElementById("potassium")
    .textContent = data.potassium ?? "--";


  const n = Number(data.nitrogen || 0);
  const p = Number(data.phosphorus || 0);
  const k = Number(data.potassium || 0);


  if (n > 40 && p > 20 && k > 40) {

    document.getElementById("fertilityTitle")
      .textContent = "Good Soil Fertility";

    document.getElementById("fertilityText")
      .textContent =
      "NPK levels indicate good nutrient availability.";

  }

  else {

    document.getElementById("fertilityTitle")
      .textContent = "Nutrient Monitoring";

    document.getElementById("fertilityText")
      .textContent =
      "Review NPK values before applying fertilizer.";

  }

}


/* =========================================================
   UPDATE COMPLETE DASHBOARD
   ========================================================= */

function updateDashboard(data) {

  if (!data) return;


  const moisture =
    Number(data.moisture ?? data.soilMoisture ?? 0);


  const temperature =
    Number(data.temperature ?? data.temp ?? 0);


  const ph =
    Number(data.ph ?? 0);


  const ec =
    Number(data.ec ?? data.EC ?? 0);


  updateGauge(moisture);

  updateAdvice(moisture);

  updateTemperature(temperature);

  updatePH(ph);

  updateEC(ec);

  updateNPK(data);

  updateCharts({
    ...data,
    moisture,
    temperature
  });


  document.getElementById("updated")
    .textContent =
    "Last updated: " +
    new Date(data.timestamp || Date.now())
      .toLocaleTimeString();


  setOnline();


  addTableRow({
    ...data,
    moisture,
    temperature,
    ph,
    ec
  });

}


/* =========================================================
   TABLE
   ========================================================= */

function addTableRow(data) {

  const tbody =
    document.getElementById("rows");


  const row =
    document.createElement("tr");


  const time =
    new Date(data.timestamp || Date.now())
      .toLocaleTimeString();


  row.innerHTML = `

    <td>${time}</td>

    <td>
      <strong>${Number(data.moisture).toFixed(1)}%</strong>
    </td>

    <td>
      ${Number(data.temperature).toFixed(1)} °C
    </td>

    <td>
      ${Number(data.ph || 0).toFixed(1)}
    </td>

    <td>
      ${Number(data.ec || 0).toFixed(2)}
    </td>

    <td>
      ${data.nitrogen ?? "--"}
    </td>

    <td>
      ${data.phosphorus ?? "--"}
    </td>

    <td>
      ${data.potassium ?? "--"}
    </td>

    <td>
      <span class="reading-status">
        Live
      </span>
    </td>

  `;


  tbody.prepend(row);


  /*
     Keep only the latest 15 readings
  */

  while (tbody.children.length > 15) {

    tbody.removeChild(
      tbody.lastElementChild
    );

  }

}


/* =========================================================
   SENSOR LIST
   ========================================================= */

async function loadDevices() {

  try {

    /*
       Change this URL if your server
       uses another endpoint.
    */

    const response =
      await fetch("/api/devices");


    if (!response.ok)
      throw new Error("Unable to load devices");


    const devices =
      await response.json();


    deviceSelect.innerHTML = "";


    devices.forEach(device => {

      const option =
        document.createElement("option");

      option.value =
        device.id ?? device;

      option.textContent =
        device.name ?? device.id ?? device;

      deviceSelect.appendChild(option);

    });


    if (devices.length > 0) {

      deviceSelect.value =
        devices[0].id ?? devices[0];

    }

  }

  catch (error) {

    console.log("Device loading:", error);

    deviceSelect.innerHTML = `
      <option value="sensor-01">
        Sensor 01
      </option>
    `;

  }

}


/* =========================================================
   REAL-TIME DATA
   ========================================================= */

async function getLatestReading() {

  try {

    /*
       This endpoint should return
       the latest sensor reading.

       Example response:

       {
         "moisture": 58,
         "temperature": 27.4,
         "ph": 6.7,
         "ec": 1.2,
         "nitrogen": 52,
         "phosphorus": 28,
         "potassium": 47,
         "timestamp": "2026-10-07T12:30:00"
       }
    */

    const device =
      deviceSelect.value;


    const response =
      await fetch(
        `/api/readings/latest?device=${encodeURIComponent(device)}`
      );


    if (!response.ok)
      throw new Error("No sensor response");


    const data =
      await response.json();


    updateDashboard(data);

  }

  catch (error) {

    console.log(
      "Waiting for sensor...",
      error.message
    );

    setOffline();

  }

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

createCharts();

loadDevices()
  .then(() => {

    getLatestReading();

  });


/*
   Poll the server every 2 seconds.

   This gives the dashboard a
   real-time monitoring feel.
*/

setInterval(
  getLatestReading,
  2000
);


// ESP32 example: capacitive soil moisture sensor + DS18B20 temperature -> HTTP POST.
// Libraries: OneWire, DallasTemperature (install from Library Manager).
// Add more sensors (pH, EC, NPK) the same way and include them in the JSON.
#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASS = "YOUR_PASSWORD";
const char* SERVER_URL = "http://192.168.1.10:3000/api/readings"; // your server's IP
const char* API_KEY = "change-me";
const char* DEVICE_ID = "field-A";

const int MOISTURE_PIN = 34;   // analog input
const int ONEWIRE_PIN = 4;
const int AIR_VALUE = 3200;    // raw reading in dry air  (calibrate!)
const int WATER_VALUE = 1400;  // raw reading in water    (calibrate!)
const unsigned long INTERVAL_MS = 30000;

OneWire oneWire(ONEWIRE_PIN);
DallasTemperature temps(&oneWire);

void setup() {
  Serial.begin(115200);
  temps.begin();
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected");
}

void loop() {
  int raw = analogRead(MOISTURE_PIN);
  float moisture = constrain(map(raw, AIR_VALUE, WATER_VALUE, 0, 100), 0, 100);
  temps.requestTemperatures();
  float tempC = temps.getTempCByIndex(0);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", API_KEY);
    String body = String("{\"device_id\":\"") + DEVICE_ID + "\",\"moisture\":" + moisture +
                  ",\"temperature\":" + tempC + "}";
    int code = http.POST(body);
    Serial.printf("POST %d  moisture=%.1f  temp=%.1f\n", code, moisture, tempC);
    http.end();
  }
  delay(INTERVAL_MS);
}

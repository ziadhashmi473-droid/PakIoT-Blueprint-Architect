import { useState, useEffect, useMemo, useRef } from "react";
import {
  Wifi,
  Smartphone,
  Monitor,
  Power,
  Sliders,
  Terminal,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Activity,
  Flame,
  Fan,
  Droplets,
  AlertTriangle,
  Send,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Clock,
  Radio,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { EngineeringBlueprint } from "../types";

interface DeviceInterfaceDashboardProps {
  blueprint: EngineeringBlueprint;
  onOpenSafetyModal?: () => void;
}

interface TelemetryPoint {
  time: string;
  sensorValue: number;
  secondaryValue: number;
  relayActive: boolean;
}

export function DeviceInterfaceDashboard({
  blueprint,
  onOpenSafetyModal,
}: DeviceInterfaceDashboardProps) {
  // View mode: Web SCADA vs Mobile App HMI vs ESP32 Code
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "code">("desktop");
  
  // Simulation Controls & State
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [controlMode, setControlMode] = useState<"auto" | "manual">("auto");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Derive sensor and actuator specs from blueprint title and BOM
  const titleLower = blueprint.projectTitle.toLowerCase();
  const isIncubator = titleLower.includes("incubator") || titleLower.includes("egg") || titleLower.includes("poultry");
  const isSolarOrTubewell = titleLower.includes("tubewell") || titleLower.includes("solar") || titleLower.includes("water") || titleLower.includes("pump");
  const isEnergy = titleLower.includes("ups") || titleLower.includes("battery") || titleLower.includes("energy") || titleLower.includes("grid");

  // Primary Sensor Config
  const primarySensor = useMemo(() => {
    if (isIncubator) {
      return {
        name: "Incubation Temperature",
        unit: "°C",
        min: 20,
        max: 50,
        defaultVal: 37.8,
        step: 0.1,
        setpoint: 37.5,
        icon: Flame,
        color: "#f59e0b",
      };
    }
    if (isSolarOrTubewell) {
      return {
        name: "Soil Moisture / Tank Level",
        unit: "%",
        min: 0,
        max: 100,
        defaultVal: 34,
        step: 1,
        setpoint: 45,
        icon: Droplets,
        color: "#0284c7",
      };
    }
    if (isEnergy) {
      return {
        name: "Grid / Inverter AC Voltage",
        unit: "V",
        min: 120,
        max: 270,
        defaultVal: 218,
        step: 1,
        setpoint: 195,
        icon: Zap,
        color: "#eab308",
      };
    }
    return {
      name: "Analog Sensor (ADC1 / GPIO34)",
      unit: "%",
      min: 0,
      max: 100,
      defaultVal: 52,
      step: 1,
      setpoint: 60,
      icon: Activity,
      color: "#059669",
    };
  }, [isIncubator, isSolarOrTubewell, isEnergy]);

  // Secondary Sensor Config
  const secondarySensor = useMemo(() => {
    if (isIncubator) {
      return {
        name: "Chamber Humidity",
        unit: "%RH",
        min: 30,
        max: 95,
        defaultVal: 62,
        step: 1,
      };
    }
    if (isSolarOrTubewell) {
      return {
        name: "Water Discharge Flow",
        unit: "L/min",
        min: 0,
        max: 80,
        defaultVal: 48,
        step: 1,
      };
    }
    if (isEnergy) {
      return {
        name: "Battery Bus Voltage",
        unit: "V DC",
        min: 10,
        max: 15,
        defaultVal: 12.6,
        step: 0.1,
      };
    }
    return {
      name: "Ambient Environmental Metric",
      unit: "Raw",
      min: 0,
      max: 1024,
      defaultVal: 512,
      step: 1,
    };
  }, [isIncubator, isSolarOrTubewell, isEnergy]);

  // Dynamic user-controllable sensor slider state
  const [sensorValue, setSensorValue] = useState<number>(primarySensor.defaultVal);
  const [secondaryValue, setSecondaryValue] = useState<number>(secondarySensor.defaultVal);
  const [thresholdSetpoint, setThresholdSetpoint] = useState<number>(primarySensor.setpoint);

  // Actuator states
  const [relay1State, setRelay1State] = useState<boolean>(false);
  const [relay2State, setRelay2State] = useState<boolean>(false);
  const [alarmBuzzer, setAlarmBuzzer] = useState<boolean>(false);

  // Live telemetry time-series buffer
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => {
    const initial: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 10; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      initial.push({
        time: t.toTimeString().split(" ")[0],
        sensorValue: primarySensor.defaultVal + (Math.random() * 0.6 - 0.3),
        secondaryValue: secondarySensor.defaultVal + (Math.random() * 2 - 1),
        relayActive: false,
      });
    }
    return initial;
  });

  // Simulated Serial Console log stream
  const [logs, setLogs] = useState<string[]>([
    `[00:00:01] [BOOT] ${blueprint.targetMCU} Initialized @ 115200 baud`,
    `[00:00:02] [NET] WiFi Connected: PakIoT-AP (IP: 192.168.4.1, RSSI: -58dBm)`,
    `[00:00:03] [SAFETY] Pre-power DMM calibrated 5.05V rail verified`,
    `[00:00:04] [MQTT] Connected to telemetry broker: hivemq-pakistan.cloud`,
    `[00:00:05] [READY] Local WebServer listening on port 80 (HTTP / WebSocket)`,
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Automatic closed-loop control simulation
  useEffect(() => {
    if (controlMode === "auto") {
      let shouldRelay1BeOn = false;
      let isAlarm = false;

      if (isIncubator) {
        // In incubator: heater turns ON when temperature falls below threshold
        shouldRelay1BeOn = sensorValue < thresholdSetpoint;
        // Alarm if critically hot (> 39.5°C) or freezing (< 35°C)
        isAlarm = sensorValue > 39.2 || sensorValue < 35.0;
      } else if (isSolarOrTubewell) {
        // In irrigation: pump turns ON when soil moisture is below threshold
        shouldRelay1BeOn = sensorValue < thresholdSetpoint;
        isAlarm = sensorValue < 15;
      } else if (isEnergy) {
        // In energy: breaker or inverter disconnects if voltage spikes > 250V or sags < 170V
        shouldRelay1BeOn = sensorValue >= thresholdSetpoint && sensorValue <= 250;
        isAlarm = sensorValue < 165 || sensorValue > 255;
      } else {
        shouldRelay1BeOn = sensorValue > thresholdSetpoint;
      }

      setRelay1State(shouldRelay1BeOn);
      setAlarmBuzzer(isAlarm);
    }
  }, [sensorValue, thresholdSetpoint, controlMode, isIncubator, isSolarOrTubewell, isEnergy]);

  // Periodic telemetry streamer (simulating active device packets)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      // Add gentle realistic drift to sensor value
      const drift = (Math.random() - 0.48) * (primarySensor.step * 1.5);
      const nextSensor = Math.max(
        primarySensor.min,
        Math.min(primarySensor.max, Number((sensorValue + drift).toFixed(1)))
      );

      const nextSecondary = Math.max(
        secondarySensor.min,
        Math.min(secondarySensor.max, Number((secondaryValue + (Math.random() - 0.5) * 1.2).toFixed(1)))
      );

      setSensorValue(nextSensor);
      setSecondaryValue(nextSecondary);

      setTelemetryHistory((prev) => {
        const next = [
          ...prev.slice(1),
          {
            time: timeStr,
            sensorValue: nextSensor,
            secondaryValue: nextSecondary,
            relayActive: relay1State,
          },
        ];
        return next;
      });

      // Append terminal output occasionally
      const newLog = `[${timeStr}] [TELEMETRY] ${primarySensor.name.slice(0, 12)}: ${nextSensor} ${primarySensor.unit} | Relay1: ${
        relay1State ? "ACTIVE" : "STANDBY"
      } | RSSI: -62dBm`;
      
      setLogs((prev) => [...prev.slice(-35), newLog]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, sensorValue, secondaryValue, relay1State, primarySensor, secondarySensor]);

  // Auto scroll console
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [logs]);

  // Preset conditions for quick physical simulation testing
  const applyPreset = (type: "normal" | "low" | "high" | "critical") => {
    if (type === "normal") {
      setSensorValue(primarySensor.defaultVal);
      setSecondaryValue(secondarySensor.defaultVal);
      setLogs((prev) => [...prev, `[USER_SIM] Injected condition: NORMAL nominal operating state.`]);
    } else if (type === "low") {
      setSensorValue(primarySensor.min + (primarySensor.max - primarySensor.min) * 0.15);
      setLogs((prev) => [...prev, `[USER_SIM] Injected condition: UNDER-THRESHOLD LOW sensor dip.`]);
    } else if (type === "high") {
      setSensorValue(primarySensor.max - (primarySensor.max - primarySensor.min) * 0.2);
      setLogs((prev) => [...prev, `[USER_SIM] Injected condition: HIGH threshold condition.`]);
    } else if (type === "critical") {
      setSensorValue(primarySensor.max * 0.98);
      setAlarmBuzzer(true);
      setLogs((prev) => [...prev, `[USER_SIM] Injected condition: CRITICAL emergency spike alarm!`]);
    }
  };

  // Standalone production HTML for ESP32 SPIFFS Web Server
  const standaloneWebCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blueprint.projectTitle} - IoT HMI</title>
  <style>
    :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #10b981; --border: #334155; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem; }
    h1 { font-size: 1.25rem; font-weight: 700; color: #fff; }
    .badge { background: #064e3b; color: #6ee7b7; padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.25rem; }
    .label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
    .val { font-size: 2rem; font-weight: 800; margin: 0.5rem 0; color: #38bdf8; }
    .btn { background: #10b981; color: white; border: none; border-radius: 0.5rem; padding: 0.6rem 1.2rem; font-weight: 600; cursor: pointer; width: 100%; transition: opacity 0.2s; }
    .btn.off { background: #ef4444; }
    .btn:hover { opacity: 0.9; }
    .terminal { background: #020617; border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem; font-family: monospace; font-size: 0.75rem; color: #4ade80; height: 140px; overflow-y: auto; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>${blueprint.projectTitle}</h1>
      <p style="font-size:0.8rem; color:#94a3b8;">${blueprint.targetMCU} • Local Web Server</p>
    </div>
    <span class="badge" id="net-status">● AP CONNECTED</span>
  </header>

  <div class="grid">
    <div class="card">
      <div class="label">${primarySensor.name}</div>
      <div class="val" id="primary-val">${sensorValue.toFixed(1)} <span style="font-size:1rem;">${primarySensor.unit}</span></div>
      <p style="font-size:0.75rem; color:#94a3b8;">Threshold: ${thresholdSetpoint} ${primarySensor.unit}</p>
    </div>
    <div class="card">
      <div class="label">${secondarySensor.name}</div>
      <div class="val" id="secondary-val">${secondaryValue.toFixed(1)} <span style="font-size:1rem;">${secondarySensor.unit}</span></div>
      <p style="font-size:0.75rem; color:#94a3b8;">Hardware ADC Filter Active</p>
    </div>
    <div class="card">
      <div class="label">Relay 1 Actuator</div>
      <div class="val" id="relay-status" style="color: ${relay1State ? '#10b981' : '#64748b'}; font-size:1.5rem;">
        ${relay1State ? "ACTIVE (ON)" : "STANDBY (OFF)"}
      </div>
      <button class="btn ${relay1State ? 'off' : ''}" onclick="toggleRelay()">Toggle Manual Override</button>
    </div>
  </div>

  <div class="card">
    <div class="label" style="margin-bottom:0.5rem;">Live Device Log (WebSocket Stream)</div>
    <div class="terminal" id="term-logs">
      [READY] Server serving on 192.168.4.1:80...
    </div>
  </div>

  <script>
    let relay = ${relay1State ? 'true' : 'false'};
    function toggleRelay() {
      relay = !relay;
      fetch('/api/relay?state=' + (relay ? '1' : '0'))
        .then(r => r.json())
        .then(d => {
          document.getElementById('relay-status').innerText = relay ? 'ACTIVE (ON)' : 'STANDBY (OFF)';
          document.getElementById('relay-status').style.color = relay ? '#10b981' : '#64748b';
        })
        .catch(() => alert('Simulated toggle: Device accepted GPIO flip.'));
    }
  </script>
</body>
</html>`;

  // ESP32 AsyncWebServer C++ Code snippet
  const esp32ServerCode = `// ESP32 / ESP8266 AsyncWebServer Implementation
// Serving the responsive HMI dashboard directly from SPIFFS / LittleFS
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void setup() {
  Serial.begin(115200);
  
  // 1. Start WiFi Access Point for Direct Local Phone/Tablet Access
  WiFi.softAP("PakIoT-${blueprint.projectTitle.slice(0, 10)}", "pakistan123");
  Serial.print("Access Point IP: ");
  Serial.println(WiFi.softAPIP()); // Usually 192.168.4.1

  // 2. Initialize SPIFFS Storage for Web Assets
  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS Mount Failed");
  }

  // 3. API Endpoint to read live sensor readings
  server.on("/api/telemetry", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<200> doc;
    doc["primary"] = analogRead(34);
    doc["relay1"] = digitalRead(25);
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  // 4. API Endpoint to toggle relays from HMI interface
  server.on("/api/relay", HTTP_GET, [](AsyncWebServerRequest *request) {
    if (request->hasParam("state")) {
      String state = request->getParam("state")->value();
      digitalWrite(25, state == "1" ? LOW : HIGH); // Active-LOW optocoupled relay
      request->send(200, "application/json", "{\\"success\\":true}");
    }
  });

  // 5. Serve Web Interface from Flash Memory
  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");
  server.begin();
  Serial.println("HTTP & WebSocket Web Server Ready on Port 80");
}

void loop() {
  ws.cleanupClients();
}`;

  return (
    <div id="device-interface-dashboard-container" className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Interactive Device HMI & Web Dashboard
              </h3>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                Live Simulation
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Interactive graphical user interface for {blueprint.projectTitle}. Test control loops,
              manipulate sensor levels, toggle relays, or grab the ready-to-flash ESP32 Web Server code.
            </p>
          </div>

          {/* Mode Switcher Tabs & Safety First Button */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {onOpenSafetyModal && (
              <button
                type="button"
                onClick={onOpenSafetyModal}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100 hover:border-rose-400 transition-colors shadow-2xs"
                title="Open Critical DMM & Wiring Safety Rules Overlay"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                <span>Safety First</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                id="hmi-mode-desktop"
                type="button"
                onClick={() => setViewMode("desktop")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "desktop"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Monitor className="h-3.5 w-3.5 text-emerald-600" />
                <span>Web SCADA</span>
              </button>
              <button
                id="hmi-mode-mobile"
                type="button"
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "mobile"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Mobile Phone HMI</span>
              </button>
              <button
                id="hmi-mode-code"
                type="button"
                onClick={() => setViewMode("code")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "code"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Code2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>ESP32 WebServer Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Device Status Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <Wifi className="h-3.5 w-3.5 text-emerald-600" /> WiFi Access Point
            </div>
            <div className="mt-1 font-mono font-bold text-slate-900">
              192.168.4.1 <span className="text-emerald-600 text-[10px] font-sans font-semibold">(-58 dBm)</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <Cpu className="h-3.5 w-3.5 text-emerald-600" /> Host Microcontroller
            </div>
            <div className="mt-1 font-bold text-slate-900 truncate">
              {blueprint.targetMCU.split(" ")[0]}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <Radio className="h-3.5 w-3.5 text-emerald-600" /> Protocol / Cloud
            </div>
            <div className="mt-1 font-bold text-slate-900 truncate">
              {blueprint.section9_cloudAndTelemetry.protocol.split("/")[0].trim()}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <Clock className="h-3.5 w-3.5 text-emerald-600" /> Device Uptime
            </div>
            <div className="mt-1 font-mono font-bold text-slate-900">
              04h : 18m : 42s
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: DESKTOP / WEB SCADA DASHBOARD */}
      {viewMode === "desktop" && (
        <div className="space-y-6">
          {/* Quick Simulation Injector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">Hardware Injection Test:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset("normal")}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Nominal Normal
              </button>
              <button
                type="button"
                onClick={() => applyPreset("low")}
                className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-colors"
              >
                Dip / Under-Threshold
              </button>
              <button
                type="button"
                onClick={() => applyPreset("high")}
                className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                High Heat / Over-Threshold
              </button>
              <button
                type="button"
                onClick={() => applyPreset("critical")}
                className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
              >
                Critical Alarm Trigger
              </button>
              <button
                type="button"
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  isLiveStreaming
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>{isLiveStreaming ? "Live Stream Active" : "Stream Paused"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Gauges & Relays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SENSOR 1: PRIMARY METRIC CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {primarySensor.name}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    GPIO 34 ADC1
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {sensorValue.toFixed(1)}
                  </span>
                  <span className="text-lg font-bold text-slate-500">
                    {primarySensor.unit}
                  </span>
                </div>

                {/* Status indicator bar */}
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            ((sensorValue - primarySensor.min) /
                              (primarySensor.max - primarySensor.min)) *
                              100
                          )
                        )}%`,
                        backgroundColor:
                          sensorValue > thresholdSetpoint ? "#f59e0b" : "#10b981",
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{primarySensor.min}{primarySensor.unit}</span>
                    <span>Setpoint: {thresholdSetpoint}{primarySensor.unit}</span>
                    <span>{primarySensor.max}{primarySensor.unit}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Slider to manipulate sensor in real time */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
                  <span>Interactive Sensor Slider:</span>
                  <span className="font-mono text-emerald-600 font-bold">{sensorValue.toFixed(1)} {primarySensor.unit}</span>
                </label>
                <input
                  type="range"
                  min={primarySensor.min}
                  max={primarySensor.max}
                  step={primarySensor.step}
                  value={sensorValue}
                  onChange={(e) => setSensorValue(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* SENSOR 2: SECONDARY METRIC CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {secondarySensor.name}
                  </span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                    I2C / Bus
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {secondaryValue.toFixed(1)}
                  </span>
                  <span className="text-lg font-bold text-slate-500">
                    {secondarySensor.unit}
                  </span>
                </div>

                {/* Status indicator bar */}
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            ((secondaryValue - secondarySensor.min) /
                              (secondarySensor.max - secondarySensor.min)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{secondarySensor.min} {secondarySensor.unit}</span>
                    <span>Nominal Band</span>
                    <span>{secondarySensor.max} {secondarySensor.unit}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Slider */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
                  <span>Adjust Value:</span>
                  <span className="font-mono text-sky-600 font-bold">{secondaryValue.toFixed(1)} {secondarySensor.unit}</span>
                </label>
                <input
                  type="range"
                  min={secondarySensor.min}
                  max={secondarySensor.max}
                  step={secondarySensor.step}
                  value={secondaryValue}
                  onChange={(e) => setSecondaryValue(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            {/* ACTUATOR & RELAY CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Optocoupled Actuator Relays
                  </span>
                  <div className="flex items-center gap-1 rounded-md bg-slate-100 p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setControlMode("auto")}
                      className={`rounded px-1.5 py-0.5 ${controlMode === "auto" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
                    >
                      AUTO
                    </button>
                    <button
                      type="button"
                      onClick={() => setControlMode("manual")}
                      className={`rounded px-1.5 py-0.5 ${controlMode === "manual" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
                    >
                      MANUAL
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Relay 1 Primary */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${relay1State ? "bg-emerald-500 text-white shadow-xs" : "bg-slate-200 text-slate-600"}`}>
                        <Power className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Relay 1: {isIncubator ? "220V Heater" : isSolarOrTubewell ? "Pump Contactor" : "Primary Load (GPIO 25)"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {relay1State ? "ENERGIZED (CLOSED)" : "DE-ENERGIZED (OPEN)"}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={controlMode === "auto"}
                      onClick={() => {
                        setRelay1State(!relay1State);
                        setLogs((p) => [...p, `[USER_OVERRIDE] Toggled Relay 1 -> ${!relay1State ? 'ON' : 'OFF'}`]);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        relay1State
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      } ${controlMode === "auto" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {relay1State ? "ON" : "OFF"}
                    </button>
                  </div>

                  {/* Relay 2 Auxiliary */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${relay2State ? "bg-violet-500 text-white shadow-xs" : "bg-slate-200 text-slate-600"}`}>
                        <Fan className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Relay 2: {isIncubator ? "Circulation Fan" : isSolarOrTubewell ? "Solenoid Valve" : "Aux Load (GPIO 26)"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {relay2State ? "ENERGIZED" : "STANDBY"}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRelay2State(!relay2State);
                        setLogs((p) => [...p, `[USER_OVERRIDE] Toggled Aux Relay 2 -> ${!relay2State ? 'ON' : 'OFF'}`]);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        relay2State
                          ? "bg-violet-600 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {relay2State ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Setpoint Threshold Configuration */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
                  <span>Hysteresis Setpoint Trigger:</span>
                  <span className="font-mono text-amber-600 font-bold">{thresholdSetpoint} {primarySensor.unit}</span>
                </label>
                <input
                  type="range"
                  min={primarySensor.min}
                  max={primarySensor.max}
                  step={primarySensor.step}
                  value={thresholdSetpoint}
                  onChange={(e) => setThresholdSetpoint(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* TELEMETRY RUNNING CHART & LIVE SERIAL MONITOR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Chart (2 Columns) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Telemetry Trend Stream
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    {primarySensor.name.split(" ")[0]} ({primarySensor.unit})
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-sky-700">
                    <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                    {secondarySensor.name.split(" ")[0]} ({secondarySensor.unit})
                  </span>
                </div>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetryHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={{ stroke: "#cbd5e1" }}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      domain={['auto', 'auto']}
                      width={40}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as TelemetryPoint;
                          return (
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs">
                              <span className="font-bold text-slate-900 block mb-1">
                                Timestamp: {data.time}
                              </span>
                              <div className="text-emerald-700 font-semibold">
                                {primarySensor.name}: {data.sensorValue.toFixed(1)} {primarySensor.unit}
                              </div>
                              <div className="text-sky-700 font-semibold">
                                {secondarySensor.name}: {data.secondaryValue.toFixed(1)} {secondarySensor.unit}
                              </div>
                              <div className="text-slate-500 mt-1">
                                Relay: {data.relayActive ? "ACTIVE" : "STANDBY"}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sensorValue"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="secondaryValue"
                      stroke="#0284c7"
                      strokeWidth={1.8}
                      dot={false}
                      strokeDasharray="4 4"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Serial / Telemetry Stream Console (1 Column) */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-4 shadow-xs text-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300">
                      UART Serial Monitor (115200)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogs([`[00:00:00] [CLEAR] Buffer reset by operator.`])}
                    className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                </div>

                <div
                  ref={terminalEndRef}
                  className="space-y-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400/90 h-52 scrollbar-thin pr-1"
                >
                  {logs.map((line, idx) => (
                    <div key={idx} className="break-all">
                      <span className="text-slate-500">{line.slice(0, 10)}</span>{" "}
                      <span className={line.includes("CRITICAL") || line.includes("ALARM") ? "text-rose-400 font-bold" : line.includes("OVERRIDE") ? "text-amber-300" : ""}>
                        {line.slice(10)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>COM4 • 8-N-1 Flow Off</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> RX ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MOBILE PHONE / BLYNK HMI SIMULATION */}
      {viewMode === "mobile" && (
        <div className="flex justify-center py-4">
          <div className="w-full max-w-sm rounded-[40px] border-8 border-slate-900 bg-slate-900 p-4 shadow-2xl overflow-hidden ring-1 ring-slate-800">
            {/* Phone Speaker Notch */}
            <div className="mx-auto h-5 w-32 rounded-full bg-slate-800 mb-4 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-slate-950 mr-2"></div>
              <div className="h-1 w-10 rounded-full bg-slate-900"></div>
            </div>

            {/* Mobile App Canvas Screen */}
            <div className="rounded-[28px] bg-slate-950 p-4 text-white min-h-[580px] flex flex-col justify-between">
              <div>
                {/* Mobile Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      PakIoT Cloud App
                    </span>
                    <h5 className="text-sm font-extrabold text-white truncate max-w-[190px]">
                      {blueprint.projectTitle}
                    </h5>
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    ONLINE
                  </span>
                </div>

                {/* Primary Dial Widget */}
                <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-center mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {primarySensor.name}
                  </span>
                  <div className="mt-2 text-4xl font-black text-emerald-400">
                    {sensorValue.toFixed(1)} <span className="text-base text-slate-400 font-normal">{primarySensor.unit}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Target Setpoint: {thresholdSetpoint} {primarySensor.unit}
                  </div>
                </div>

                {/* Secondary Gauge */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">
                      {secondarySensor.name.split(" ")[0]}
                    </span>
                    <span className="text-xl font-bold text-sky-400 mt-1 block">
                      {secondaryValue.toFixed(0)} {secondarySensor.unit}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">
                      Signal RSSI
                    </span>
                    <span className="text-xl font-bold text-emerald-400 mt-1 block">
                      -62 dBm
                    </span>
                  </div>
                </div>

                {/* Mobile Relays */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <div className="flex items-center gap-2">
                      <Power className={`h-4 w-4 ${relay1State ? "text-emerald-400" : "text-slate-500"}`} />
                      <span className="text-xs font-semibold text-slate-200">
                        Relay 1 Output
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRelay1State(!relay1State)}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                        relay1State ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white transition-transform ${
                          relay1State ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <div className="flex items-center gap-2">
                      <Fan className={`h-4 w-4 ${relay2State ? "text-violet-400" : "text-slate-500"}`} />
                      <span className="text-xs font-semibold text-slate-200">
                        Relay 2 Output
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRelay2State(!relay2State)}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                        relay2State ? "bg-violet-500" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white transition-transform ${
                          relay2State ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Alarm Status Banner */}
                {alarmBuzzer ? (
                  <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-2.5 text-center text-xs text-rose-300 flex items-center justify-center gap-1.5 animate-pulse">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                    <span className="font-bold">Threshold Alarm Triggered!</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 p-2.5 text-center text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>All parameters within safe operating bounds</span>
                  </div>
                )}
              </div>

              {/* Mobile Home Pill */}
              <div className="mx-auto h-1 w-28 rounded-full bg-slate-700 mt-4"></div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: ESP32 EMBEDDED WEB SERVER CODE */}
      {viewMode === "code" && (
        <div className="space-y-6">
          {/* Card 1: Standalone HTML File */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-600" />
                  Standalone index.html (Save to /data/index.html in SPIFFS / LittleFS)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zero external dependencies. Can be hosted directly on your ESP32 flash memory for local WiFi hotspot control.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(standaloneWebCode);
                  setCopiedHtml(true);
                  setTimeout(() => setCopiedHtml(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto"
              >
                {copiedHtml ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedHtml ? "Copied HTML!" : "Copy index.html"}</span>
              </button>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 leading-relaxed max-h-80">
              {standaloneWebCode}
            </pre>
          </div>

          {/* Card 2: Arduino C++ AsyncWebServer Code */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-600" />
                  ESPAsyncWebServer.cpp (Microcontroller Firmware Handler)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Initializes WiFi Access Point, sets up REST API endpoints, and serves the web interface.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(esp32ServerCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? "Copied C++ Code!" : "Copy C++ Snippet"}</span>
              </button>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 leading-relaxed max-h-80">
              {esp32ServerCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

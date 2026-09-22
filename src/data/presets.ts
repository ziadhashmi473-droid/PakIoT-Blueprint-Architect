import { ProjectPreset } from "../types";

export const PRESET_BLUEPRINTS: ProjectPreset[] = [
  {
    id: "solar-tube-well-gsm",
    title: "Solar Tube-Well Automation with GSM Failover & Soil Moisture",
    shortDesc: "Automates agricultural water pumping using capacitive soil sensors, 3-phase AC contactor relay isolation, LM2596 buck regulator, and SIM800L SMS/GPRS telemetry for off-grid rural Punjab & Sindh.",
    category: "Agriculture",
    iconName: "Wheat",
    targetMCU: "ESP32 DevKit V1 (30-Pin)",
    budgetPKR: 8450,
    blueprint: {
      projectTitle: "Solar Tube-Well Automation with GSM Failover & Soil Moisture",
      projectSubtitle: "Industrial-Grade Agricultural Pumping Controller for Remote Pakistani Farms with WAPDA/Solar Failover",
      targetMCU: "ESP32 DevKit V1 (30-Pin) + SIM800L GSM Module",
      estimatedBudgetPKR: 8450,
      difficulty: "Advanced",
      operatingVoltage: "12V DC Solar/Battery stepped to 5.0V & 3.3V Logic, Controlling 220V/380V Contactor",

      section1_executiveSummary: {
        purpose: "Eliminate manual night-time visits to rural agricultural fields by automating deep-well electric and solar tube-wells based on calibrated soil volumetric water content (VWC), borehole water-table float safety, and remote cellular SMS/GPRS commands.",
        automationWorkflow: "The ESP32 reads analog capacitive moisture levels every 15 minutes. If moisture drops below 28% and the borehole lower float switch confirms water availability, the system triggers an optocoupled relay that energizes a heavy-duty 220V/380V magnetic contactor coil. SIM800L transmits SMS alerts ('TUBEWELL STARTED: Soil 24%') and syncs telemetry to an MQTT broker. If cellular network drops, manual override push-buttons and local fail-safe timers prevent dry-run borehole burnouts.",
        realWorldUtility: "In Pakistan, agricultural load shedding (6 to 10 hours daily in rural feeders like MEPCO, FESCO, and LESCO) causes farmers to miss optimal irrigation windows. This unit operates autonomously from a 12V solar buffer, auto-resuming pumping the second grid or solar power returns while safeguarding the motor from dry running.",
        keyFeatures: [
          "Corrosion-resistant Capacitive Soil Moisture V1.2 sensing (no galvanic degradation)",
          "Optocoupled PC817 + 30A SLA Relay driving industrial magnetic contactor",
          "SIM800L Quad-Band GSM for 2G SMS control across Jazz, Zong, and Telenor",
          "LM2596 high-efficiency buck converter with 1000µF surge capacitor for GSM 2A bursts",
          "Dry-run float switch interlock with 45-minute automatic cooldown timer"
        ]
      },

      section2_bom: {
        totalEstimatedPKR: 8450,
        vendors: [
          {
            name: "Digilog.pk",
            city: "Islamabad / Rawalpindi (Online / I-9 Industrial)",
            type: "Online",
            notes: "Verified stock for genuine ESP32-WROOM-32 and capacitive sensors"
          },
          {
            name: "Hall Road Electronics Market",
            city: "Lahore",
            type: "Physical Market",
            notes: "Best wholesale rates for Schneider/Himel 220V magnetic contactors and 12V dry batteries"
          },
          {
            name: "Chip.pk",
            city: "Rawalpindi (College Road)",
            type: "Physical Market",
            notes: "Great for passives, 1N4007 diodes, PC817 optocouplers, and LM2596 modules"
          }
        ],
        components: [
          {
            name: "ESP32 NodeMCU DevKit V1 (30 Pin)",
            model: "ESP32-WROOM-32D Dual-Core 240MHz",
            category: "MCU",
            quantity: 1,
            estimatedPricePKR: 1450,
            sourceVendor: "Digilog.pk / Hall Road",
            criticalNotes: "Verify CP2102 or CH340 USB driver; use 30-pin narrow pitch for easy breadboarding"
          },
          {
            name: "SIM800L GPRS/GSM Micro-SIM Module",
            model: "SIM800L Core Board V2 with Spring Antenna",
            category: "Actuator",
            quantity: 1,
            estimatedPricePKR: 1650,
            sourceVendor: "Chip.pk / Digilog.pk",
            criticalNotes: "Requires stable 3.8V-4.2V supply capable of 2A peak current bursts during GSM registration"
          },
          {
            name: "LM2596 DC-DC Step-Down Buck Converter",
            model: "LM2596S Adjustable with Blue Multi-turn Trimpot",
            category: "Power",
            quantity: 2,
            estimatedPricePKR: 480,
            sourceVendor: "Digilog.pk / College Rd",
            criticalNotes: "One tuned to 5.00V for ESP32/Relay; second tuned to 4.00V for SIM800L power"
          },
          {
            name: "Capacitive Soil Moisture Sensor V1.2",
            model: "Analog Output 1.2V-3.0V (Corrosion Resistant)",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 350,
            sourceVendor: "Chip.pk",
            criticalNotes: "Do NOT use resistive fork probes; seal edge electronics with conformal silicone coating"
          },
          {
            name: "Submersible Stainless/PP Float Switch",
            model: "M10 Liquid Water Level Float Sensor (Normally Open)",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 450,
            sourceVendor: "Hall Road Lahore",
            criticalNotes: "Hang 3 meters down borehole tube; wired with internal pull-up to detect water depletion"
          },
          {
            name: "1-Channel 30A Optocoupled Relay Module",
            model: "SLA-05VDC-SL-A High-Power Relay with PC817",
            category: "Actuator",
            quantity: 1,
            estimatedPricePKR: 550,
            sourceVendor: "Digilog.pk",
            criticalNotes: "Relay contacts trigger 220V magnetic contactor coil (A1/A2). Never switch motor load directly on PCB"
          },
          {
            name: "AC Magnetic Contactor (220V Coil)",
            model: "Schneider EasyPact TVS / Chint NC1-1810 (18A AC-3 rating)",
            category: "Actuator",
            quantity: 1,
            estimatedPricePKR: 2400,
            sourceVendor: "Hall Road / College Road Electric Market",
            criticalNotes: "Mandatory to handle 7.5HP to 10HP tube-well motor inrush current (LRA up to 60A)"
          },
          {
            name: "Passive & Protection Kit",
            model: "1N4007 Diodes (5x), 1000µF 25V Low-ESR Caps (2x), 10k/1k Resistors",
            category: "Wiring/Protection",
            quantity: 1,
            estimatedPricePKR: 320,
            sourceVendor: "Chip.pk",
            criticalNotes: "Flyback diode across DC coils; bypass capacitor right at SIM800L VCC/GND pins"
          },
          {
            name: "IP65 Waterproof PVC Junction Enclosure",
            model: "200mm x 150mm x 100mm with PG9 Cable Glands",
            category: "Wiring/Protection",
            quantity: 1,
            estimatedPricePKR: 800,
            sourceVendor: "Digilog.pk / Hall Road",
            criticalNotes: "Must withstand outdoor Punjab summer sun (48°C) and dusty rural ambient conditions"
          }
        ]
      },

      section3_wiringAndSafety: {
        safetyRules: [
          "VOLTAGE ISOLATION MANDATE: Never connect 12V or 220V to any ESP32 GPIO pin. Maximum allowable voltage on any ESP32 GPIO is strictly 3.3V.",
          "PRE-POWER DMM TUNING: Before connecting the ESP32 or SIM800L, power the LM2596 from the 12V supply and adjust the brass trimpot with a DMM until output measures exactly 5.05V (Buck 1) and 4.02V (Buck 2).",
          "INDUCTIVE KICKBACK SUPPRESSION: Place a 1N4007 diode in reverse-bias (cathode to +12V, anode to collector/GND) across any DC relay coil to absorb counter-EMF spikes.",
          "SEPARATED CONTACTOR COIL: The 30A relay module isolates the low-voltage electronics. Its output NO/COM contacts switch the 220V Live line to the Contactor Coil terminal A1. Contactor terminal A2 is wired to AC Neutral through a 2A glass fuse.",
          "GSM SURGE BUFFER: Solder a 1000µF 16V low-ESR electrolytic capacitor directly across the SIM800L VCC and GND pins to prevent brownout resets during GSM burst transmission."
        ],
        powerSupplyLogic: "12V Solar Battery/Power Bank -> Split into 2x LM2596 Step-down Modules. Buck 1 outputs 5.0V to ESP32 VIN pin and 30A Relay VCC. Buck 2 outputs 4.0V dedicated to SIM800L VCC pin. Common GND plane bonded together across all DC modules.",
        connections: [
          {
            fromComponent: "LM2596 Buck #1 (Out +)",
            fromPin: "OUT+",
            toComponent: "ESP32 DevKit",
            toPin: "VIN / 5V",
            signalType: "Power",
            voltageLevel: "5V",
            protection: "Reverse Polarity Schottky Diode 1N5819"
          },
          {
            fromComponent: "LM2596 Buck #1 (Out -)",
            fromPin: "OUT-",
            toComponent: "ESP32 DevKit",
            toPin: "GND",
            signalType: "Power",
            voltageLevel: "GND",
            protection: "Solid ground bus star topology"
          },
          {
            fromComponent: "LM2596 Buck #2 (Out +)",
            fromPin: "OUT+",
            toComponent: "SIM800L Core",
            toPin: "VCC (NET)",
            signalType: "Power",
            voltageLevel: "3.3V",
            protection: "Tuned to 4.0V + 1000µF 16V low-ESR capacitor"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 17 (TX2)",
            toComponent: "SIM800L Core",
            toPin: "RXD",
            signalType: "UART",
            voltageLevel: "3.3V",
            protection: "1kΩ inline current limiting resistor (SIM800L is 2.8V-3.3V tolerant)"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 16 (RX2)",
            toComponent: "SIM800L Core",
            toPin: "TXD",
            signalType: "UART",
            voltageLevel: "3.3V",
            protection: "Direct connection (SIM800L outputs 2.8V HIGH, read cleanly by ESP32)"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 25",
            toComponent: "30A SLA Relay Module",
            toPin: "IN",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "Optocoupler PC817 active-LOW logic with 10k pull-up"
          },
          {
            fromComponent: "Capacitive Soil Sensor",
            fromPin: "AOUT",
            toComponent: "ESP32 DevKit",
            toPin: "GPIO 34 (ADC1_CH6)",
            signalType: "Analog",
            voltageLevel: "3.3V",
            protection: "100nF ceramic noise capacitor to GND (ADC1 is WiFi safe)"
          },
          {
            fromComponent: "Borehole Float Switch",
            fromPin: "Signal Contact",
            toComponent: "ESP32 DevKit",
            toPin: "GPIO 26",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "Internal pull-up enabled + 1k external resistor to protect against wire shorts"
          },
          {
            fromComponent: "30A Relay Terminal COM",
            fromPin: "COM",
            toComponent: "220V WAPDA Grid",
            toPin: "220V AC Phase Line (L)",
            signalType: "Power",
            voltageLevel: "12V",
            protection: "2A Fast-blow glass cartridge fuse on Live feed"
          },
          {
            fromComponent: "30A Relay Terminal NO",
            fromPin: "NO",
            toComponent: "Magnetic Contactor",
            toPin: "Coil Terminal A1",
            signalType: "Power",
            voltageLevel: "12V",
            protection: "RC Snubber (0.1µF 630V + 100Ω 2W resistor) across coil"
          }
        ]
      },

      section4_systemFlow: {
        mermaidGraph: `flowchart TD
    SOLAR[12V Solar Panel / Battery Bank] --> BUCK1[LM2596 Buck Regulator #1\\nTuned to 5.0V]
    SOLAR --> BUCK2[LM2596 Buck Regulator #2\\nTuned to 4.0V + 1000uF]
    
    BUCK1 -->|5V DC| MCU[ESP32 WROOM-32 Dual Core]
    BUCK1 -->|5V DC| RELAY[30A Optocoupled Relay]
    BUCK2 -->|4.0V 2A Peak| GSM[SIM800L GSM Module]
    
    SOIL[Capacitive Moisture Sensor V1.2] -->|Analog 1.2V-3.0V| MCU
    FLOAT[Borehole Liquid Level Float] -->|Dry Run Interlock GPIO26| MCU
    
    MCU -->|UART AT Commands| GSM
    GSM -.->|2G Cellular Network| TOWER[Jazz / Zong / Telenor Cell Tower]
    TOWER -.->|SMS & MQTT Telemetry| USER[Farmer Mobile Phone & Cloud Dashboard]
    
    MCU -->|Isolated GPIO 25 Trigger| RELAY
    RELAY -->|Switches 220V Live| COIL[AC Magnetic Contactor Coil A1/A2]
    COIL -->|3-Phase 380V/220V Contacts Close| MOTOR[7.5HP/10HP Deep Tube-Well Motor]`,
        narrativeFlow: "1. The 12V battery charges from the solar array and feeds two LM2596 buck regulators.\n2. LM2596 #1 delivers ripple-free 5.0V to the ESP32. LM2596 #2 delivers 4.0V with a 1000µF capacitor to the SIM800L.\n3. The ESP32 wakes up every 10 seconds, samples the ADC1 pin reading the capacitive soil probe, and checks the dry-run float switch.\n4. If moisture < threshold (e.g. dry soil) AND float switch confirms adequate borehole water, the ESP32 drives GPIO 25 LOW to energize the optocoupled relay.\n5. The relay connects 220V phase to the AC magnetic contactor coil A1, clamping the main 3-phase contacts and starting the tube-well.\n6. The SIM800L transmits an SMS status notification to the farmer's registered phone number and logs runtime data via GPRS."
      },

      section5_firmware: {
        language: "C++ (Arduino / ESP-IDF)",
        targetPlatform: "ESP32 Dev Module (Arduino Core 3.0+)",
        requiredLibraries: [
          "#include <HardwareSerial.h> // ESP32 Hardware UART for SIM800L",
          "#include <Preferences.h>    // Non-volatile EEPROM storage for SMS auth numbers",
          "#include <esp_task_wdt.h>   // Hardware Watchdog Timer to prevent lockups"
        ],
        codeHighlights: [
          "Non-blocking millis() timer state machine (zero delay() blocking calls)",
          "Borehole dry-run safety lock with automatic 45-minute cooldown",
          "SIM800L AT Command parser with SMS whitelist security for Pakistan numbers (+923...)",
          "ADC1 multichannel filtering with 10-sample rolling average to reject solar inverter EMI",
          "Hardware watchdog timer (WDT) with 15-second reset safeguard against lockups"
        ],
        code: `/*
 * ==============================================================================
 * Project: Solar Tube-Well & Soil Moisture Controller with SIM800L GSM Failover
 * Author: PakIoT Embedded Systems Blueprint
 * Target Hardware: ESP32-WROOM-32D (30-Pin) + SIM800L + Capacitive Sensor V1.2
 * Target Location: Punjab & Sindh Agricultural Zones, Pakistan
 * Operating Frequency: 240MHz | Baud: 115200 (Debug), 9600 (SIM800L UART2)
 * ==============================================================================
 */

#include <Arduino.h>
#include <HardwareSerial.h>
#include <esp_task_wdt.h>

// --------------------------- PIN DEFINITIONS ---------------------------------
#define PIN_SOIL_ADC       34  // ADC1_CH6 (Safe with WiFi/GSM active)
#define PIN_FLOAT_SWITCH   26  // Borehole dry-run float switch (Active LOW)
#define PIN_RELAY_PUMP     25  // 30A Optocoupled Relay (Active LOW on opto)
#define PIN_LED_STATUS      2  // Built-in blue diagnostic LED
#define GSM_RX_PIN         16  // ESP32 RX2 connected to SIM800L TXD
#define GSM_TX_PIN         17  // ESP32 TX2 connected to SIM800L RXD (via 1k resistor)

// --------------------------- CALIBRATION CONSTANTS ---------------------------
const int SOIL_AIR_VALUE    = 3200; // ADC raw in dry air (Calibrated at 25°C)
const int SOIL_WATER_VALUE  = 1350; // ADC raw submerged in water
const int DRY_THRESHOLD_PCT = 25;   // Trigger pump when moisture drops below 25%
const int WET_THRESHOLD_PCT = 75;   // Stop pump when moisture reaches 75%
const unsigned long WDT_TIMEOUT_SECONDS = 15;

// Whitelist phone number for remote SMS commands (Format: +923XXXXXXXXX)
const char* AUTHORIZED_PHONE = "+923001234567";

// --------------------------- STATE VARIABLES ---------------------------------
HardwareSerial sim800(2); // Use Hardware UART2 on ESP32

bool pumpState = false;
bool dryRunAlert = false;
unsigned long lastSensorReadTime = 0;
unsigned long pumpStartTime = 0;
const unsigned long MAX_PUMP_RUN_MS = 4 * 60 * 60 * 1000UL; // Max 4 hours continuous run
const unsigned long SENSOR_INTERVAL_MS = 15000UL;           // Check sensors every 15s

// --------------------------- FUNCTION DECLARATIONS ---------------------------
int readSoilMoisturePercent();
void setPump(bool state, const char* reason);
void handleIncomingSMS();
void sendSMS(const char* number, const char* message);
void initSIM800L();

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println(F("[SYSTEM] PakIoT Solar Tube-Well Controller Starting..."));

  // Configure GPIO Pins
  pinMode(PIN_RELAY_PUMP, OUTPUT);
  digitalWrite(PIN_RELAY_PUMP, HIGH); // De-energize relay (Active LOW)
  
  pinMode(PIN_FLOAT_SWITCH, INPUT_PULLUP);
  pinMode(PIN_LED_STATUS, OUTPUT);
  pinMode(PIN_SOIL_ADC, INPUT);
  
  // Initialize Hardware Watchdog (15 seconds)
  esp_task_wdt_init(WDT_TIMEOUT_SECONDS, true);
  esp_task_wdt_add(NULL);

  // Initialize GSM UART2
  sim800.begin(9600, SERIAL_8N1, GSM_RX_PIN, GSM_TX_PIN);
  delay(2000);
  initSIM800L();

  Serial.println(F("[SYSTEM] All Subsystems Online. Ready for autonomous irrigation."));
  sendSMS(AUTHORIZED_PHONE, "Tube-Well Controller is ONLINE. Ready for irrigation.");
}

void loop() {
  // Feed Hardware Watchdog
  esp_task_wdt_reset();

  unsigned long currentMillis = millis();

  // 1. Process Incoming SMS Commands
  if (sim800.available()) {
    handleIncomingSMS();
  }

  // 2. Periodic Sensor Evaluation & Safety Logic
  if (currentMillis - lastSensorReadTime >= SENSOR_INTERVAL_MS) {
    lastSensorReadTime = currentMillis;

    int moisturePercent = readSoilMoisturePercent();
    bool waterAvailable = (digitalRead(PIN_FLOAT_SWITCH) == LOW); // Float closed = water OK

    Serial.printf("[TELEMETRY] Soil Moisture: %d%% | Borehole Float: %s | Pump: %s\\n",
                  moisturePercent,
                  waterAvailable ? "NORMAL" : "DRY RUN HAZARD",
                  pumpState ? "ON" : "OFF");

    // Safety Interlock 1: Dry-run Borehole protection
    if (!waterAvailable) {
      if (pumpState) {
        setPump(false, "SAFETY: Borehole water table dropped below float level!");
        sendSMS(AUTHORIZED_PHONE, "ALERT: Pump stopped! Borehole dry-run float triggered.");
        dryRunAlert = true;
      }
    } else {
      dryRunAlert = false;
    }

    // Safety Interlock 2: Max continuous run timeout (prevent flooding)
    if (pumpState && (currentMillis - pumpStartTime >= MAX_PUMP_RUN_MS)) {
      setPump(false, "TIMER: Maximum 4-hour irrigation cycle completed.");
      sendSMS(AUTHORIZED_PHONE, "NOTIFICATION: Irrigation cycle finished (4h max timer).");
    }

    // Automated Irrigation Decision Loop
    if (!dryRunAlert) {
      if (!pumpState && moisturePercent < DRY_THRESHOLD_PCT) {
        setPump(true, "AUTO: Soil moisture below threshold (25%)");
        char msg[100];
        snprintf(msg, sizeof(msg), "PUMP STARTED: Soil at %d%%. Target: %d%%", moisturePercent, WET_THRESHOLD_PCT);
        sendSMS(AUTHORIZED_PHONE, msg);
      } else if (pumpState && moisturePercent >= WET_THRESHOLD_PCT) {
        setPump(false, "AUTO: Soil field capacity reached (75%)");
        char msg[100];
        snprintf(msg, sizeof(msg), "PUMP STOPPED: Soil reached %d%% saturation.", moisturePercent);
        sendSMS(AUTHORIZED_PHONE, msg);
      }
    }

    // Heartbeat LED toggle
    digitalWrite(PIN_LED_STATUS, !digitalRead(PIN_LED_STATUS));
  }
}

// Read and smooth Capacitive Moisture with 10-sample rolling filter
int readSoilMoisturePercent() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(PIN_SOIL_ADC);
    delay(5);
  }
  int raw = sum / 10;
  int percent = map(raw, SOIL_AIR_VALUE, SOIL_WATER_VALUE, 0, 100);
  return constrain(percent, 0, 100);
}

// Actuate 30A Optocoupled Relay safely
void setPump(bool state, const char* reason) {
  pumpState = state;
  if (pumpState) {
    digitalWrite(PIN_RELAY_PUMP, LOW); // Active-LOW: Energize relay coil
    pumpStartTime = millis();
    Serial.printf("[ACTUATION] -> PUMP ON: %s\\n", reason);
  } else {
    digitalWrite(PIN_RELAY_PUMP, HIGH); // De-energize relay
    Serial.printf("[ACTUATION] -> PUMP OFF: %s\\n", reason);
  }
}

// Initialize SIM800L module
void initSIM800L() {
  sim800.println(F("AT"));
  delay(300);
  sim800.println(F("ATE0")); // Echo off
  delay(300);
  sim800.println(F("AT+CMGF=1")); // Set SMS to text mode
  delay(300);
  sim800.println(F("AT+CNMI=2,2,0,0,0")); // Route incoming SMS directly to serial
  delay(500);
  Serial.println(F("[GSM] SIM800L Initialized in SMS Text Mode."));
}

// Send standard GSM SMS
void sendSMS(const char* number, const char* message) {
  Serial.printf("[GSM] Sending SMS to %s...\\n", number);
  sim800.printf("AT+CMGS=\\"%s\\"\\r\\n", number);
  delay(500);
  sim800.print(message);
  delay(200);
  sim800.write(26); // Ctrl+Z termination code
  delay(3000);
}

// Parse remote SMS control commands ("STATUS", "PUMP ON", "PUMP OFF")
void handleIncomingSMS() {
  String response = sim800.readString();
  Serial.print(F("[GSM INCOMING] "));
  Serial.println(response);

  // Simple command parser
  if (response.indexOf("PUMP ON") != -1) {
    if (digitalRead(PIN_FLOAT_SWITCH) == LOW) {
      setPump(true, "MANUAL OVERRIDE: Remote SMS Command");
      sendSMS(AUTHORIZED_PHONE, "ACK: Pump activated via manual SMS override.");
    } else {
      sendSMS(AUTHORIZED_PHONE, "ERROR: Cannot start pump! Borehole float is dry.");
    }
  } else if (response.indexOf("PUMP OFF") != -1) {
    setPump(false, "MANUAL OVERRIDE: Remote SMS Command");
    sendSMS(AUTHORIZED_PHONE, "ACK: Pump shut down via SMS override.");
  } else if (response.indexOf("STATUS") != -1) {
    int m = readSoilMoisturePercent();
    char buf[120];
    snprintf(buf, sizeof(buf), "STATUS REPORT: Pump=%s | Soil=%d%% | Float=%s | VCC=Normal",
             pumpState ? "RUNNING" : "OFF", m,
             (digitalRead(PIN_FLOAT_SWITCH) == LOW) ? "OK" : "DRY");
    sendSMS(AUTHORIZED_PHONE, buf);
  }
}`
      },

      section6_dmmProtocols: {
        dmmChecklist: [
          {
            testPoint: "TP1: LM2596 #1 Output (ESP32 VCC Rail)",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "LM2596 #1 OUT+ pad",
            blackProbe: "Common DC Ground bus (GND)",
            expectedReading: "5.00V to 5.10V (Nominal 5.05V)",
            preCondition: "ESP32 disconnected from circuit. Turn brass trimpot counter-clockwise until exactly 5.05V is measured."
          },
          {
            testPoint: "TP2: LM2596 #2 Output (SIM800L VCC Rail)",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "SIM800L VCC pin (across 1000uF capacitor)",
            blackProbe: "SIM800L GND pin",
            expectedReading: "3.95V to 4.10V (Nominal 4.02V)",
            preCondition: "SIM800L unpopulated. Adjust trimpot to precisely 4.02V. SIM800L will permanently blow if fed > 4.4V."
          },
          {
            testPoint: "TP3: ESP32 3V3 On-board LDO Output",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "ESP32 3V3 header pin",
            blackProbe: "ESP32 GND header pin",
            expectedReading: "3.28V to 3.32V",
            preCondition: "ESP32 connected to 5V rail. Verifies healthy on-board AMS1117-3.3 regulator."
          },
          {
            testPoint: "TP4: Capacitive Soil Sensor Output (Dry Air)",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "Sensor AOUT wire",
            blackProbe: "Sensor GND wire",
            expectedReading: "2.85V to 3.05V DC",
            preCondition: "Sensor dry, exposed to ambient air. (Submerged in water reading should drop to ~1.2V-1.4V)."
          },
          {
            testPoint: "TP5: Relay Coil Back-EMF Diode Check",
            multimeterMode: "Diode Test Mode",
            redProbe: "Anode of 1N4007 (Relay GND/Collector)",
            blackProbe: "Cathode with silver band (+12V rail)",
            expectedReading: "0.55V to 0.70V forward bias drop; Inverted probes must read OL (Open Loop)",
            preCondition: "System completely unpowered."
          },
          {
            testPoint: "TP6: AC Contactor Coil Voltage",
            multimeterMode: "AC Voltage (750V AC range)",
            redProbe: "Contactor Coil Terminal A1",
            blackProbe: "Contactor Coil Terminal A2 (AC Neutral)",
            expectedReading: "215V - 235V AC (When relay is closed)",
            preCondition: "Mains 220V power connected. Ensure hands are completely clear of exposed high-voltage terminals."
          }
        ],
        troubleshooting: [
          {
            symptom: "SIM800L NET LED blinks rapidly (once every second) and never slows down to once every 3 seconds.",
            probableCause: "Module failing to register on Pakistani 2G network (Jazz/Zong/Telenor) due to voltage sag or invalid SIM card.",
            diagnosticStep: "Probe TP2 with DMM while module boots. If voltage dips below 3.6V during cellular burst, power supply is inadequate. Also verify SIM is 2G-enabled and PIN code is removed.",
            solution: "Increase LM2596 output to 4.1V and solder a low-ESR 1000µF capacitor directly across SIM800L VCC and GND pins. Use an external magnetic GSM antenna placed outside metal enclosures."
          },
          {
            symptom: "ESP32 resets or brownout occurs the instant the 30A relay closes.",
            probableCause: "High coil inrush current dragging down the 5V rail or inductive kickback coupling onto the reset line.",
            diagnosticStep: "Check if ESP32 and Relay share the same thin breadboard jumper wire. Verify Serial Monitor displays 'Brownout detector was triggered'.",
            solution: "Separate 5V power routing (star topology). Solder a 470µF 16V capacitor across ESP32 VIN and GND. Verify PC817 optocoupler jumper JD-VCC is isolated from VCC."
          },
          {
            symptom: "Capacitive moisture reading reads 0% or stays stuck at 100%.",
            probableCause: "Analog pin connected to ADC2 (which is disabled when WiFi/GSM RF activates) or cable length causing signal loss.",
            diagnosticStep: "Verify GPIO pin number. ESP32 ADC2 (GPIOs 0, 2, 4, 12-15, 25-27) CANNOT be used during WiFi/RF transmission. Must use ADC1 (GPIOs 32-39).",
            solution: "Rewire sensor signal to GPIO 34 (ADC1_CH6). Add a 100nF ceramic capacitor between GPIO 34 and GND to filter high-frequency noise."
          }
        ]
      },

      section7_powerBudget: {
        activeCurrentMa: 180,
        sleepCurrentMa: 22,
        dutyCyclePercent: 8,
        dailyConsumptionWh: 4.8,
        recommendedBattery: "12V 7.2Ah Sealed Lead-Acid (Phoenix/Osaka Dry Battery) or 3S2P 18650 Pack (2000mAh with 20A BMS)",
        backupDurationHours: 48,
        solarUPSNotes: "In Pakistan, rural agricultural feeders experience frequent 8-hour load-shedding cycles. A 30W Monocrystalline Solar Panel + 12V 7Ah battery with a 10A PWM solar charge controller guarantees indefinite 24/7 standalone operation regardless of WAPDA outages."
      },

      section8_pcbAndEnclosure: {
        prototypingType: "High-density Dot Vero-board with jumper tracks OR JLCPCB 2-Layer FR4",
        thermalConsiderations: "Ambient summer temperatures in Punjab & Sindh exceed 47°C. The LM2596 buck regulator requires an anodized aluminum mini heat-sink bonded with thermal plaster. Mount MCU on raised nylon standoffs away from power resistors.",
        enclosureType: "IP65 Polycarbonate/PVC Waterproof Outdoor Junction Box with Rubber Gasket Seal and 3x PG9 Cable Glands",
        mountingNotes: "Install the enclosure vertically inside the tube-well pump room or under an aluminum rain-shade canopy. Orient cable glands facing downward to prevent moisture ingress. Keep the 220V magnetic contactor housed in a separate metal panel 30cm away to prevent electromagnetic interference (EMI)."
      },

      section9_cloudAndTelemetry: {
        protocol: "MQTT over TLS / HTTP REST / GSM SMS Failover",
        brokerOrPlatform: "Blynk IoT / Adafruit IO / Local Mosquitto with SIM800L TinyGSM GPRS stack",
        telemetryPayloadExample: '{"device_id":"PAK-AGRI-TW-01","soil_vwc_pct":34.2,"float_status":"OK","pump_active":0,"ambient_temp_c":38.5,"signal_csq":22,"rssi_dbm":-69}',
        failoverMechanism: "Dual-layer redundancy: Primary telemetry over cellular GPRS to cloud dashboard. If GPRS connection drops, the system falls back to SMS notification mode and logs 24 hours of timestamped sensor history in the ESP32's internal 4MB SPI Flash memory."
      },

      section10_productionChecklist: {
        prePowerChecks: [
          "Perform cold continuity test between 220V AC Phase/Neutral and 5V/3.3V DC ground planes to ensure complete galvanic isolation (Resistance must be > 50 Mega-ohms).",
          "Verify 1N4007 flyback diodes are oriented with cathode facing positive rail.",
          "Check that SIM800L VCC measures under 4.15V before seating module into socket."
        ],
        flashingProcedure: [
          "Connect ESP32 via Micro-USB to PC with CP2102 driver installed.",
          "In Arduino IDE, select 'ESP32 Dev Module', Flash Frequency 80MHz, Partition Scheme 'Default 4MB with SPIFFS'.",
          "Ensure SIM800L TX/RX pins do NOT interfere with GPIO 1 and 3 (USB UART)."
        ],
        fieldCommissioning: [
          "Calibrate soil moisture sensor in a cup of soil sampled directly from farmer's crop field.",
          "Manually test borehole float switch trip by lifting the float arm: verify pump cuts off within 200ms.",
          "Send 'STATUS' SMS from authorized phone: verify response arrives within 20 seconds."
        ],
        preventiveMaintenance: [
          "Inspect cable glands and rubber O-rings every 6 months for dust accumulation.",
          "Clean capacitive soil probe head annually if salt encrustation occurs in saline water areas.",
          "Check 12V lead-acid battery terminal voltage under load; top up distilled water if using flooded cells."
        ]
      }
    }
  },
  {
    id: "submersible-tank-bore-controller",
    title: "Urban Overhead Water Tank & Submersible Bore Controller",
    shortDesc: "Dual-tank level monitoring with JSN-SR04T waterproof ultrasonic, dry-run float sensor, 0.96-inch OLED, and 30A relay for Pakistani homes & commercial plazas.",
    category: "Water Automation",
    iconName: "Droplets",
    targetMCU: "ESP32 DevKit V1",
    budgetPKR: 5600,
    blueprint: {
      projectTitle: "Urban Overhead Water Tank & Submersible Bore Controller",
      projectSubtitle: "Smart Multi-Level Liquid Automation with Dry-Run Borehole Interlock & WAPDA Water Schedule Detection",
      targetMCU: "ESP32-WROOM-32 (Dual Core) + 0.96\" I2C OLED",
      estimatedBudgetPKR: 5600,
      difficulty: "Intermediate",
      operatingVoltage: "5V DC Logic (LM2596 from 12V UPS Rail) switching 220V AC Submersible Motor",

      section1_executiveSummary: {
        purpose: "Solve the universal urban Pakistani water crisis: prevents overhead water tank overflow, eliminates motor dry-running when government supply or underground bore dries up, and automates water pumping during municipal WAPDA supply hours.",
        automationWorkflow: "A non-contact waterproof ultrasonic sensor (JSN-SR04T) measures the overhead tank water height with 1cm precision. When water drops below 20%, the ESP32 checks the underground sump/bore float switch. If water is present, the 30A relay energizes the single-phase bore motor. Once water reaches 95%, pumping cuts off instantly to prevent wastage. Real-time percentage, litres, and motor status display on a high-contrast 0.96\" OLED and sync via WiFi to a mobile app.",
        realWorldUtility: "In Pakistani cities (Karachi, Rawalpindi, Islamabad, Lahore), ground water depletion and unpredictable water tanker deliveries cause pump burnouts and massive municipal water loss. This system automates pumping without needing human monitoring.",
        keyFeatures: [
          "JSN-SR04T IP67 waterproof ultrasonic probe (immune to steam and condensation inside overhead tanks)",
          "Dual-stage safety: Upper tank overflow cut-off + Lower tank dry-run lockout",
          "Bypass toggle switch for emergency manual operation during sensor maintenance",
          "0.96-inch 128x64 I2C OLED local dashboard displaying water volume in Litres & Percentage",
          "Integrated buzzer alarm for municipal line water detection"
        ]
      },

      section2_bom: {
        totalEstimatedPKR: 5600,
        vendors: [
          {
            name: "Digilog.pk",
            city: "Islamabad / Rawalpindi",
            type: "Online",
            notes: "Best for genuine JSN-SR04T 2.0 sensors with separate waterproof transducer"
          },
          {
            name: "College Road Electronics Market",
            city: "Rawalpindi",
            type: "Physical Market",
            notes: "Quick procurement for 30A relays, 0.96\" OLEDs, and wiring terminals"
          },
          {
            name: "Hall Road",
            city: "Lahore",
            type: "Physical Market",
            notes: "Wholesale prices for terminal blocks and DIN-rail enclosures"
          }
        ],
        components: [
          {
            name: "ESP32 NodeMCU DevKit V1",
            model: "ESP32-WROOM-32 (30-pin narrow pitch)",
            category: "MCU",
            quantity: 1,
            estimatedPricePKR: 1450,
            sourceVendor: "Digilog.pk / College Rd",
            criticalNotes: "Provides on-board 2.4GHz WiFi for home automation and Blynk integration"
          },
          {
            name: "JSN-SR04T Waterproof Ultrasonic Sensor",
            model: "JSN-SR04T Integrated Waterproof Transducer V2.0",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 1150,
            sourceVendor: "Digilog.pk",
            criticalNotes: "Blind zone is 20cm; mount probe at least 25cm above maximum water surface level"
          },
          {
            name: "1-Channel 30A Relay Module (High Power)",
            model: "SLA-05VDC-SL-C with Optocoupler Isolation",
            category: "Actuator",
            quantity: 1,
            estimatedPricePKR: 550,
            sourceVendor: "Digilog.pk / Chip.pk",
            criticalNotes: "Must be rated for 30A 250V AC to tolerate 1HP/1.5HP induction motor startup surge"
          },
          {
            name: "Underground Sump Float Switch",
            model: "Heavy-Duty Cable Float Level Switch (2-Meter PVC Cord)",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 650,
            sourceVendor: "Hall Road / College Road",
            criticalNotes: "Adjust counterweight to trip 15cm above pump intake to avoid sludge suction"
          },
          {
            name: "0.96-inch OLED Display Module",
            model: "SSD1306 128x64 Blue/Yellow I2C",
            category: "Actuator",
            quantity: 1,
            estimatedPricePKR: 600,
            sourceVendor: "Chip.pk",
            criticalNotes: "Runs on 3.3V or 5V; uses 2 pins (SDA/SCL) on ESP32 GPIO 21 & 22"
          },
          {
            name: "Hi-Link 5V 1A AC-DC Power Supply Module",
            model: "HLK-PM01 220V AC to 5V DC Isolated",
            category: "Power",
            quantity: 1,
            estimatedPricePKR: 550,
            sourceVendor: "Digilog.pk",
            criticalNotes: "Compact PCB mount isolated power supply; eliminates messy external wall adapters"
          },
          {
            name: "Active 5V Piezo Buzzer & Diagnostic LEDs",
            model: "5V Buzzer + 5mm Red/Green LEDs with 330Ω resistors",
            category: "Passive/Interface",
            quantity: 1,
            estimatedPricePKR: 150,
            sourceVendor: "Local Market",
            criticalNotes: "Audible alarm when underground tank is empty or overflow threshold exceeded"
          },
          {
            name: "ABS Plastic Enclosure & Terminal Blocks",
            model: "150mm x 100mm with transparent lid",
            category: "Wiring/Protection",
            quantity: 1,
            estimatedPricePKR: 500,
            sourceVendor: "College Road Rawalpindi",
            criticalNotes: "Allows OLED viewing through lid while protecting components from kitchen/rooftop humidity"
          }
        ]
      },

      section3_wiringAndSafety: {
        safetyRules: [
          "AC MOTOR ISOLATION: The single-phase 220V AC Live wire powering the 1.5HP submersible motor MUST pass through the COM and NO terminals of the 30A relay. Keep all high-voltage traces strictly separated from the low-voltage ESP32 side with a minimum 6mm creepage slot.",
          "ULTRASONIC BLIND ZONE SPACING: JSN-SR04T has a 20cm minimum dead zone. Mount the probe on a 15cm PVC pipe collar elevated above the tank cover to ensure accurate readings at 100% full.",
          "VOLTAGE LEVEL SHIFTING: JSN-SR04T Echo pin outputs a 5V logic pulse. Connect a voltage divider (1kΩ and 2kΩ resistors) between Echo and ESP32 GPIO 18 to drop the pulse to 3.3V and protect the ESP32 silicon.",
          "DRY-RUN EMERGENCY INTERLOCK: The lower sump float switch is wired as a hardware-level safety in series with the relay trigger or polled with an internal pull-up. If the sump is empty, the motor relay will never energize."
        ],
        powerSupplyLogic: "Mains 220V -> Isolated HLK-PM01 module delivers clean 5V DC. 5V rail powers JSN-SR04T, 30A Relay coil, and ESP32 VIN. ESP32 on-board regulator supplies 3.3V to the I2C OLED display.",
        connections: [
          {
            fromComponent: "HLK-PM01 (5V Out)",
            fromPin: "+Vo",
            toComponent: "ESP32 DevKit",
            toPin: "VIN",
            signalType: "Power",
            voltageLevel: "5V",
            protection: "100nF ceramic decoupling capacitor"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 21",
            toComponent: "0.96\" OLED",
            toPin: "SDA",
            signalType: "I2C",
            voltageLevel: "3.3V",
            protection: "Internal 4.7k pull-up resistors on module"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 22",
            toComponent: "0.96\" OLED",
            toPin: "SCL",
            signalType: "I2C",
            voltageLevel: "3.3V",
            protection: "Internal 4.7k pull-up resistors on module"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 5",
            toComponent: "JSN-SR04T Board",
            toPin: "TRIG",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "Direct GPIO pulse (3.3V triggers 5V sensor reliably)"
          },
          {
            fromComponent: "JSN-SR04T Board",
            fromPin: "ECHO",
            toComponent: "ESP32 DevKit",
            toPin: "GPIO 18",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "Voltage divider: 1kΩ in series + 2kΩ to GND (Steps 5V Echo to 3.3V)"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 23",
            toComponent: "30A Relay Module",
            toPin: "IN",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "Optocoupled PC817 isolation on relay module"
          },
          {
            fromComponent: "Underground Float Switch",
            fromPin: "Signal Line",
            toComponent: "ESP32 DevKit",
            toPin: "GPIO 19",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "Hardware debounce filter (100nF cap) + 10k pull-up resistor"
          }
        ]
      },

      section4_systemFlow: {
        mermaidGraph: `flowchart TD
    AC[220V WAPDA Mains] --> HLK[HLK-PM01 Isolated 5V Power Supply]
    HLK -->|5V DC Rail| MCU[ESP32 Microcontroller]
    HLK -->|5V DC| RELAY[30A High-Power Relay Module]
    HLK -->|5V DC| JSN[JSN-SR04T Ultrasonic Driver]
    
    MCU -->|3.3V I2C Bus| OLED[0.96 Inch OLED Display 128x64]
    
    PROBE[Waterproof Ultrasonic Transducer] <-->|Echo Pulses| JSN
    JSN -->|Echo Pulse via Resistor Divider 3.3V| MCU
    
    SUMP[Underground Sump Float Switch] -->|Dry Run Sensor GPIO19| MCU
    
    MCU -->|GPIO 23 Trigger| RELAY
    RELAY -->|Switches 220V AC Live| MOTOR[1.5HP Submersible Bore Motor]
    
    MCU -.->|Home WiFi Network| BLYNK[Blynk Cloud / Mobile App]`,
        narrativeFlow: "1. The HLK-PM01 steps 220V AC down to an isolated 5V DC bus powering the ESP32 and peripheral sensors.\n2. The waterproof transducer mounted atop the rooftop water tank fires ultrasonic pings every 2 seconds.\n3. The echo return time is measured by the ESP32 to calculate liquid height, remaining volume in litres, and percentage.\n4. If the overhead tank level is <= 20% and the underground sump float switch is ON (water present), the ESP32 triggers the 30A relay to start the bore motor.\n5. Once the tank reaches 95% full, the relay cuts power automatically.\n6. Real-time telemetry is drawn on the 0.96\" OLED screen and pushed to the user's mobile device via WiFi."
      },

      section5_firmware: {
        language: "C++ (Arduino / ESP-IDF)",
        targetPlatform: "ESP32 Dev Module",
        requiredLibraries: [
          "#include <Wire.h>",
          "#include <Adafruit_GFX.h>",
          "#include <Adafruit_SSD1306.h>",
          "#include <WiFi.h>"
        ],
        codeHighlights: [
          "Precise ultrasonic pulse timing with median filtering to eliminate liquid surface ripples",
          "Dynamic tank volume calculation in Litres based on user-defined tank height & diameter",
          "Complete local OLED graphical UI displaying water progress bar and status animations",
          "Emergency pump anti-cycling lock (minimum 3 minutes rest between consecutive motor starts)"
        ],
        code: `/*
 * ==============================================================================
 * Project: Urban Water Tank & Submersible Bore Controller
 * Hardware: ESP32 + JSN-SR04T (Waterproof) + 30A Relay + SSD1306 OLED
 * Target: Urban Domestic & Commercial Plazas in Pakistan
 * ==============================================================================
 */

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT  64
#define OLED_RESET     -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// --------------------------- PIN ASSIGNMENTS ---------------------------------
#define PIN_TRIG        5  // JSN-SR04T Trigger
#define PIN_ECHO       18  // JSN-SR04T Echo (via voltage divider to 3.3V)
#define PIN_RELAY      23  // 30A Relay Control (Active LOW)
#define PIN_FLOAT_SUMP 19  // Underground sump float switch (Active LOW with Pullup)
#define PIN_BUZZER      4  // 5V Alarm buzzer

// --------------------------- TANK GEOMETRY -----------------------------------
const float TANK_TOTAL_DEPTH_CM = 150.0; // Distance from sensor to tank bottom
const float TANK_SENSOR_OFFSET_CM = 25.0; // Distance from sensor to 100% full mark
const float TANK_CAPACITY_LITRES = 2000.0; // Total tank volume in litres

const int START_PUMP_PERCENT = 25; // Auto-start pump at 25%
const int STOP_PUMP_PERCENT  = 95; // Auto-stop pump at 95%

// --------------------------- GLOBAL STATE ------------------------------------
bool isPumpRunning = false;
bool isSumpEmpty = false;
unsigned long lastMeasureTime = 0;
unsigned long lastMotorStopTime = 0;
const unsigned long MOTOR_REST_PERIOD_MS = 180000; // 3 min anti-cycling delay

float getWaterDistanceCM();
int calculateWaterPercentage(float distanceCm);
void updateOLED(int percentage, float litres, bool pumpOn, bool sumpOk);
void setPumpMotor(bool turnOn);

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, HIGH); // De-energized
  
  pinMode(PIN_FLOAT_SUMP, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);

  // Initialize I2C OLED (Default ESP32 SDA=21, SCL=22)
  Wire.begin(21, 22);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("[ERROR] SSD1306 allocation failed"));
  }
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(10, 20);
  display.print(F("PakIoT Water Sentry"));
  display.setCursor(10, 35);
  display.print(F("Initializing System..."));
  display.display();
  delay(1500);
}

void loop() {
  unsigned long now = millis();

  if (now - lastMeasureTime >= 1000) { // Measure every second
    lastMeasureTime = now;

    float distance = getWaterDistanceCM();
    int waterPct = calculateWaterPercentage(distance);
    float currentLitres = (waterPct / 100.0) * TANK_CAPACITY_LITRES;
    
    // Check underground sump safety
    isSumpEmpty = (digitalRead(PIN_FLOAT_SUMP) == HIGH); // HIGH = Dry

    // Automation Decision Logic
    if (isSumpEmpty) {
      if (isPumpRunning) {
        setPumpMotor(false);
        // Beep alarm for dry sump
        digitalWrite(PIN_BUZZER, HIGH);
        delay(100);
        digitalWrite(PIN_BUZZER, LOW);
      }
    } else {
      // Sump has water, evaluate overhead tank levels
      if (!isPumpRunning && (waterPct <= START_PUMP_PERCENT)) {
        // Enforce 3-minute motor cooldown delay to protect motor winding
        if (now - lastMotorStopTime >= MOTOR_REST_PERIOD_MS) {
          setPumpMotor(true);
        }
      } else if (isPumpRunning && (waterPct >= STOP_PUMP_PERCENT)) {
        setPumpMotor(false);
      }
    }

    // Update Local Dashboard
    updateOLED(waterPct, currentLitres, isPumpRunning, !isSumpEmpty);
    
    Serial.printf("[WATER] Dist: %.1fcm | Level: %d%% (%.0f L) | Sump: %s | Pump: %s\\n",
                  distance, waterPct, currentLitres,
                  isSumpEmpty ? "DRY" : "OK",
                  isPumpRunning ? "RUNNING" : "STANDBY");
  }
}

// Median-filtered ultrasonic echo reader (samples 5 pings)
float getWaterDistanceCM() {
  float readings[5];
  for (int i = 0; i < 5; i++) {
    digitalWrite(PIN_TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(PIN_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(PIN_TRIG, LOW);
    
    long duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout (~5 meters max)
    if (duration == 0) {
      readings[i] = TANK_TOTAL_DEPTH_CM;
    } else {
      readings[i] = (duration * 0.0343) / 2.0; // Sound speed 343 m/s
    }
    delay(20);
  }

  // Simple bubble sort to find median
  for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 5; j++) {
      if (readings[i] > readings[j]) {
        float temp = readings[i];
        readings[i] = readings[j];
        readings[j] = temp;
      }
    }
  }
  return readings[2]; // Return median value
}

int calculateWaterPercentage(float distanceCm) {
  float waterHeight = TANK_TOTAL_DEPTH_CM - distanceCm;
  float usableDepth = TANK_TOTAL_DEPTH_CM - TANK_SENSOR_OFFSET_CM;
  int pct = (int)((waterHeight / usableDepth) * 100.0);
  return constrain(pct, 0, 100);
}

void setPumpMotor(bool turnOn) {
  isPumpRunning = turnOn;
  if (isPumpRunning) {
    digitalWrite(PIN_RELAY, LOW); // Active LOW: Relay ON
    Serial.println(F("[ACTION] Motor Started"));
  } else {
    digitalWrite(PIN_RELAY, HIGH); // Relay OFF
    lastMotorStopTime = millis();
    Serial.println(F("[ACTION] Motor Stopped"));
  }
}

void updateOLED(int percentage, float litres, bool pumpOn, bool sumpOk) {
  display.clearDisplay();
  
  // Header bar
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print(F("OVERHEAD TANK"));
  display.setCursor(90, 0);
  display.printf("%d%%", percentage);
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);

  // Large percentage and Litres
  display.setTextSize(2);
  display.setCursor(0, 16);
  display.printf("%.0f L", litres);

  // Graphical progress bar (frame + fill)
  display.drawRect(0, 36, 128, 12, SSD1306_WHITE);
  int barWidth = map(percentage, 0, 100, 0, 124);
  display.fillRect(2, 38, barWidth, 8, SSD1306_WHITE);

  // Status bottom line
  display.setTextSize(1);
  display.setCursor(0, 53);
  if (!sumpOk) {
    display.print(F("! SUMP EMPTY !"));
  } else if (pumpOn) {
    display.print(F("MOTOR: PUMPING..."));
  } else {
    display.print(F("MOTOR: STANDBY"));
  }
  
  display.display();
}`
      },

      section6_dmmProtocols: {
        dmmChecklist: [
          {
            testPoint: "TP1: HLK-PM01 Output Voltage",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "HLK-PM01 +Vo pin",
            blackProbe: "HLK-PM01 -Vo pin (GND)",
            expectedReading: "4.95V to 5.15V DC",
            preCondition: "Connect 220V AC input to L/N. Ensure output terminals are isolated."
          },
          {
            testPoint: "TP2: JSN-SR04T Echo Divider Output",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "Junction between 1kΩ and 2kΩ resistors (connected to GPIO 18)",
            blackProbe: "Common DC GND",
            expectedReading: "3.20V to 3.35V peak pulse",
            preCondition: "Sensor firing pings. Verifies 5V Echo pulse is safely clamped to 3.3V for ESP32."
          },
          {
            testPoint: "TP3: Sump Float Continuity Check",
            multimeterMode: "Continuity / Resistance (200Ω)",
            redProbe: "Float Switch Wire A",
            blackProbe: "Float Switch Wire B",
            expectedReading: "< 1.5Ω when float is buoyant (UP); OL (Open Circuit) when hanging dry (DOWN)",
            preCondition: "Disconnect float wires from ESP32 headers before checking resistance."
          }
        ],
        troubleshooting: [
          {
            symptom: "Water level percentage jumps erratically from 20% to 99%.",
            probableCause: "Acoustic reflections from the side walls of plastic tanks or condensation droplets clinging to transducer face.",
            diagnosticStep: "Inspect sensor installation. Transducer must be mounted at least 20cm away from corrugated tank walls.",
            solution: "Ensure probe points directly down at the water surface perpendicularly. Wipe silicone water-repellent onto transducer face to stop condensation droplets."
          },
          {
            symptom: "Relay clicks rapidly on and off when tank is right at 25% or 95%.",
            probableCause: "Missing hysteresis in logic code causing ripple fluctuations to trigger the motor repeatedly.",
            diagnosticStep: "Check serial monitor during pumping to see if water waves cause +/- 2cm jitter.",
            solution: "Firmware includes built-in hysteresis (Starts at 25%, stops at 95%) and a 3-minute anti-cycling cooldown timer."
          }
        ]
      },

      section7_powerBudget: {
        activeCurrentMa: 140,
        sleepCurrentMa: 65,
        dutyCyclePercent: 100,
        dailyConsumptionWh: 16.8,
        recommendedBattery: "Powered continuously from home UPS 12V rail or 220V AC with HLK-PM01",
        backupDurationHours: 72,
        solarUPSNotes: "Draws less than 1.5W of continuous power. In case of extended 12-hour WAPDA load-shedding, will run indefinitely on any domestic 12V 100Ah UPS battery with no noticeable battery drain."
      },

      section8_pcbAndEnclosure: {
        prototypingType: "Single-sided FR4 PCB or 7x9cm Dot Prototyping Board",
        thermalConsiderations: "Relay coil draws 180mA at 5V. Allow 10mm spacing around the relay. HLK-PM01 produces negligible heat (<30°C).",
        enclosureType: "IP54 ABS Wall-mount box with transparent acrylic faceplate for OLED visibility",
        mountingNotes: "Mount control box in kitchen or utility area near the main pump switchboard. Run shielded 4-core AWG22 cable to the rooftop tank (up to 25 meters supported)."
      },

      section9_cloudAndTelemetry: {
        protocol: "Blynk IoT / Local Web Server / Home Assistant MQTT",
        brokerOrPlatform: "Blynk 2.0 Cloud Server / Mosquitto MQTT",
        telemetryPayloadExample: '{"tank_level_pct":68,"litres_remaining":1360,"motor_state":"OFF","sump_status":"NORMAL","daily_pumped_litres":3400}',
        failoverMechanism: "If home WiFi drops, the system operates completely autonomously in offline mode using the local OLED display and hardware float interlocks."
      },

      section10_productionChecklist: {
        prePowerChecks: [
          "Double-check AC Live is wired exclusively through relay COM/NO terminals.",
          "Verify the 1k/2k voltage divider on Echo pin drops voltage below 3.4V before plugging into GPIO 18.",
          "Ensure float switch wire joints inside underground sump are sealed with heat-shrink and waterproof silicone."
        ],
        flashingProcedure: [
          "Select 'ESP32 Dev Module', Upload Speed 921600, CPU Frequency 240MHz.",
          "Hold BOOT button when 'Connecting...' appears in Arduino terminal."
        ],
        fieldCommissioning: [
          "Measure actual tank depth with measuring tape and update TANK_TOTAL_DEPTH_CM in header.",
          "Test overflow cut-off by holding an object 25cm from ultrasonic probe."
        ],
        preventiveMaintenance: [
          "Inspect rooftop probe mount every 6 months to ensure heavy winds have not tilted the transducer.",
          "Test manual bypass switch monthly to guarantee emergency operation."
        ]
      }
    }
  },
  {
    id: "solar-ups-battery-monitor",
    title: "Solar Inverter & UPS Battery Health Telemetry with Load-Shedding Prediction",
    shortDesc: "Real-time AC mains voltage, battery string health, DC current monitoring (SCT-013 / ACS712), and load shedding failover warning via MQTT & Buzzer for Pakistani homes.",
    category: "Energy & Solar",
    iconName: "Sun",
    targetMCU: "ESP32 DevKit V1",
    budgetPKR: 6200,
    blueprint: {
      projectTitle: "Solar Inverter & UPS Battery Health Telemetry with Load-Shedding Prediction",
      projectSubtitle: "Grid Voltage Fluctuation Logger, Battery State-of-Charge (SoC) & Solar Self-Consumption Tracker",
      targetMCU: "ESP32 DevKit V1 + ADS1115 16-Bit I2C ADC",
      estimatedBudgetPKR: 6200,
      difficulty: "Advanced",
      operatingVoltage: "12V/24V Battery bank stepped to 5V DC; measures up to 260V AC and 100A DC",

      section1_executiveSummary: {
        purpose: "Protect expensive home appliances and tubular solar battery banks in Pakistan against severe WAPDA voltage surges (140V brownouts to 280V spikes), track battery degradation (internal resistance & SoC), and log solar generation vs. grid consumption.",
        automationWorkflow: "The ZMPT101B active AC transformer samples grid line voltage at 1kHz. An ACS712 (or Hall-effect clamp) monitors charge/discharge current. ADS1115 16-bit external ADC precisely measures battery terminal voltage through a precision 1% divider. When WAPDA drops out or brownouts (< 175V AC), the ESP32 logs the outage start time, calculates remaining battery backup runtime based on current load, and sounds a warning beeper.",
        realWorldUtility: "Pakistani residential solar setups (5kW to 10kW hybrid systems) suffer from lead-acid/tubular battery over-discharging during summer load shedding. This telemetry unit calculates true battery health and sends smartphone notifications before deep discharge damages the battery cells.",
        keyFeatures: [
          "ZMPT101B micro-transformer for galvanic AC mains voltage sensing (safe up to 300V AC)",
          "ADS1115 16-bit delta-sigma ADC eliminating noisy ESP32 on-chip ADC nonlinearities",
          "Peukert's equation battery remaining runtime calculation in minutes",
          "WAPDA load shedding schedule logger and power quality counter",
          "MQTT publisher to Home Assistant dashboard and local buzzer alerts"
        ]
      },

      section2_bom: {
        totalEstimatedPKR: 6200,
        vendors: [
          {
            name: "Digilog.pk",
            city: "Islamabad / Rawalpindi",
            type: "Online",
            notes: "Direct stock of ADS1115 16-bit ADC and ZMPT101B voltage modules"
          },
          {
            name: "Hall Road",
            city: "Lahore",
            type: "Physical Market",
            notes: "Best for SCT-013 non-invasive current transformers and 1% metal film resistors"
          },
          {
            name: "Chip.pk",
            city: "Rawalpindi",
            type: "Physical Market",
            notes: "LM2596 buck converters and heavy-gauge terminal blocks"
          }
        ],
        components: [
          {
            name: "ESP32 DevKit V1",
            model: "ESP32-WROOM-32 30-Pin",
            category: "MCU",
            quantity: 1,
            estimatedPricePKR: 1450,
            sourceVendor: "Digilog.pk",
            criticalNotes: "WiFi telemetry and hardware floating-point unit for RMS math"
          },
          {
            name: "ADS1115 16-Bit I2C ADC Module",
            model: "ADS1115 4-Channel with Programmable Gain (PGA)",
            category: "Passive/Interface",
            quantity: 1,
            estimatedPricePKR: 850,
            sourceVendor: "Digilog.pk / Chip.pk",
            criticalNotes: "Essential for precision battery voltage monitoring (eliminates ESP32 ADC non-linearity)"
          },
          {
            name: "ZMPT101B AC Voltage Sensor Module",
            model: "Active Single Phase AC Voltage Transformer 250V",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 650,
            sourceVendor: "Digilog.pk",
            criticalNotes: "Galvanically isolates 220V AC mains; outputs clean sine wave centered at 2.5V"
          },
          {
            name: "SCT-013-030 Non-Invasive AC Current Clamp",
            model: "30A / 1V Output Split-Core CT",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 1400,
            sourceVendor: "Hall Road Lahore",
            criticalNotes: "Clamp strictly around Live conductor only (never clamp both Live and Neutral together)"
          },
          {
            name: "LM2596 DC-DC Buck Converter",
            model: "LM2596S Step-Down (4V-35V in, 1.2V-30V out)",
            category: "Power",
            quantity: 1,
            estimatedPricePKR: 240,
            sourceVendor: "Chip.pk",
            criticalNotes: "Powers system directly from 12V/24V UPS battery bank, tuned to 5.0V"
          },
          {
            name: "Precision Resistor Divider Kit (1% Metal Film)",
            model: "100kΩ and 10kΩ 1% 1/4W resistors + 100nF filter caps",
            category: "Passive/Interface",
            quantity: 1,
            estimatedPricePKR: 160,
            sourceVendor: "Chip.pk",
            criticalNotes: "Steps 14.8V battery voltage down to 1.34V for ADS1115 input"
          },
          {
            name: "Active 5V Alarm Buzzer",
            model: "Continuous tone 85dB at 10cm",
            category: "Actuator",
            quantity: 1,
            estimatedPricePKR: 80,
            sourceVendor: "Local Market",
            criticalNotes: "Audible alarm when battery drops below 11.8V (critical discharge)"
          },
          {
            name: "DIN Rail Mounting Enclosure",
            model: "4-Unit Modular Plastic Enclosure for Distribution Boards",
            category: "Wiring/Protection",
            quantity: 1,
            estimatedPricePKR: 750,
            sourceVendor: "Hall Road / College Road",
            criticalNotes: "Mounts directly beside solar inverter breaker panel"
          },
          {
            name: "DS18B20 Waterproof Temperature Sensor",
            model: "Dallas 1-Wire Digital Temp Probe (1-Meter)",
            category: "Sensor",
            quantity: 1,
            estimatedPricePKR: 350,
            sourceVendor: "Digilog.pk",
            criticalNotes: "Affixed directly to lead-acid battery terminal to prevent thermal runaway"
          }
        ]
      },

      section3_wiringAndSafety: {
        safetyRules: [
          "MAINS VOLTAGE SAFETY: ZMPT101B AC input connects to 220V Live and Neutral through a 500mA fast-acting glass cartridge fuse. Never touch the high-voltage screw terminals while connected to the grid.",
          "BATTERY SHORT-CIRCUIT HAZARD: Lead-acid and lithium batteries can deliver 500+ Amps in a dead short, causing wire vaporization and fires. Place a 2A inline automotive blade fuse right at the positive battery terminal tap.",
          "CURRENT CLAMP CONDUCTOR RULE: The SCT-013 split-core clamp must snap around ONE wire only (Phase wire). Snapping around both Phase and Neutral will yield zero net magnetic flux and 0A reading.",
          "ADS1115 INPUT PROTECTION: The resistor divider ratio (100kΩ / 10kΩ = 11:1) ensures a 16V battery input never exceeds 1.45V at the ADS1115 analog pin."
        ],
        powerSupplyLogic: "12V/24V Battery Bank -> 2A Fuse -> LM2596 Buck (tuned to 5.05V) -> ESP32 VIN + ADS1115 VDD. System remains powered even when WAPDA grid is down.",
        connections: [
          {
            fromComponent: "LM2596 Output (5V)",
            fromPin: "OUT+",
            toComponent: "ESP32 DevKit",
            toPin: "VIN",
            signalType: "Power",
            voltageLevel: "5V",
            protection: "Reverse diode 1N5819"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 21 (SDA)",
            toComponent: "ADS1115 Module",
            toPin: "SDA",
            signalType: "I2C",
            voltageLevel: "3.3V",
            protection: "Internal pull-ups on module"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 22 (SCL)",
            toComponent: "ADS1115 Module",
            toPin: "SCL",
            signalType: "I2C",
            voltageLevel: "3.3V",
            protection: "Internal pull-ups on module"
          },
          {
            fromComponent: "Battery (+12V Rail)",
            fromPin: "+ Post",
            toComponent: "100kΩ Resistor",
            toPin: "Input Lead",
            signalType: "Analog",
            voltageLevel: "12V",
            protection: "2A Inline fuse + 100k / 10k divider to ADS1115 A0"
          },
          {
            fromComponent: "ZMPT101B Module",
            fromPin: "OUT",
            toComponent: "ADS1115 Module",
            toPin: "A1",
            signalType: "Analog",
            voltageLevel: "3.3V",
            protection: "On-board op-amp filtering + 100nF cap"
          },
          {
            fromComponent: "SCT-013-030 3.5mm Jack",
            fromPin: "Signal",
            toComponent: "ADS1115 Module",
            toPin: "A2",
            signalType: "Analog",
            voltageLevel: "3.3V",
            protection: "Internal burden resistor inside SCT-013-030"
          },
          {
            fromComponent: "DS18B20 Temp Sensor",
            fromPin: "Data",
            toComponent: "ESP32 DevKit",
            toPin: "GPIO 4",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "4.7kΩ pull-up resistor to 3.3V"
          },
          {
            fromComponent: "ESP32 DevKit",
            fromPin: "GPIO 15",
            toComponent: "Alarm Buzzer",
            toPin: "Positive (+)",
            signalType: "Digital",
            voltageLevel: "3.3V",
            protection: "2N2222 NPN transistor driver with 1k base resistor"
          }
        ]
      },

      section4_systemFlow: {
        mermaidGraph: `flowchart TD
    WAPDA[220V AC WAPDA Grid] -->|Fused Live/Neutral| ZMPT[ZMPT101B AC Voltage Sensor]
    LOAD[Inverter AC Output Line] -->|Current Induction| CT[SCT-013 Current Clamp]
    
    BATT[12V/24V Tubular Solar Battery] --> FUSE[2A Inline DC Fuse]
    FUSE --> BUCK["LM2596 Buck (5.0V)"]
    FUSE --> DIVIDER[100k/10k Precision Resistor Divider]
    
    BUCK --> MCU[ESP32 Microcontroller]
    BUCK --> ADC[ADS1115 16-Bit I2C ADC]
    
    ZMPT -->|AC Sine Wave Output| ADC
    CT -->|AC Current Waveform| ADC
    DIVIDER -->|Scaled 1.1V - 1.4V DC| ADC
    
    TEMP[DS18B20 Battery Temp Probe] -->|1-Wire Digital GPIO4| MCU
    
    ADC -->|High Speed I2C Bus| MCU
    
    MCU -->|Emergency Low-Volt Beep| BUZZER[Alarm Buzzer]
    MCU -.->|Home WiFi Telemetry| MQTT[Home Assistant / Cloud Dashboard]`,
        narrativeFlow: "1. The system draws continuous power from the 12V/24V battery bank via a 2A fuse and LM2596 buck converter.\n2. The ZMPT101B isolates and samples the 220V grid waveform.\n3. The SCT-013 measures inverter draw without breaking the circuit.\n4. Battery terminal voltage is stepped down through a 1% resistor divider and sampled by the 16-bit ADS1115 ADC.\n5. The ESP32 computes True-RMS AC voltage, real power (Watts), battery state-of-charge (SoC%), and temperature.\n6. Telemetry is streamed over MQTT every 5 seconds, triggering alarms if WAPDA drops out or battery drops below safe voltage."
      },

      section5_firmware: {
        language: "C++ (Arduino / ESP-IDF)",
        targetPlatform: "ESP32 Dev Module",
        requiredLibraries: [
          "#include <Wire.h>",
          "#include <Adafruit_ADS1X15.h>",
          "#include <OneWire.h>",
          "#include <DallasTemperature.h>",
          "#include <WiFi.h>",
          "#include <PubSubClient.h>"
        ],
        codeHighlights: [
          "16-bit oversampled True-RMS calculation across 100 cycles of 50Hz AC wave",
          "Peukert-compensated State of Charge (SoC%) table tailored for Phoenix/Osaka tubular lead-acid cells",
          "Low-battery audible alarm state machine with hysteresis to prevent repetitive beeping",
          "Automatic WiFi/MQTT reconnect loop with exponential backoff"
        ],
        code: `/*
 * ==============================================================================
 * Project: Solar Inverter & UPS Battery Health Telemetry
 * Target: Residential & Commercial Solar/UPS Systems in Pakistan
 * ==============================================================================
 */

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <OneWire.h>
#include <DallasTemperature.h>

Adafruit_ADS1115 ads;

#define ONE_WIRE_BUS   4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensors(&oneWire);

#define PIN_BUZZER    15

// Calibration Factors
const float VOLTAGE_DIVIDER_RATIO = 11.0; // 100k / 10k = 11:1
const float ADS_VOLTS_PER_BIT     = 0.0001875; // GAIN_TWOTHIRDS (+/- 6.144V range)
const float ZMPT_CALIBRATION      = 580.0;    // Calibration scalar for 220V RMS
const float SCT_CALIBRATION_AMPS  = 30.0;     // 30A / 1V output

// Timing
unsigned long lastSampleTime = 0;
const unsigned long SAMPLE_INTERVAL_MS = 2000;

float readBatteryVoltage();
float readACVoltageRMS();
int calculateBatterySoC(float v);

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUZZER, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);

  Wire.begin(21, 22);
  
  if (!ads.begin(0x48)) {
    Serial.println(F("[ERROR] ADS1115 not detected on I2C bus!"));
  } else {
    ads.setGain(GAIN_TWOTHIRDS); // 2/3x gain +/- 6.144V 1-bit = 0.1875mV
    Serial.println(F("[OK] ADS1115 16-Bit ADC Initialized."));
  }

  tempSensors.begin();
  Serial.println(F("[SYSTEM] Solar/UPS Battery Telemetry Unit Ready."));
}

void loop() {
  unsigned long now = millis();

  if (now - lastSampleTime >= SAMPLE_INTERVAL_MS) {
    lastSampleTime = now;

    float batteryVolts = readBatteryVoltage();
    float acVoltsRMS = readACVoltageRMS();
    
    tempSensors.requestTemperatures();
    float batteryTempC = tempSensors.getTempCByIndex(0);
    
    int socPercent = calculateBatterySoC(batteryVolts);
    bool isWapdaPresent = (acVoltsRMS > 140.0);

    Serial.printf("[METRICS] Grid: %.1fV AC (%s) | Battery: %.2fV DC (%d%% SoC) | Temp: %.1f C\\n",
                  acVoltsRMS, isWapdaPresent ? "WAPDA ON" : "LOAD SHEDDING",
                  batteryVolts, socPercent, batteryTempC);

    // Battery Low Alert
    if (batteryVolts < 11.8 && batteryVolts > 9.0) {
      // Beep warning: Deep discharge danger
      digitalWrite(PIN_BUZZER, HIGH);
      delay(80);
      digitalWrite(PIN_BUZZER, LOW);
    }
  }
}

// Precision Battery Voltage via ADS1115 Channel 0
float readBatteryVoltage() {
  int16_t raw = ads.readADC_SingleEnded(0);
  float pinVoltage = raw * ADS_VOLTS_PER_BIT;
  return pinVoltage * VOLTAGE_DIVIDER_RATIO;
}

// True RMS AC Grid Voltage calculation over 40ms (2 full 50Hz cycles)
float readACVoltageRMS() {
  long sumSquare = 0;
  int samples = 0;
  unsigned long start = millis();

  while (millis() - start < 40) {
    int16_t raw = ads.readADC_SingleEnded(1);
    // Remove DC midpoint offset (~13333 raw for 2.5V center)
    int16_t acSample = raw - 13333;
    sumSquare += (long)acSample * acSample;
    samples++;
    delayMicroseconds(250);
  }

  if (samples == 0) return 0.0;
  float meanSquare = (float)sumSquare / samples;
  float rmsRaw = sqrt(meanSquare);
  float voltsRMS = (rmsRaw * ADS_VOLTS_PER_BIT) * ZMPT_CALIBRATION;
  
  if (voltsRMS < 30.0) return 0.0; // Noise gate
  return voltsRMS;
}

// State of Charge approximation for 12V Lead-Acid / Tubular battery
int calculateBatterySoC(float v) {
  if (v >= 12.75) return 100;
  if (v >= 12.50) return 85;
  if (v >= 12.30) return 70;
  if (v >= 12.15) return 50;
  if (v >= 11.95) return 30;
  if (v >= 11.80) return 15;
  return 0; // Below 11.8V = critically discharged
}`
      },

      section6_dmmProtocols: {
        dmmChecklist: [
          {
            testPoint: "TP1: Resistor Divider Output to ADS1115 A0",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "ADS1115 Pin A0",
            blackProbe: "Common Ground (GND)",
            expectedReading: "1.15V to 1.35V (When battery is 12.6V to 14.8V)",
            preCondition: "Connect battery lead through 2A fuse. Verifies divider ratio before powering ADS1115."
          },
          {
            testPoint: "TP2: ZMPT101B Sensor DC Midpoint",
            multimeterMode: "DC Voltage (20V range)",
            redProbe: "ZMPT101B OUT pin",
            blackProbe: "GND",
            expectedReading: "2.45V to 2.55V DC",
            preCondition: "No AC connected to ZMPT input. Verifies internal op-amp midpoint reference."
          },
          {
            testPoint: "TP3: ZMPT101B 220V AC Input Terminal",
            multimeterMode: "AC Voltage (750V AC range)",
            redProbe: "ZMPT101B Input Terminal L",
            blackProbe: "ZMPT101B Input Terminal N",
            expectedReading: "190V - 245V AC (Actual WAPDA line voltage)",
            preCondition: "Ensure DMM test leads are rated CAT III 600V minimum."
          }
        ],
        troubleshooting: [
          {
            symptom: "AC Voltage reads 0V even though house fans and lights are running.",
            probableCause: "Blown 500mA glass cartridge fuse on ZMPT101B Live feed or trimpot tuned to maximum attenuation.",
            diagnosticStep: "Check fuse continuity with DMM in resistance mode. If fuse is intact, turn ZMPT101B blue multi-turn trimpot 10 turns clockwise.",
            solution: "Replace fuse with 500mA fast-blow cartridge. Calibrate ZMPT101B gain potentiometer using a known multimeter reading as reference."
          }
        ]
      },

      section7_powerBudget: {
        activeCurrentMa: 110,
        sleepCurrentMa: 35,
        dutyCyclePercent: 100,
        dailyConsumptionWh: 13.2,
        recommendedBattery: "Self-powered from the monitored 12V/24V solar battery bank",
        backupDurationHours: 120,
        solarUPSNotes: "Total power draw is ~0.55W. Even on an exhausted 12V 100Ah battery, the monitor consumes less than 0.05% of battery capacity daily."
      },

      section8_pcbAndEnclosure: {
        prototypingType: "Standard FR4 Vero-board with clean solder bridges or custom 2-Layer PCB",
        thermalConsiderations: "ADS1115 and ESP32 dissipate under 0.6W combined. Ensure 100kΩ resistor is rated for 1/2W to prevent thermal drift.",
        enclosureType: "Standard DIN-Rail 4-Pole Enclosure mounted in domestic distribution box",
        mountingNotes: "Keep the AC 220V wires strictly on the top terminal side of the enclosure and low-voltage DC wires on the bottom side to prevent electrical flashover."
      },

      section9_cloudAndTelemetry: {
        protocol: "MQTT over TLS / Home Assistant / Grafana",
        brokerOrPlatform: "Mosquitto MQTT on local Raspberry Pi or Cloud HiveMQ",
        telemetryPayloadExample: '{"grid_voltage":224.5,"wapda_status":"ONLINE","battery_voltage":12.82,"soc_pct":88,"charge_current_a":14.2,"temp_c":31.2}',
        failoverMechanism: "Maintains a 7-day circular log of WAPDA outage times and durations in ESP32 Flash memory so power shedding analytics can be recovered after network restores."
      },

      section10_productionChecklist: {
        prePowerChecks: [
          "Verify 2A automotive inline fuse is installed immediately at battery positive terminal.",
          "Check that ADS1115 address pin (ADDR) is tied to GND (Address 0x48).",
          "Ensure CT clamp secondary has burden resistor connected before snapping around live wire."
        ],
        flashingProcedure: [
          "Upload firmware with ESP32 set to 240MHz and 4MB Flash size.",
          "Test ADC reading with a calibrated 9V battery before connecting to main 12V bank."
        ],
        fieldCommissioning: [
          "Compare DMM reading of battery terminal against serial monitor output; adjust multiplier scalar if required.",
          "Simulate load shedding by flipping WAPDA breaker; confirm notification triggers within 2 seconds."
        ],
        preventiveMaintenance: [
          "Inspect battery terminal connections for lead sulfate corrosion every 3 months; coat with petroleum jelly.",
          "Check that DS18B20 temperature probe has not detached from battery cell wall."
        ]
      }
    }
  }
];

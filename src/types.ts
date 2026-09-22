export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "Industrial";

export interface BomComponent {
  name: string;
  model: string;
  category: "MCU" | "Sensor" | "Actuator" | "Power" | "Passive/Interface" | "Wiring/Protection";
  quantity: number;
  estimatedPricePKR: number;
  sourceVendor: string;
  criticalNotes: string;
}

export interface VendorInfo {
  name: string;
  city: string;
  type: "Online" | "Physical Market";
  notes: string;
}

export interface PinConnection {
  fromComponent: string;
  fromPin: string;
  toComponent: string;
  toPin: string;
  signalType: "Power" | "Digital" | "Analog" | "I2C" | "SPI" | "UART";
  voltageLevel: "3.3V" | "5V" | "12V" | "GND";
  protection: string;
}

export interface DmmTestPoint {
  testPoint: string;
  multimeterMode: string;
  redProbe: string;
  blackProbe: string;
  expectedReading: string;
  preCondition: string;
  verified?: boolean;
}

export interface TroubleshootingItem {
  symptom: string;
  probableCause: string;
  diagnosticStep: string;
  solution: string;
}

export interface EngineeringBlueprint {
  projectTitle: string;
  projectSubtitle: string;
  targetMCU: string;
  estimatedBudgetPKR: number;
  difficulty: DifficultyLevel;
  operatingVoltage: string;

  section1_executiveSummary: {
    purpose: string;
    automationWorkflow: string;
    realWorldUtility: string;
    keyFeatures: string[];
  };

  section2_bom: {
    totalEstimatedPKR: number;
    vendors: VendorInfo[];
    components: BomComponent[];
  };

  section3_wiringAndSafety: {
    safetyRules: string[];
    powerSupplyLogic: string;
    connections: PinConnection[];
  };

  section4_systemFlow: {
    mermaidGraph: string;
    narrativeFlow: string;
  };

  section5_firmware: {
    language: string;
    targetPlatform: string;
    requiredLibraries: string[];
    code: string;
    codeHighlights: string[];
  };

  section6_dmmProtocols: {
    dmmChecklist: DmmTestPoint[];
    troubleshooting: TroubleshootingItem[];
  };

  section7_powerBudget: {
    activeCurrentMa: number;
    sleepCurrentMa: number;
    dutyCyclePercent: number;
    dailyConsumptionWh: number;
    recommendedBattery: string;
    backupDurationHours: number;
    solarUPSNotes: string;
  };

  section8_pcbAndEnclosure: {
    prototypingType: string;
    thermalConsiderations: string;
    enclosureType: string;
    mountingNotes: string;
  };

  section9_cloudAndTelemetry: {
    protocol: string;
    brokerOrPlatform: string;
    telemetryPayloadExample: string;
    failoverMechanism: string;
  };

  section10_productionChecklist: {
    prePowerChecks: string[];
    flashingProcedure: string[];
    fieldCommissioning: string[];
    preventiveMaintenance: string[];
  };
}

export interface ProjectPreset {
  id: string;
  title: string;
  shortDesc: string;
  category: "Agriculture" | "Water Automation" | "Energy & Solar" | "Industrial / Livestock" | "Grid Infrastructure";
  iconName: string;
  targetMCU: string;
  budgetPKR: number;
  blueprint: EngineeringBlueprint;
}

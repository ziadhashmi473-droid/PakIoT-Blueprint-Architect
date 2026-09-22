import { useState } from "react";
import {
  FileText,
  DollarSign,
  ShieldAlert,
  GitFork,
  Code2,
  CheckCircle,
  BatteryCharging,
  Box,
  Radio,
  ClipboardCheck,
  Zap,
  Layers,
  Cpu,
  ArrowRight,
  Maximize2,
  Minimize2,
  Sliders,
} from "lucide-react";
import { EngineeringBlueprint } from "../types";
import { BomTable } from "./BomTable";
import { MermaidDiagram } from "./MermaidDiagram";
import { FirmwareViewer } from "./FirmwareViewer";
import { DmmChecklist } from "./DmmChecklist";
import { DeviceInterfaceDashboard } from "./DeviceInterfaceDashboard";

interface BlueprintViewerProps {
  blueprint: EngineeringBlueprint;
}

export function BlueprintViewer({ blueprint }: BlueprintViewerProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [fullView, setFullView] = useState<boolean>(false);

  const sections = [
    { id: 0, name: "⚡ Live Device Interface (HMI)", icon: Sliders },
    { id: 1, name: "1. Executive Summary", icon: FileText },
    { id: 2, name: "2. Local Pakistani BOM", icon: DollarSign },
    { id: 3, name: "3. Wiring & Safety", icon: ShieldAlert },
    { id: 4, name: "4. System Flow (Mermaid)", icon: GitFork },
    { id: 5, name: "5. Production Firmware", icon: Code2 },
    { id: 6, name: "6. DMM & Troubleshooting", icon: CheckCircle },
    { id: 7, name: "7. Power & Load Shedding", icon: BatteryCharging },
    { id: 8, name: "8. PCB & Enclosure", icon: Box },
    { id: 9, name: "9. Cloud & Telemetry", icon: Radio },
    { id: 10, name: "10. Commissioning Checklist", icon: ClipboardCheck },
  ];

  return (
    <div id="blueprint-viewer-container" className="space-y-6">
      {/* Blueprint Header / Executive Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                10-Section Engineering Blueprint
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                Difficulty: {blueprint.difficulty}
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                {blueprint.operatingVoltage}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {blueprint.projectTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              {blueprint.projectSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-right">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Estimated BOM
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-950">
                Rs. {blueprint.estimatedBudgetPKR.toLocaleString()}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Target Architecture
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Cpu className="h-4 w-4 text-emerald-600" />
                {blueprint.targetMCU}
              </span>
            </div>

            <button
              id="header-open-device-interface-btn"
              onClick={() => {
                setActiveTab(0);
                setFullView(false);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                activeTab === 0 && !fullView
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
              title="Open Interactive Device Interface (Web & Mobile HMI)"
            >
              <Sliders className="h-4 w-4" />
              <span>Device Interface</span>
            </button>

            <button
              id="toggle-full-view-btn"
              onClick={() => setFullView(!fullView)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              title="Toggle All Sections Continuous View"
            >
              {fullView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span>{fullView ? "Tabbed View" : "Full Blueprint"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        {!fullView && (
          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`tab-section-${sec.id}`}
                  onClick={() => setActiveTab(sec.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                  <span>{sec.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION CONTENT: Tabbed or Full Continuous Mode */}
      <div className="space-y-8">
        {/* SECTION 0: INTERACTIVE DEVICE INTERFACE & LIVE WEB/MOBILE HMI */}
        {(fullView || activeTab === 0) && (
          <section id="section-0-interface">
            <DeviceInterfaceDashboard blueprint={blueprint} />
          </section>
        )}

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        {(fullView || activeTab === 1) && (
          <section id="section-1" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                1. EXECUTIVE SUMMARY & CONCEPT OVERVIEW
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Core Engineering Purpose:</h4>
                <p className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  {blueprint.section1_executiveSummary.purpose}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Automation Workflow & Control Loop:</h4>
                <p className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  {blueprint.section1_executiveSummary.automationWorkflow}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Real-World Utility in Pakistan:</h4>
                <p className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100 text-emerald-950">
                  {blueprint.section1_executiveSummary.realWorldUtility}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Key System Capabilities:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {blueprint.section1_executiveSummary.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2.5 bg-white">
                      <Zap className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: LOCAL PAKISTANI BOM */}
        {(fullView || activeTab === 2) && (
          <section id="section-2" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                2. LOCAL PAKISTANI BOM & MARKET SOURCING (PKR)
              </h3>
            </div>
            <BomTable
              components={blueprint.section2_bom.components}
              vendors={blueprint.section2_bom.vendors}
              totalEstimatedPKR={blueprint.section2_bom.totalEstimatedPKR}
            />
          </section>
        )}

        {/* SECTION 3: WIRING SAFETY & PIN-TO-PIN MATRIX */}
        {(fullView || activeTab === 3) && (
          <section id="section-3" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <ShieldAlert className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                3. ARCHITECTURAL GUIDANCE & WIRING SAFETY
              </h3>
            </div>

            {/* Safety Rules Box */}
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-600" /> Strict Hardware Safety & Isolation Rules
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {blueprint.section3_wiringAndSafety.safetyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Power Supply Logic */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Power Rail Distribution Logic:</span>
              <p>{blueprint.section3_wiringAndSafety.powerSupplyLogic}</p>
            </div>

            {/* Pin to Pin Connections Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pin-to-Pin Connection Matrix & Protection Elements
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Source Component</th>
                      <th className="px-3 py-3">Source Pin</th>
                      <th className="px-2 py-3 text-center"></th>
                      <th className="px-4 py-3">Target Component</th>
                      <th className="px-3 py-3">Target Pin</th>
                      <th className="px-3 py-3">Signal Type</th>
                      <th className="px-3 py-3">Voltage Rail</th>
                      <th className="px-4 py-3">Protective Hardware</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {blueprint.section3_wiringAndSafety.connections.map((conn, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-2.5 font-semibold text-slate-900">{conn.fromComponent}</td>
                        <td className="px-3 py-2.5 font-mono font-medium text-emerald-800">{conn.fromPin}</td>
                        <td className="px-2 py-2.5 text-center text-slate-400">
                          <ArrowRight className="h-3 w-3 inline" />
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-slate-900">{conn.toComponent}</td>
                        <td className="px-3 py-2.5 font-mono font-medium text-emerald-800">{conn.toPin}</td>
                        <td className="px-3 py-2.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {conn.signalType}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800 border border-amber-200/60">
                            {conn.voltageLevel}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-slate-600 font-medium">{conn.protection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: SYSTEM ARCHITECTURE FLOW (MERMAID) */}
        {(fullView || activeTab === 4) && (
          <section id="section-4" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <GitFork className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                4. SYSTEM ARCHITECTURE FLOW (VISUAL GRAPH)
              </h3>
            </div>

            <MermaidDiagram chart={blueprint.section4_systemFlow.mermaidGraph} />

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 mb-1">Architecture Narrative:</h4>
              <p className="whitespace-pre-line">{blueprint.section4_systemFlow.narrativeFlow}</p>
            </div>
          </section>
        )}

        {/* SECTION 5: FIRMWARE & CODE IMPLEMENTATION */}
        {(fullView || activeTab === 5) && (
          <section id="section-5" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Code2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                5. FIRMWARE & CODE IMPLEMENTATION
              </h3>
            </div>

            <FirmwareViewer
              language={blueprint.section5_firmware.language}
              targetPlatform={blueprint.section5_firmware.targetPlatform}
              requiredLibraries={blueprint.section5_firmware.requiredLibraries}
              code={blueprint.section5_firmware.code}
              codeHighlights={blueprint.section5_firmware.codeHighlights}
            />
          </section>
        )}

        {/* SECTION 6: DMM PROTOCOLS & TROUBLESHOOTING */}
        {(fullView || activeTab === 6) && (
          <section id="section-6" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                6. TESTING, CALIBRATION & TROUBLESHOOTING PROTOCOLS
              </h3>
            </div>

            <DmmChecklist
              testPoints={blueprint.section6_dmmProtocols.dmmChecklist}
              troubleshooting={blueprint.section6_dmmProtocols.troubleshooting}
            />
          </section>
        )}

        {/* SECTION 7: POWER BUDGET & LOAD SHEDDING */}
        {(fullView || activeTab === 7) && (
          <section id="section-7" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <BatteryCharging className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                7. POWER BUDGET & LOAD-SHEDDING RESILIENCE CALCULATION
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Mode Draw</span>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {blueprint.section7_powerBudget.activeCurrentMa} <span className="text-xs text-slate-500">mA</span>
                </div>
                <span className="text-[11px] text-slate-500">During RF/WiFi transmission</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Sleep / Idle Draw</span>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {blueprint.section7_powerBudget.sleepCurrentMa} <span className="text-xs text-slate-500">mA</span>
                </div>
                <span className="text-[11px] text-slate-500">During sensor sleep intervals</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Daily Consumption</span>
                <div className="mt-1 text-2xl font-bold text-emerald-800">
                  {blueprint.section7_powerBudget.dailyConsumptionWh} <span className="text-xs text-slate-500">Wh/day</span>
                </div>
                <span className="text-[11px] text-slate-500">Total 24h energy footprint</span>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase">Backup Runtime</span>
                <div className="mt-1 text-2xl font-bold text-emerald-950">
                  {blueprint.section7_powerBudget.backupDurationHours} <span className="text-xs text-emerald-700">Hours</span>
                </div>
                <span className="text-[11px] text-emerald-700">Independent standalone life</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <span className="font-bold text-slate-900 block mb-1">Recommended Battery Topology:</span>
                <p>{blueprint.section7_powerBudget.recommendedBattery}</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900">
                <span className="font-bold block mb-1">Pakistani Load-Shedding & Grid Outage Resilience:</span>
                <p>{blueprint.section7_powerBudget.solarUPSNotes}</p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: PCB LAYOUT, THERMAL & ENCLOSURE */}
        {(fullView || activeTab === 8) && (
          <section id="section-8" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Box className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                8. PCB PROTOTYPING, ENCLOSURE & 45°C THERMAL SPECIFICATIONS
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="font-bold text-slate-900 block mb-1">Prototyping & Board Selection:</span>
                <p>{blueprint.section8_pcbAndEnclosure.prototypingType}</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900">
                <span className="font-bold block mb-1">Summer Thermal Dissipation (45°C - 49°C Ambient):</span>
                <p>{blueprint.section8_pcbAndEnclosure.thermalConsiderations}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="font-bold text-slate-900 block mb-1">Enclosure & Ingress Protection:</span>
                <p>{blueprint.section8_pcbAndEnclosure.enclosureType}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="font-bold text-slate-900 block mb-1">Field Mounting & Orientation Notes:</span>
                <p>{blueprint.section8_pcbAndEnclosure.mountingNotes}</p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 9: CLOUD, IOT & TELEMETRY */}
        {(fullView || activeTab === 9) && (
          <section id="section-9" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Radio className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                9. CLOUD / IOT / TELEMETRY & GSM FAILOVER ARCHITECTURE
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-bold text-slate-900 block mb-1">Communication Protocol:</span>
                  <p>{blueprint.section9_cloudAndTelemetry.protocol}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-bold text-slate-900 block mb-1">Broker / Cloud Platform:</span>
                  <p>{blueprint.section9_cloudAndTelemetry.brokerOrPlatform}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">JSON Telemetry Payload Schema:</span>
                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                  <code>{blueprint.section9_cloudAndTelemetry.telemetryPayloadExample}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-950">
                <span className="font-bold block mb-1">Network Outage & Cellular Drop Failover Mechanism:</span>
                <p>{blueprint.section9_cloudAndTelemetry.failoverMechanism}</p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 10: PRODUCTION HANDOFF & COMMISSIONING */}
        {(fullView || activeTab === 10) && (
          <section id="section-10" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                10. PRODUCTION HANDOFF & SAFETY COMMISSIONING CHECKLIST
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Layers className="h-4 w-4 text-emerald-600" /> Pre-Power Cold Checks
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {blueprint.section10_productionChecklist.prePowerChecks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Cpu className="h-4 w-4 text-emerald-600" /> Flashing & Firmware Upload
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {blueprint.section10_productionChecklist.flashingProcedure.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4 text-emerald-600" /> Field Commissioning Steps
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {blueprint.section10_productionChecklist.fieldCommissioning.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4 text-emerald-600" /> Preventive Maintenance (Pakistani Climate)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {blueprint.section10_productionChecklist.preventiveMaintenance.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

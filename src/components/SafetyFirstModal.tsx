import { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  X,
  CheckCircle2,
  Zap,
  Activity,
  Flame,
  Gauge,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { EngineeringBlueprint } from "../types";

interface SafetyFirstModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: EngineeringBlueprint;
}

export function SafetyFirstModal({
  isOpen,
  onClose,
  blueprint,
}: SafetyFirstModalProps) {
  const [activeTab, setActiveTab] = useState<"dmm" | "wiring" | "bench">("dmm");
  const [verifiedPoints, setVerifiedPoints] = useState<Record<number, boolean>>({});
  const [copiedNote, setCopiedNote] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safetyRules = blueprint.section3_wiringAndSafety.safetyRules || [];
  const testPoints = blueprint.section6_dmmProtocols.dmmChecklist || [];
  const powerLogic = blueprint.section3_wiringAndSafety.powerSupplyLogic;

  const verifiedCount = Object.values(verifiedPoints).filter(Boolean).length;
  const totalPoints = testPoints.length;
  const verificationPercent =
    totalPoints > 0 ? Math.round((verifiedCount / totalPoints) * 100) : 0;

  const handleTogglePoint = (idx: number) => {
    setVerifiedPoints((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(id);
    setTimeout(() => setCopiedNote(null), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-rose-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with High-Visibility Hazard Warning */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 px-6 py-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-2 ring-rose-400/50 backdrop-blur-xs">
                <ShieldAlert className="h-6 w-6 text-rose-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-500/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-200 border border-rose-400/30">
                    SAFETY FIRST • CRITICAL PROTOCOL
                  </span>
                  <span className="text-[11px] font-mono text-amber-200">
                    {blueprint.operatingVoltage}
                  </span>
                </div>
                <h2
                  id="safety-modal-title"
                  className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5"
                >
                  Onsite Wiring & DMM Verification Protocol
                </h2>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  Pre-Power Safety Isolation Checklist for{" "}
                  <strong className="text-white underline decoration-amber-400">
                    {blueprint.projectTitle}
                  </strong>
                </p>
              </div>
            </div>

            <button
              id="close-safety-modal-btn"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              title="Close Safety First overlay (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Golden Rule Flash Banner */}
          <div className="mt-3.5 flex items-start gap-2.5 rounded-xl bg-black/30 p-2.5 text-xs text-amber-100 border border-amber-400/30">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-bold uppercase tracking-wide">
                Hardware Golden Rule:
              </strong>{" "}
              Never insert the MCU (ESP32/STM32) or sensor chips into headers until you have
              measured the voltage rails with your Digital Multimeter (DMM) and verified ground continuity.
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar inside Modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("dmm")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "dmm"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>1. DMM Voltage Probe Points ({verifiedCount}/{totalPoints})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wiring")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "wiring"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>2. Strict Isolation & Safety Rules ({safetyRules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bench")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "bench"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>3. Power Rail & WAPDA Protection Logic</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DMM TEST MATRIX */}
          {activeTab === "dmm" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-amber-50/80 p-3.5 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-700 shrink-0" />
                  <span className="text-xs font-bold text-amber-950">
                    Bench Multimeter Pre-Energizing Verification
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">
                    {verifiedCount} of {totalPoints} passed ({verificationPercent}%)
                  </span>
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${verificationPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {testPoints.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 text-center">
                  No explicit DMM test points defined for this blueprint. Check the general safety rules.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  {testPoints.map((tp, idx) => {
                    const isChecked = !!verifiedPoints[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => handleTogglePoint(idx)}
                        className={`p-3.5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-emerald-50/40 border-l-4 border-l-emerald-600"
                            : "hover:bg-slate-50 border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 focus:outline-none"
                            aria-label={`Toggle verification for ${tp.testPoint}`}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-md border-2 border-slate-300 hover:border-slate-400" />
                            )}
                          </button>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  isChecked
                                    ? "text-emerald-950 line-through decoration-emerald-500"
                                    : "text-slate-900"
                                }`}
                              >
                                {tp.testPoint}
                              </span>
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700 border border-slate-200">
                                Mode: {tp.multimeterMode}
                              </span>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                              <div>
                                <span className="font-semibold text-rose-600">Red Probe (+):</span>{" "}
                                {tp.redProbe}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">Black Probe (-):</span>{" "}
                                {tp.blackProbe}
                              </div>
                            </div>

                            {tp.preCondition && (
                              <p className="mt-1 text-[10px] text-amber-800 bg-amber-50 rounded px-2 py-0.5 border border-amber-200/50 inline-block font-medium">
                                Pre-Condition: {tp.preCondition}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                            Expected Reading
                          </span>
                          <span className="rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900 border border-emerald-200 inline-block mt-0.5">
                            {tp.expectedReading}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WIRING SAFETY RULES */}
          {activeTab === "wiring" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-950">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Hardware Isolation & Prevention of Field Failures
                  </h3>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  These rules are engineered specifically for Pakistan&apos;s field conditions: sudden
                  WAPDA phase jumps (up to 280V AC), inductive back-EMF from water pumps & tube wells,
                  and lightning transients on overhead wiring.
                </p>
              </div>

              <div className="space-y-2.5">
                {safetyRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-800 hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-800">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{rule}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(rule, `rule-${idx}`)}
                      className="shrink-0 p-1 text-slate-400 hover:text-slate-700"
                      title="Copy safety rule"
                    >
                      {copiedNote === `rule-${idx}` ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BENCH POWER LOGIC */}
          {activeTab === "bench" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Gauge className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Power Rail Distribution Logic
                  </h4>
                </div>
                <p className="leading-relaxed bg-white rounded-lg p-3 border border-slate-200 text-slate-800">
                  {powerLogic || "No custom power logic defined. Ensure common ground between all supplies."}
                </p>
              </div>

              {/* Multimeter Probing Procedure Card */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  5-Step Multimeter Safety Procedure Onsite
                </h4>
                <ol className="space-y-2 text-xs text-amber-900 list-decimal pl-4 leading-relaxed">
                  <li>
                    <strong>Continuity Check (Beep Mode)</strong>: Probe with power OFF between DC 5V/3.3V and GND. If it beeps continuously, there is a dead short. Do NOT apply power.
                  </li>
                  <li>
                    <strong>Buck Converter Multimeter Preset</strong>: If using an LM2596 or MP1584 buck converter, tune the trimpot screw while measuring with DMM DC Voltage mode to strictly <strong>5.05V</strong> BEFORE soldering to the microcontroller.
                  </li>
                  <li>
                    <strong>Optocoupler Isolation Check</strong>: Verify resistance between AC live/neutral side and DC MCU GND is infinite (&gt;20MΩ).
                  </li>
                  <li>
                    <strong>Polarity Verification</strong>: Check reverse polarity protection diode (1N4007 or SS34 Schottky) on input leads.
                  </li>
                  <li>
                    <strong>Cold Insertion</strong>: Always disconnect mains 220V or solar DC leads before plugging in sensor ribbon cables or flashing firmware.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Quick Actions */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>
              Always wear protective footwear and use isolated screw drivers when handling AC switching.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setVerifiedPoints(
                  testPoints.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
                );
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Verify All DMM Points
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

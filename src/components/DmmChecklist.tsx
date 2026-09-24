import { useState } from "react";
import { CheckSquare, Square, AlertTriangle, HelpCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { DmmTestPoint, TroubleshootingItem } from "../types";

interface DmmChecklistProps {
  testPoints: DmmTestPoint[];
  troubleshooting: TroubleshootingItem[];
  onOpenSafetyModal?: () => void;
}

export function DmmChecklist({ testPoints, troubleshooting, onOpenSafetyModal }: DmmChecklistProps) {
  const [checkedPoints, setCheckedPoints] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedPoints((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedPoints).filter(Boolean).length;
  const totalCount = testPoints.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Bench DMM Progress Bar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
              Multimeter Bench Verification Progress
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              {completedCount} of {totalCount} Verified
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenSafetyModal && (
              <button
                type="button"
                onClick={onOpenSafetyModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors shadow-2xs"
                title="Launch Safety First overlay"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                <span>Safety First Overlay</span>
              </button>
            )}
            <span className="text-xs font-bold text-slate-700">{progressPercent}% Passed</span>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          ⚠️ Golden Hardware Safety Rule: Complete all nominal voltage checks with the multimeter BEFORE inserting sensitive ICs (ESP32/MCU/Sensors) into their sockets.
        </p>
      </div>

      {/* DMM Test Matrix */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            DMM Nominal Voltage & Continuity Test Points
          </h4>
        </div>
        <div className="divide-y divide-slate-100">
          {testPoints.map((tp, idx) => {
            const isChecked = !!checkedPoints[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer transition-colors ${
                  isChecked ? "bg-emerald-50/40" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 focus:outline-none"
                    aria-label={`Toggle verification for ${tp.testPoint}`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-300" />
                    )}
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-semibold ${isChecked ? "text-emerald-950 line-through decoration-emerald-500" : "text-slate-900"}`}>
                        {tp.testPoint}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700 border border-slate-200">
                        {tp.multimeterMode}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-rose-600">Red Probe (+):</span> {tp.redProbe}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Black Probe (-):</span> {tp.blackProbe}
                      </div>
                    </div>

                    {tp.preCondition && (
                      <p className="mt-1 text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-0.5 border border-amber-200/60 inline-block">
                        ⚡ Pre-condition: {tp.preCondition}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:pl-4 flex sm:flex-col items-end shrink-0">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {tp.expectedReading}
                  </span>
                  {isChecked && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-1">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Troubleshooting Matrix */}
      {troubleshooting && troubleshooting.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Field Diagnostics & Common Bug Troubleshooting Protocols
            </h4>
          </div>

          <div className="space-y-3">
            {troubleshooting.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 text-xs">
                <div className="flex items-start gap-2 font-semibold text-rose-900 mb-1.5">
                  <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[10px] font-bold text-rose-700 uppercase">Symptom</span>
                  <span>{item.symptom}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Probable Root Cause:</span>
                    <span className="text-slate-600">{item.probableCause}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Diagnostic Step:</span>
                    <span className="text-slate-600">{item.diagnosticStep}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-800 block mb-0.5 flex items-center gap-1">
                      <HelpCircle className="h-3 w-3 text-emerald-600" /> Field Solution:
                    </span>
                    <span className="text-slate-800 font-medium">{item.solution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

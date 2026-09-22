import { Cpu, FileDown, Printer, MessageSquareCode, ShieldCheck, MapPin, Sliders } from "lucide-react";
import { EngineeringBlueprint } from "../types";

interface HeaderProps {
  blueprint: EngineeringBlueprint | null;
  onOpenConsult: () => void;
  onPrint: () => void;
  onExportMarkdown: () => void;
  onOpenDeviceInterface?: () => void;
}

export function Header({
  blueprint,
  onOpenConsult,
  onPrint,
  onExportMarkdown,
  onOpenDeviceInterface,
}: HeaderProps) {
  return (
    <header id="main-header" className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                PakIoT Blueprint Architect
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                <ShieldCheck className="h-3 w-3" />
                95%+ Safety Validated
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Production-ready 10-section IoT blueprints with Pakistani market sourcing & DMM protocols
            </p>
          </div>
        </div>

        {/* Center: Pakistani Market Procurement Badges */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>Procurement:</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">Digilog.pk</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">Chip.pk</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">Hall Rd LHR</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">College Rd RWP</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onOpenDeviceInterface && (
            <button
              id="header-jump-device-interface-btn"
              onClick={onOpenDeviceInterface}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              title="Open Live Device Interface (Web & Mobile HMI)"
            >
              <Sliders className="h-4 w-4" />
              <span>Live Interface</span>
            </button>
          )}

          <button
            id="consult-engineer-btn"
            onClick={onOpenConsult}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquareCode className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Ask Engineer</span>
          </button>

          {blueprint && (
            <>
              <button
                id="export-markdown-btn"
                onClick={onExportMarkdown}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Download full Markdown technical documentation"
              >
                <FileDown className="h-4 w-4 text-slate-500" />
                <span className="hidden md:inline">Export .MD</span>
              </button>

              <button
                id="print-blueprint-btn"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Print or Save PDF Blueprint"
              >
                <Printer className="h-4 w-4 text-slate-500" />
                <span className="hidden md:inline">Print / PDF</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

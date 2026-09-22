import { useState } from "react";
import { Sparkles, SlidersHorizontal, ArrowRight, Wheat, Droplets, Sun, CheckCircle2, AlertCircle } from "lucide-react";
import { PRESET_BLUEPRINTS } from "../data/presets";
import { ProjectPreset } from "../types";

interface ProjectInputSectionProps {
  onGenerate: (prompt: string, options: { targetMCU: string; powerSource: string; connectivity: string; region: string }) => void;
  onSelectPreset: (preset: ProjectPreset) => void;
  isLoading: boolean;
  activePresetId: string | null;
  errorMessage: string | null;
}

export function ProjectInputSection({
  onGenerate,
  onSelectPreset,
  isLoading,
  activePresetId,
  errorMessage,
}: ProjectInputSectionProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [targetMCU, setTargetMCU] = useState<string>("ESP32-WROOM-32 (30-Pin)");
  const [powerSource, setPowerSource] = useState<string>("12V Solar / Battery with LM2596 Step-Down");
  const [connectivity, setConnectivity] = useState<string>("Cellular GSM (SIM800L) with SMS Failover");
  const [region, setRegion] = useState<string>("Rawalpindi / Islamabad / Lahore (Digilog / Chip.pk / Hall Rd)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim(), { targetMCU, powerSource, connectivity, region });
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case "Wheat":
        return <Wheat className="h-4 w-4 text-amber-600" />;
      case "Droplets":
        return <Droplets className="h-4 w-4 text-sky-600" />;
      case "Sun":
        return <Sun className="h-4 w-4 text-orange-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <div id="project-input-container" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Generate Production-Ready IoT Blueprint (10-Section Spec)
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Enter any embedded systems or hardware idea. Our architect generates localized BOM in PKR, pin-to-pin wiring safety logic, Mermaid data flow, complete firmware, and DMM testing protocols.
        </p>
      </div>

      {/* Preset Quick Chips */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Quick Blueprints (Pre-Validated for Pakistani Field Conditions)</span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {PRESET_BLUEPRINTS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-card-${preset.id}`}
                type="button"
                onClick={() => {
                  setPrompt(preset.title);
                  onSelectPreset(preset);
                }}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-xs">
                      {getPresetIcon(preset.iconName)}
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{preset.title}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                </div>
                <p className="mt-2 text-[11px] text-slate-500 line-clamp-2">{preset.shortDesc}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span className="rounded bg-white px-1.5 py-0.5 border border-slate-200">{preset.targetMCU}</span>
                  <span className="text-emerald-700 font-semibold">Rs. {preset.budgetPKR.toLocaleString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project-prompt-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Project Concept or Custom Requirements
          </label>
          <div className="relative">
            <textarea
              id="project-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Smart cold storage ammonia gas and temperature logger with GSM SMS alert, solar battery backup, and 16x2 LCD display..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Toggle Advanced Preferences */}
        <div className="flex items-center justify-between">
          <button
            id="toggle-advanced-btn"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {showAdvanced ? "Hide Hardware Options" : "Customize Target MCU, Power & Connectivity"}
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Microcontroller</label>
              <select
                id="target-mcu-select"
                value={targetMCU}
                onChange={(e) => setTargetMCU(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ESP32-WROOM-32 (30-Pin)">ESP32-WROOM-32 (WiFi + BLE)</option>
                <option value="Arduino Nano V3 (ATmega328P)">Arduino Nano V3 (5V TTL)</option>
                <option value="Raspberry Pi Pico W">Raspberry Pi Pico W (RP2040)</option>
                <option value="STM32F103C8T6 (Blue Pill)">STM32 Blue Pill (ARM Cortex-M3)</option>
                <option value="Arduino Uno R3">Arduino Uno R3</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Power Supply Environment</label>
              <select
                id="power-source-select"
                value={powerSource}
                onChange={(e) => setPowerSource(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="12V Solar / Battery with LM2596 Step-Down">12V Solar / Lead-Acid Battery + LM2596</option>
                <option value="220V WAPDA Grid with HLK-PM01 Isolated 5V">220V WAPDA Grid + HLK-PM01 Isolated</option>
                <option value="18650 Li-ion Cells (3.7V - 4.2V) with TP4056 BMS">18650 Li-ion Cells + TP4056 BMS</option>
                <option value="Home UPS 12V Battery Bank Direct Tap">Home UPS 12V Battery Bank Tap</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Primary Network Protocol</label>
              <select
                id="connectivity-select"
                value={connectivity}
                onChange={(e) => setConnectivity(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Cellular GSM (SIM800L) with SMS Failover">Cellular GSM 2G (SIM800L / SMS + GPRS)</option>
                <option value="WiFi 2.4GHz (MQTT / Blynk Cloud)">WiFi 2.4GHz (MQTT / Blynk Cloud)</option>
                <option value="LoRa SX1278 (433MHz Long Range Point-to-Point)">LoRa SX1278 433MHz (Long Range RF)</option>
                <option value="Offline Standalone (OLED / LCD Display Only)">Offline Standalone (Local OLED / Buzzer)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Procurement Hub (Pakistan)</label>
              <select
                id="procurement-region-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Rawalpindi / Islamabad (Digilog / Chip.pk)">Rawalpindi / Islamabad (Digilog / Chip.pk)</option>
                <option value="Lahore (Hall Road Electronics Market)">Lahore (Hall Road Wholesale)</option>
                <option value="Karachi (Saddar Regal Chowk / Electronics Market)">Karachi (Saddar Regal Chowk)</option>
                <option value="Faisalabad / Multan Local Market">Faisalabad / Multan Industrial</option>
              </select>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            id="generate-blueprint-btn"
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Synthesizing 10-Section Hardware Architecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate 10-Section Engineering Blueprint</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

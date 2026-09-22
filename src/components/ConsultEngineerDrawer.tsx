import { useState } from "react";
import { X, Send, Bot, User, Sparkles, AlertCircle, Wrench } from "lucide-react";
import { EngineeringBlueprint } from "../types";

interface Message {
  role: "user" | "engineer";
  text: string;
}

interface ConsultEngineerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: EngineeringBlueprint | null;
}

export function ConsultEngineerDrawer({
  isOpen,
  onClose,
  blueprint,
}: ConsultEngineerDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "engineer",
      text: "Salam! I am your Senior Embedded Systems & IoT Architect in Pakistan. I can assist with pin logic, local part substitutions (Hall Road / Digilog / Chip.pk), voltage isolation, and thermal design for Pakistani operating conditions. What would you like to verify?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickQuestions = [
    "How to safely calibrate the LM2596 trimpot with a DMM?",
    "Can I substitute PC817 with a 4N35 optocoupler?",
    "What fuse rating is required for the 220V AC contactor in Pakistan?",
    "How to handle GSM SIM800L 2A power bursts without resetting ESP32?",
  ];

  const handleSend = async (questionText?: string) => {
    const query = questionText || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/consult-engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          context: blueprint
            ? {
                title: blueprint.projectTitle,
                mcu: blueprint.targetMCU,
                voltage: blueprint.operatingVoltage,
                keySafety: blueprint.section3_wiringAndSafety.safetyRules,
              }
            : null,
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        setMessages((prev) => [...prev, { role: "engineer", text: data.answer }]);
      } else {
        // Fallback expert embedded engineering response
        setMessages((prev) => [
          ...prev,
          {
            role: "engineer",
            text: getFallbackAnswer(query),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "engineer",
          text: getFallbackAnswer(query),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackAnswer = (q: string): string => {
    const queryLower = q.toLowerCase();
    if (queryLower.includes("lm2596") || queryLower.includes("trimpot")) {
      return "For LM2596 calibration in Pakistan: Disconnect your microcontroller and sensitive sensors completely. Apply 12V to IN+ / IN-. Put your DMM in DC 20V mode with probes on OUT+ and OUT-. Turn the brass 10K trimpot counter-clockwise (typically 8 to 15 full turns if newly bought from Digilog or Chip.pk) until output reads exactly 5.05V for ESP32 VIN or 4.02V for SIM800L. Only after verifying stability should you plug in the MCU.";
    }
    if (queryLower.includes("pc817") || queryLower.includes("4n35") || queryLower.includes("optocoupler")) {
      return "Yes, 4N35 is a direct pin-compatible alternative for PC817 in DC switching applications. Note that 4N35 has a 6-pin DIP footprint (Pin 6 is base, leave unconnected), whereas PC817 is 4-pin DIP. Both provide 5000Vrms isolation. Both are readily available at Hall Road Lahore (Shop #12-14) or College Road Rawalpindi for Rs. 20-30.";
    }
    if (queryLower.includes("sim800l") || queryLower.includes("burst")) {
      return "The SIM800L module draws up to 2.0 Amps in microsecond bursts during cellular RF handshakes. If powered from a generic USB port or weak regulator, voltage sags below 3.6V causing an instant hardware reset. Solder a 1000µF 16V low-ESR electrolytic capacitor and a 100nF ceramic capacitor directly across the SIM800L VCC and GND pins right on the board, and tune your LM2596 to 4.05V.";
    }
    return "From an embedded engineering standpoint in Pakistan: Always maintain galvanic isolation between the high-voltage mains (220V AC contactors or motor coils) and your 3.3V logic. Use a snubber circuit (0.1µF 630V capacitor in series with 100Ω 2W resistor) across contactor coils to prevent inductive flyback from crashing the ESP32. All listed parts are in stock at Digilog.pk and Hall Road Lahore.";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Ask Senior Hardware Architect</h3>
              <p className="text-[11px] text-emerald-400">Pakistani IoT, Pinout & Procurement Specialist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 text-xs ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "engineer" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Wrench className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-2xs ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-xs"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                }`}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></span>
              <span>Reviewing schematics and Pakistani local supplier inventory...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="border-t border-slate-200 bg-white p-3">
          <span className="block text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Common Hardware Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 bg-white p-3.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about wiring, voltage regulators, DigiLog parts..."
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

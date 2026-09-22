import { useState } from "react";
import { Copy, Check, Download, Terminal, BookOpen, Layers } from "lucide-react";

interface FirmwareViewerProps {
  language: string;
  targetPlatform: string;
  requiredLibraries: string[];
  code: string;
  codeHighlights: string[];
}

export function FirmwareViewer({
  language,
  targetPlatform,
  requiredLibraries,
  code,
  codeHighlights,
}: FirmwareViewerProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isPython = language.toLowerCase().includes("python");
    const filename = isPython ? "main.py" : "firmware.ino";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const lines = code.split("\n");

  return (
    <div className="space-y-4">
      {/* Firmware Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Production Firmware: {language}
            </h4>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Target Core:</span>
            <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] border border-slate-200 text-slate-800">
              {targetPlatform}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-firmware-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied to Clipboard" : "Copy Code"}</span>
          </button>

          <button
            id="download-firmware-btn"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download {language.toLowerCase().includes("python") ? ".py" : ".ino"}</span>
          </button>
        </div>
      </div>

      {/* Code Architecture Highlights */}
      {codeHighlights && codeHighlights.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-emerald-600" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Firmware Architecture & Safety Highlights
            </h5>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            {codeHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Libraries */}
      {requiredLibraries && requiredLibraries.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-slate-600" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Required Header Imports & Libraries
            </h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredLibraries.map((lib, idx) => (
              <code
                key={idx}
                className="rounded bg-slate-100 px-2.5 py-1 text-xs font-mono text-emerald-800 border border-slate-200"
              >
                {lib}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Code Viewer */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
          <span className="font-mono">{language.toLowerCase().includes("python") ? "main.py" : "firmware.ino"}</span>
          <span>{lines.length} lines</span>
        </div>

        <div className="max-h-[600px] overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="w-10 select-none pr-4 text-right text-slate-600 font-mono text-[11px] align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono text-[12px] text-slate-100">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

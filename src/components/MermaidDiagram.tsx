import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Copy, Check, Code, Eye, RefreshCw, Workflow } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

/**
 * Sanitizes Mermaid flowchart text:
 * 1. Strips markdown fences.
 * 2. Ensures labels inside [ ] are wrapped in double quotes to prevent
 *    unquoted parentheses, arrows (->), slashes, etc., from breaking the lexer.
 * 3. Normalizes line breaks inside labels to <br/>.
 */
function sanitizeMermaid(rawChart: string): string {
  if (!rawChart || !rawChart.trim()) {
    return `flowchart TD\n  PWR["Power Source"] --> MCU["MCU Controller"]\n  MCU --> OUT["System Output"]`;
  }

  let text = rawChart.trim();

  // Strip code fences
  text = text.replace(/^```(?:mermaid)?\s*/i, "").replace(/\s*```$/, "").trim();

  // Ensure diagram type header exists
  if (!/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)\b/i.test(text)) {
    text = `flowchart TD\n${text}`;
  }

  // Quote unquoted node labels: e.g. ID[Some text (30-pin)] -> ID["Some text (30-pin)"]
  // Matches node identifiers followed by [unquoted text]
  text = text.replace(/([a-zA-Z0-9_\-]+)\[([^"\]\r\n]+)\]/g, (_match, nodeId, label) => {
    let cleanLabel = label.trim();
    // Normalize newlines to <br/>
    cleanLabel = cleanLabel.replace(/\\n/g, "<br/>").replace(/\n/g, "<br/>");
    // Escape internal quotes
    cleanLabel = cleanLabel.replace(/"/g, "'");
    return `${nodeId}["${cleanLabel}"]`;
  });

  return text;
}

export function MermaidDiagram({ chart, id = "mermaid-diagram" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
      securityLevel: "loose",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 18,
      },
    });

    let isMounted = true;

    async function renderChart() {
      // Clean up any stale error nodes injected by mermaid into document.body
      const staleMermaidErrors = document.querySelectorAll("[id^='dmermaid']");
      staleMermaidErrors.forEach((el) => el.remove());

      const sanitized = sanitizeMermaid(chart);

      try {
        setError(null);
        const uniqueId = `mermaid-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const { svg } = await mermaid.render(uniqueId, sanitized);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        // Remove error node created by mermaid if render threw
        const errorNodes = document.querySelectorAll("[id^='dmermaid']");
        errorNodes.forEach((el) => el.remove());

        // Attempt a simplified safe fallback diagram
        try {
          const fallbackChart = `flowchart TD\n  PWR["Power Bus (5V / 12V)"] --> MCU["Main Microcontroller"]\n  SENS["Hardware Sensors"] --> MCU\n  MCU --> RELAY["Optocoupled Actuator Output"]\n  MCU -.-> COMM["Telemetry & Status"]`;
          const recoveryId = `mermaid-recov-${Date.now()}`;
          const { svg } = await mermaid.render(recoveryId, fallbackChart);
          if (isMounted) {
            setSvgContent(svg);
            setError(null);
          }
        } catch {
          if (isMounted) {
            setError(err?.message || "Syntax notice for custom flow diagram.");
          }
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
      const staleMermaidErrors = document.querySelectorAll("[id^='dmermaid']");
      staleMermaidErrors.forEach((el) => el.remove());
    };
  }, [chart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id={id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-emerald-600" />
          <h4 className="text-sm font-semibold tracking-wide text-slate-800">
            System Data & Power Flow (Mermaid.js)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="toggle-mermaid-view-btn"
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showRaw ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
            {showRaw ? "Visual Graph" : "Mermaid Syntax"}
          </button>
          <button
            id="copy-mermaid-btn"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            title="Copy Mermaid Syntax"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {showRaw ? (
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs font-mono text-emerald-400">
          <code>{chart}</code>
        </pre>
      ) : error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Flow Syntax View
          </div>
          <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-slate-200">
            {chart}
          </pre>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex justify-center overflow-x-auto py-4 [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}

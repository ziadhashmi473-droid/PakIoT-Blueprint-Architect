import { useState } from "react";
import { Download, ShoppingBag, MapPin, AlertCircle, Filter } from "lucide-react";
import { BomComponent, VendorInfo } from "../types";
import { CategoryCostChart } from "./CategoryCostChart";

interface BomTableProps {
  components: BomComponent[];
  vendors: VendorInfo[];
  totalEstimatedPKR: number;
}

export function BomTable({ components, vendors, totalEstimatedPKR }: BomTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(components.map((c) => c.category)))];

  const filteredComponents =
    selectedCategory === "ALL"
      ? components
      : components.filter((c) => c.category === selectedCategory);

  const handleExportCSV = () => {
    const headers = ["Component Name", "Model/Part No.", "Category", "Quantity", "Estimated Price (PKR)", "Total (PKR)", "Source Vendor", "Critical Safety Notes"];
    const rows = components.map((c) => [
      `"${c.name}"`,
      `"${c.model}"`,
      `"${c.category}"`,
      c.quantity,
      c.estimatedPricePKR,
      c.quantity * c.estimatedPricePKR,
      `"${c.sourceVendor}"`,
      `"${c.criticalNotes.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PakIoT-BOM-Procurement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Cost & Procurement Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Sourcing Cost</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-950">
              Rs. {totalEstimatedPKR.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-700">PKR</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700">Calculated based on current Pakistani retail & wholesale markets.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Components</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{components.length}</span>
            <span className="text-xs text-slate-500">parts</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Includes active silicon, sensors, relays & protection passives.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Export Sourcing Sheet</span>
            <p className="mt-1 text-[11px] text-slate-500">Download formatted CSV for shopping at Hall Road or Digilog.</p>
          </div>
          <button
            id="export-bom-csv-btn"
            onClick={handleExportCSV}
            className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Download BOM (.CSV)
          </button>
        </div>
      </div>

      {/* Visual Cost Breakdown by Component Category */}
      <CategoryCostChart
        components={components}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Vendors Directory */}
      {vendors && vendors.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recommended Pakistani Procurement Vendors
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vendors.map((vendor, vIdx) => (
              <div key={vIdx} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{vendor.name}</span>
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                    {vendor.type}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{vendor.city}</span>
                </div>
                {vendor.notes && <p className="mt-1.5 text-[11px] text-slate-600 border-t border-slate-200/60 pt-1.5">{vendor.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-500 mr-1">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* BOM Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Component / Description</th>
                <th className="px-3 py-3">Model Number</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3 text-center">Qty</th>
                <th className="px-3 py-3 text-right">Unit Price (PKR)</th>
                <th className="px-3 py-3 text-right">Subtotal</th>
                <th className="px-3 py-3">Local Source</th>
                <th className="px-4 py-3">Critical Engineering Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredComponents.map((item, idx) => {
                const subtotal = item.quantity * item.estimatedPricePKR;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-600">{item.model}</td>
                    <td className="px-3 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600">
                      Rs. {item.estimatedPricePKR.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-emerald-700">
                      Rs. {subtotal.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{item.sourceVendor}</td>
                    <td className="px-4 py-3 text-[11px] text-amber-800 max-w-xs">
                      <div className="flex items-start gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item.criticalNotes}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

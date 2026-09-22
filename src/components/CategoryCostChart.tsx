import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { TrendingUp, PieChart as PieIcon, Layers, Sparkles } from "lucide-react";
import { BomComponent } from "../types";

interface CategoryCostChartProps {
  components: BomComponent[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

interface CategoryData {
  category: string;
  totalCost: number;
  percentage: number;
  itemCount: number;
  topComponent: string;
  topComponentCost: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  MCU: "#059669", // emerald-600
  Sensor: "#0284c7", // sky-600
  Actuator: "#7c3aed", // violet-600
  Power: "#d97706", // amber-600
  "Wiring/Protection": "#475569", // slate-600
  "Passive/Interface": "#0d9488", // teal-600
};

const DEFAULT_COLOR = "#64748b";

export function CategoryCostChart({
  components,
  selectedCategory = "ALL",
  onSelectCategory,
}: CategoryCostChartProps) {
  const [metric, setMetric] = useState<"cost" | "percent">("cost");

  // Aggregate cost breakdown by category
  const { categoryData, grandTotal, primaryDriver } = useMemo(() => {
    let grand = 0;
    const map = new Map<
      string,
      {
        totalCost: number;
        itemCount: number;
        components: { name: string; cost: number }[];
      }
    >();

    for (const comp of components) {
      const lineCost = comp.quantity * comp.estimatedPricePKR;
      grand += lineCost;

      const existing = map.get(comp.category) || {
        totalCost: 0,
        itemCount: 0,
        components: [],
      };
      existing.totalCost += lineCost;
      existing.itemCount += comp.quantity;
      existing.components.push({ name: comp.name, cost: lineCost });
      map.set(comp.category, existing);
    }

    const data: CategoryData[] = Array.from(map.entries())
      .map(([cat, val]) => {
        val.components.sort((a, b) => b.cost - a.cost);
        const topComp = val.components[0] || { name: "N/A", cost: 0 };
        return {
          category: cat,
          totalCost: val.totalCost,
          percentage: grand > 0 ? (val.totalCost / grand) * 100 : 0,
          itemCount: val.itemCount,
          topComponent: topComp.name,
          topComponentCost: topComp.cost,
        };
      })
      .sort((a, b) => b.totalCost - a.totalCost);

    const driver = data.length > 0 ? data[0] : null;

    return {
      categoryData: data,
      grandTotal: grand,
      primaryDriver: driver,
    };
  }, [components]);

  if (categoryData.length === 0) {
    return null;
  }

  return (
    <div
      id="category-cost-breakdown-card"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Procurement Cost Breakdown by Category
            </h4>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Identify highest cost drivers across hardware silicon, sensors, actuators, and protection.
          </p>
        </div>

        {/* View Metric Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric("cost")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              metric === "cost"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            PKR Value (Rs.)
          </button>
          <button
            type="button"
            onClick={() => setMetric("percent")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              metric === "percent"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Percentage Share (%)
          </button>
        </div>
      </div>

      {/* Primary Cost Driver Insight Banner */}
      {primaryDriver && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50/50 px-3.5 py-2.5 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-semibold text-emerald-900">Primary Cost Driver:</strong>{" "}
              <span className="font-bold">{primaryDriver.category}</span> accounts for{" "}
              <strong className="font-bold">{primaryDriver.percentage.toFixed(1)}%</strong> of
              total BOM (Rs. {primaryDriver.totalCost.toLocaleString()}).
            </span>
          </div>
          <span className="text-[11px] text-emerald-800 font-medium">
            Top item: <span className="italic">{primaryDriver.topComponent}</span> (Rs.{" "}
            {primaryDriver.topComponentCost.toLocaleString()})
          </span>
        </div>
      )}

      {/* Recharts Bar Chart Container */}
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            margin={{ top: 10, right: 10, left: 10, bottom: 24 }}
            onClick={(state) => {
              if (state && state.activeLabel && onSelectCategory) {
                const clickedCat = String(state.activeLabel);
                onSelectCategory(selectedCategory === clickedCat ? "ALL" : clickedCat);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1" }}
              tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
              interval={0}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(val: number) =>
                metric === "cost"
                  ? val >= 1000
                    ? `Rs. ${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`
                    : `Rs. ${val}`
                  : `${val}%`
              }
              width={65}
            />
            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CategoryData;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs min-w-[210px]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                        <span className="font-bold text-slate-900">{data.category}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 font-semibold">
                          {data.itemCount} {data.itemCount === 1 ? "unit" : "units"}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category Total:</span>
                          <span className="font-bold text-slate-900">
                            Rs. {data.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Budget Share:</span>
                          <span className="font-bold text-emerald-700">
                            {data.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="block font-medium text-slate-700">Cost Leader:</span>
                          <span className="truncate block text-slate-600 italic">
                            {data.topComponent} (Rs. {data.topComponentCost.toLocaleString()})
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 font-medium text-center">
                        Click bar to filter BOM table
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={metric === "cost" ? "totalCost" : "percentage"}
              radius={[6, 6, 0, 0]}
              animationDuration={600}
            >
              {categoryData.map((entry) => {
                const isSelected = selectedCategory === entry.category;
                const baseColor = CATEGORY_COLORS[entry.category] || DEFAULT_COLOR;
                return (
                  <Cell
                    key={entry.category}
                    fill={baseColor}
                    opacity={selectedCategory === "ALL" || isSelected ? 1 : 0.35}
                    className="cursor-pointer transition-opacity duration-200"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Metric Badges / Interactive Legend */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3 border-t border-slate-100">
        {categoryData.map((cat) => {
          const isSelected = selectedCategory === cat.category;
          const dotColor = CATEGORY_COLORS[cat.category] || DEFAULT_COLOR;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() =>
                onSelectCategory &&
                onSelectCategory(isSelected ? "ALL" : cat.category)
              }
              className={`flex flex-col items-start rounded-lg border p-2 text-left transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20 shadow-2xs"
                  : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                <span className="text-[11px] font-bold text-slate-800 truncate">
                  {cat.category}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between w-full text-[10px]">
                <span className="font-semibold text-slate-700">
                  Rs. {cat.totalCost.toLocaleString()}
                </span>
                <span className="text-slate-500 font-mono">
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

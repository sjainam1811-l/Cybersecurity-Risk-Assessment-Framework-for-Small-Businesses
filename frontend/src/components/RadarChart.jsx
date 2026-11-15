import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RadarChartComp({ domainScores }) {
  const nistFunctions = ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"];
  const scores = domainScores || {};
  const data = nistFunctions.map((func) => ({
    domain: func,
    score: typeof scores[func] === "number" ? scores[func] : 0,
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          NIST CSF Function Radar
        </h3>
        <span className="text-[12px] text-muted">0 - 100% Coverage</span>
      </div>
      <div className="w-full h-[280px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={85} data={data}>
            <PolarGrid stroke="#2A2420" />
            <PolarAngleAxis
              dataKey="domain"
              stroke="#B3A9A1"
              tick={{ fill: "#B3A9A1", fontSize: 12, fontFamily: "Inter" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#2A2420"
              tick={{ fill: "#7A6F67", fontSize: 10, fontFamily: "Inter" }}
            />
            <Radar
              name="Implementation"
              dataKey="score"
              stroke="#F2511B"
              strokeWidth={2}
              fill="#F2511B"
              fillOpacity={0.15}
              dot={{ r: 3, fill: "#F2511B", strokeWidth: 0 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E1A17",
                borderColor: "#2A2420",
                borderRadius: "8px",
                color: "#F5F1EE",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
              itemStyle={{ color: "#F5F1EE" }}
              formatter={(value) => [`${value}%`, "Coverage"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

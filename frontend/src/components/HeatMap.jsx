import React from "react";

export default function HeatMapComp({ domainScores }) {
  const getSeverityStyle = (score) => {
    const val = typeof score === "number" ? score : parseFloat(score) || 0;
    if (val >= 75) {
      return {
        bg: "rgba(63, 166, 107, 0.12)",
        border: "rgba(63, 166, 107, 0.30)",
        text: "#3FA66B",
        label: "Optimal",
      };
    }
    if (val >= 50) {
      return {
        bg: "rgba(232, 180, 49, 0.12)",
        border: "rgba(232, 180, 49, 0.30)",
        text: "#E8B431",
        label: "Moderate",
      };
    }
    if (val >= 25) {
      return {
        bg: "rgba(242, 112, 29, 0.12)",
        border: "rgba(242, 112, 29, 0.30)",
        text: "#F2701D",
        label: "Elevated Risk",
      };
    }
    return {
      bg: "rgba(229, 72, 77, 0.12)",
      border: "rgba(229, 72, 77, 0.30)",
      text: "#E5484D",
      label: "Critical Gap",
    };
  };

  const nistFunctions = ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"];
  const scores = domainScores || {};
  const entries = nistFunctions.map((func) => [
    func,
    typeof scores[func] === "number" ? scores[func] : 0,
  ]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Domain Coverage Heatmap
        </h3>
        <span className="text-[12px] text-muted">{entries.length} Core Functions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {entries.map(([domain, score]) => {
          const style = getSeverityStyle(score);
          return (
            <div
              key={domain}
              className="p-3.5 rounded-btn transition-colors duration-150 flex flex-col justify-between"
              style={{
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-secondary">{domain}</span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: style.text }}
                >
                  {style.label}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: style.text }}
                >
                  {score}%
                </span>
                <span className="text-[11px] text-muted">coverage</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

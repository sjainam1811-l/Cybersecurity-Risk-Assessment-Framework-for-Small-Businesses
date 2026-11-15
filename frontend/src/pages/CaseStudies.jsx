import React, { useState } from "react";
import caseData from "../data/caseStudies.json";
import { CheckCircle2, TrendingDown, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom Chart.js plugin to draw values at the end of each horizontal bar (numbers, 12px)
const valueLabelsPlugin = {
  id: "valueLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const val = dataset.data[index];
          if (val !== undefined && val !== null) {
            ctx.save();
            ctx.fillStyle = "#F5F1EE";
            ctx.font = "12px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(String(val), element.x + 6, element.y);
            ctx.restore();
          }
        });
      }
    });
  },
};

export default function CaseStudies() {
  const cases = caseData.caseStudies;
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0].id);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const getSeverity = (score) => {
    if (score >= 20) return { label: "Critical", pillClass: "pill-critical", color: "#E5484D" };
    if (score >= 12) return { label: "High", pillClass: "pill-high", color: "#F2701D" };
    if (score >= 6) return { label: "Medium", pillClass: "pill-medium", color: "#E8B431" };
    return { label: "Low", pillClass: "pill-low", color: "#3FA66B" };
  };

  // Compute metrics for all cases for Chart 1
  const allCaseMetrics = cases.map((cs) => {
    const computed = cs.threats.map((t) => {
      const initScore = t.likelihood * t.impact;
      const resLikelihood = Math.max(1, t.likelihood - (t.mitigationsCount || 0));
      const resScore = resLikelihood * t.impact;
      return { initScore, resScore };
    });
    const avgInit = (
      computed.reduce((sum, item) => sum + item.initScore, 0) / computed.length
    ).toFixed(1);
    const avgRes = (
      computed.reduce((sum, item) => sum + item.resScore, 0) / computed.length
    ).toFixed(1);
    const reduction = Math.round(((avgInit - avgRes) / avgInit) * 100);
    return {
      name: cs.name,
      avgInit: parseFloat(avgInit),
      avgRes: parseFloat(avgRes),
      reduction,
    };
  });

  // Selected case computed threats
  const selectedThreats = selectedCase.threats.map((t) => {
    const initScore = t.likelihood * t.impact;
    const resLikelihood = Math.max(1, t.likelihood - (t.mitigationsCount || 0));
    const resScore = resLikelihood * t.impact;
    return {
      ...t,
      initScore,
      resLikelihood,
      resScore,
    };
  });

  const selectedAvgInit = (
    selectedThreats.reduce((sum, t) => sum + t.initScore, 0) / selectedThreats.length
  ).toFixed(1);

  const selectedAvgRes = (
    selectedThreats.reduce((sum, t) => sum + t.resScore, 0) / selectedThreats.length
  ).toFixed(1);

  const selectedReduction = Math.round(
    ((selectedAvgInit - selectedAvgRes) / selectedAvgInit) * 100
  );

  // Chart 1: Initial vs Residual across all 3 cases
  const chart1Data = {
    labels: allCaseMetrics.map((c) => c.name),
    datasets: [
      {
        label: "Initial Risk (Avg)",
        data: allCaseMetrics.map((c) => c.avgInit),
        backgroundColor: "#F2701D",
        barThickness: 14,
        borderRadius: 4,
      },
      {
        label: "Residual Risk (Avg)",
        data: allCaseMetrics.map((c) => c.avgRes),
        backgroundColor: "#3FA66B",
        barThickness: 14,
        borderRadius: 4,
      },
    ],
  };

  const chart1Options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 28,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#B3A9A1",
          font: { size: 12 },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: "#1E1A17",
        borderColor: "#2A2420",
        borderWidth: 1,
        titleColor: "#F5F1EE",
        bodyColor: "#B3A9A1",
        padding: 10,
      },
    },
    scales: {
      x: {
        min: 0,
        max: 25,
        grid: { color: "#2A2420" },
        ticks: { color: "#B3A9A1", font: { size: 12 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#F5F1EE", font: { size: 12 } },
      },
    },
  };

  // Chart 2: Threat scores for selected case study
  const chart2Data = {
    labels: selectedThreats.map((t) => t.name),
    datasets: [
      {
        label: "Initial Threat Score",
        data: selectedThreats.map((t) => t.initScore),
        backgroundColor: selectedThreats.map((t) => getSeverity(t.initScore).color),
        barThickness: 14,
        borderRadius: 4,
      },
    ],
  };

  const chart2Options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 28,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1E1A17",
        borderColor: "#2A2420",
        borderWidth: 1,
        titleColor: "#F5F1EE",
        bodyColor: "#B3A9A1",
        padding: 10,
        callbacks: {
          label: (context) => {
            const score = context.parsed.x;
            const sev = getSeverity(score).label;
            return `Score: ${score} (${sev})`;
          },
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 25,
        grid: { color: "#2A2420" },
        ticks: { color: "#B3A9A1", font: { size: 12 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#F5F1EE", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="min-h-screen bg-base py-6 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="card-dark p-6">
          <div className="max-w-2xl">
            <h1 className="text-[28px] font-semibold text-primary tracking-tight">
              SME Case Studies
            </h1>
            <p className="text-secondary mt-1.5 text-sm">
              Cybersecurity risk assessments across three small business sectors.
            </p>
          </div>
        </div>

        {/* 3 Tabs - Underline Only */}
        <div className="border-b border-border flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {cases.map((cs) => {
            const isSelected = selectedCaseId === cs.id;
            return (
              <button
                key={cs.id}
                onClick={() => setSelectedCaseId(cs.id)}
                className={`h-11 px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 border-b-2 ${
                  isSelected
                    ? "border-accent text-primary bg-transparent"
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                {cs.name}
              </button>
            );
          })}
        </div>

        {/* Company Info & Sample Scenario / Source Badge */}
        <div className="card-dark p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-semibold text-primary">{selectedCase.name}</h2>
                {selectedCase.dataType === "field assessment" || selectedCase.dataType === "public report" ? (
                  <span className="text-xs px-2.5 py-0.5 rounded border border-border bg-raised text-primary font-medium">
                    {selectedCase.source || selectedCase.dataType}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded border border-border bg-raised text-secondary font-medium">
                    Sample scenario
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">
                Sector: <span className="text-secondary">{selectedCase.sector}</span> · Team Size:{" "}
                <span className="text-secondary">{selectedCase.employeeCount} employees</span>
              </p>
            </div>
            <div className="text-xs text-muted italic">
              Residual score uses the formula: Residual Likelihood = max(1, Likelihood - implemented mitigations).
            </div>
          </div>

          {/* Summary Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-btn border border-border bg-raised/40 flex items-center justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-wider text-muted font-medium">Initial Risk</span>
                <p className="text-2xl font-bold text-sev-high tabular-nums mt-0.5">{selectedAvgInit}</p>
                <span className="text-[11px] text-muted">Average initial threat score</span>
              </div>
              <ShieldAlert className="w-6 h-6 text-sev-high/70" />
            </div>

            <div className="p-4 rounded-btn border border-border bg-raised/40 flex items-center justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-wider text-muted font-medium">Residual Risk</span>
                <p className="text-2xl font-bold text-sev-low tabular-nums mt-0.5">{selectedAvgRes}</p>
                <span className="text-[11px] text-muted">Average after safeguards</span>
              </div>
              <ShieldCheck className="w-6 h-6 text-sev-low/70" />
            </div>

            <div className="p-4 rounded-btn border border-border bg-raised/40 flex items-center justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-wider text-muted font-medium">Risk Reduction</span>
                <p className="text-2xl font-bold text-[#3FA66B] tabular-nums mt-0.5">{selectedReduction}% lower</p>
                <span className="text-[11px] text-muted">Overall exposure drop</span>
              </div>
              <TrendingDown className="w-6 h-6 text-[#3FA66B]/70" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: All 3 Cases Comparison */}
          <div className="card-dark p-6 space-y-3">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-[12px]">
              Initial vs Residual Risk (All 3 Cases)
            </h3>
            <div className="h-60">
              <Bar data={chart1Data} options={chart1Options} plugins={[valueLabelsPlugin]} />
            </div>
          </div>

          {/* Chart 2: Selected Case Threat Scores */}
          <div className="card-dark p-6 space-y-3">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-[12px]">
              {selectedCase.name} Threat Scores
            </h3>
            <div className="h-60">
              <Bar data={chart2Data} options={chart2Options} plugins={[valueLabelsPlugin]} />
            </div>
          </div>
        </div>

        {/* Threat Table */}
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-[12px]">
            Identified Threats &amp; Calculated Scores
          </h3>

          <div className="overflow-x-auto border border-border rounded-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-raised border-b border-border text-[12px] uppercase tracking-wider text-secondary font-semibold">
                  <th className="py-3 px-4">Threat</th>
                  <th className="py-3 px-4 text-center">Likelihood</th>
                  <th className="py-3 px-4 text-center">Impact</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Severity</th>
                  <th className="py-3 px-4 text-center">Residual Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {selectedThreats.map((t) => {
                  const { label, pillClass } = getSeverity(t.initScore);
                  return (
                    <tr key={t.name} className="hover:bg-raised/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-primary">{t.name}</td>
                      <td className="py-3 px-4 text-center tabular-nums text-secondary">{t.likelihood} / 5</td>
                      <td className="py-3 px-4 text-center tabular-nums text-secondary">{t.impact} / 5</td>
                      <td className="py-3 px-4 text-center tabular-nums font-semibold text-primary">{t.initScore}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${pillClass}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-sev-low tabular-nums">{t.resScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Applied Mitigations List */}
        <div className="card-dark p-6 space-y-3">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-[12px]">
            Applied Mitigations
          </h3>

          <div className="space-y-2.5">
            {selectedCase.appliedMitigations.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-btn border border-border bg-raised/40 flex items-start space-x-3 text-sm text-secondary"
              >
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

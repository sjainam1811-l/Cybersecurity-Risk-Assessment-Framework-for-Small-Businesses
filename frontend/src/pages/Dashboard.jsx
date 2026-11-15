import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import InputForm from "../components/InputForm";
import RadarChartComp from "../components/RadarChart";
import HeatMapComp from "../components/HeatMap";

export default function Dashboard({ onLogout }) {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [frameworkFilter, setFrameworkFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch assessment history
  const fetchHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await axios.get("http://localhost:8000/api/v1/assessments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment record?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/assessment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Assessment deleted successfully");
      setHistory((prev) => prev.filter((item) => item._id !== id));
      if (result && result.id === id) {
        setResult(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete assessment");
    }
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm("Are you sure you want to delete ALL assessment history records?")) return;
    try {
      await axios.delete("http://localhost:8000/api/v1/assessments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("All assessment records deleted");
      setHistory([]);
      setResult(null);
    } catch (err) {
      console.error("Clear all error:", err);
      toast.error("Failed to clear assessment history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [result]);

  const filtered = history
    .filter((a) => {
      if (!frameworkFilter) return true;
      if (frameworkFilter === "NIST CSF 2.0") return a.framework && a.framework.includes("NIST");
      if (frameworkFilter === "ISO 27001") return a.framework && a.framework.includes("ISO");
      return a.framework === frameworkFilter;
    })
    .sort((a, b) => {
      if (sortBy === "score") return (b.overall_score || 0) - (a.overall_score || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const displayFramework = (fw) => {
    if (!fw) return "NIST CSF 2.0";
    if (fw.includes("ISO")) return "ISO 27001";
    return "NIST CSF 2.0";
  };

  const getSeverityPill = (level) => {
    const l = (level || "").toLowerCase();
    if (l === "critical") return "pill-critical";
    if (l === "high") return "pill-high";
    if (l === "medium") return "pill-medium";
    return "pill-low";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-base py-6 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Page Header (Clean, no requirement badges) */}
        <div className="relative text-center pt-2 pb-4 header-glow rounded-card">
          <h1 className="text-[28px] font-semibold text-primary tracking-tight">
            Security Risk Assessment Dashboard
          </h1>
          <p className="text-secondary text-sm mt-1.5 max-w-[640px] mx-auto leading-relaxed">
            Rate your systems by threat likelihood and impact, and see risk by NIST function.
          </p>
        </div>

        {/* Input Form Section (Matches 1200px container width) */}
        <div className="w-full">
          <InputForm onResult={setResult} />
        </div>

        {/* Latest Risk Result Panel */}
        {result && (
          <div className="w-full card-dark p-6 space-y-6 shadow-card">
            {/* Header & Export Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
              <div>
                <span className="text-[12px] font-medium text-muted uppercase tracking-[0.04em]">
                  Assessment Outcome
                </span>
                <h2 className="text-lg font-semibold text-primary mt-0.5">
                  Latest Risk Evaluation Result
                </h2>
              </div>

              {/* Action Buttons: Download PDF Report */}
              <div className="flex items-center space-x-2.5">
                <a
                  href={`http://localhost:8000/api/v1/assessment/${result.id}/pdf`}
                  className="btn-primary text-xs px-3.5 h-9 flex items-center font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF Report
                </a>
              </div>
            </div>

            {/* Metrics Overview Cards (Responsive Grid) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-raised border border-border rounded-btn">
                <span className="text-[12px] font-medium text-muted uppercase tracking-[0.04em]">Overall Risk Score</span>
                <div className="flex items-baseline space-x-1.5 mt-1.5">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    {Number(result.score || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-muted">/ 25.00</span>
                </div>
              </div>

              <div className="p-4 bg-raised border border-border rounded-btn">
                <span className="text-[12px] font-medium text-muted uppercase tracking-[0.04em]">Severity Level</span>
                <div className="mt-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-pill uppercase font-semibold border ${getSeverityPill(
                      result.risk_level
                    )}`}
                  >
                    {result.risk_level || "Medium"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-raised border border-border rounded-btn">
                <span className="text-[12px] font-medium text-muted uppercase tracking-[0.04em]">Critical Threats</span>
                <div className="mt-1.5 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-sev-critical tabular-nums">
                    {result.critical_count || 0}
                  </span>
                  <span className="text-xs text-muted">Identified</span>
                </div>
              </div>

              <div className="p-4 bg-raised border border-border rounded-btn">
                <span className="text-[12px] font-medium text-muted uppercase tracking-[0.04em]">Mitigations Required</span>
                <div className="mt-1.5 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-accent tabular-nums">
                    {result.mitigations ? result.mitigations.length : 0}
                  </span>
                  <span className="text-xs text-muted">Action Items</span>
                </div>
              </div>
            </div>

            {/* Radar View & Heatmap Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-raised/40 p-4 rounded-card border border-border">
              <RadarChartComp domainScores={result.domains} />
              <HeatMapComp domainScores={result.domains} />
            </div>
          </div>
        )}

        {/* Assessment History Table (Matches 1200px container width) */}
        <div className="w-full card-dark p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-primary">Assessment History</h2>
              <p className="text-xs text-muted mt-0.5">
                Saved assessments with PDF export
              </p>
            </div>
            <div className="flex items-center space-x-2.5">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="btn-secondary text-xs px-3 h-9 text-sev-critical hover:border-sev-critical/50 transition-colors"
                  title="Delete all assessment records"
                >
                  Clear All History
                </button>
              )}
              <select
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="input-dark appearance-none text-xs h-9 py-0"
                style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
              >
                <option value="">All Frameworks</option>
                <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                <option value="ISO 27001">ISO 27001</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-dark appearance-none text-xs h-9 py-0"
                style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
              >
                <option value="date">Newest First</option>
                <option value="score">Highest Score</option>
              </select>
            </div>
          </div>

          {loadingHistory ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 rounded-btn skeleton-shimmer w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-btn border border-dashed border-border bg-raised/30">
              <p className="text-primary font-medium text-sm">No assessments found</p>
              <p className="text-secondary text-xs mt-1">
                Complete and submit the assessment form above to record your first evaluation.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-card bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-raised text-secondary font-semibold uppercase text-[12px] tracking-[0.04em] sticky top-0 z-10">
                  <tr>
                    <th className="p-3 border-b border-border">System name</th>
                    <th className="p-3 border-b border-border">Criticality</th>
                    <th className="p-3 border-b border-border">Framework</th>
                    <th className="p-3 border-b border-border text-right">Risk score</th>
                    <th className="p-3 border-b border-border">Severity</th>
                    <th className="p-3 border-b border-border">Assessment date</th>
                    <th className="p-3 border-b border-border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((item) => (
                    <tr key={item._id} className="hover:bg-raised/40 transition-colors duration-150 h-12">
                      <td className="p-3 font-medium text-primary max-w-[200px] truncate" title={item.system_name}>
                        {item.system_name}
                      </td>
                      <td className="p-3 text-secondary capitalize">{item.criticality}</td>
                      <td className="p-3 text-secondary">{displayFramework(item.framework)}</td>
                      <td className="p-3 text-right font-bold text-primary tabular-nums">
                        {Number(item.overall_score || 0).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-pill uppercase font-semibold border ${getSeverityPill(
                            item.risk_level
                          )}`}
                        >
                          {item.risk_level || "Medium"}
                        </span>
                      </td>
                      <td className="p-3 text-muted tabular-nums whitespace-nowrap text-xs">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <a
                            href={`http://localhost:8000/api/v1/assessment/${item._id}/pdf`}
                            className="btn-secondary text-xs px-3 h-7 inline-flex items-center font-medium text-accent hover:border-accent"
                            target="_blank"
                            rel="noreferrer"
                          >
                            PDF
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteAssessment(item._id)}
                            className="btn-icon-delete h-7 w-7"
                            title="Delete assessment"
                            aria-label="Delete assessment"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import api from "../services/api";

const CRITICALITY_HELPERS = {
  low: "Non-essential internal tool; minimal operational impact.",
  medium: "Operational support system; moderate business disruption.",
  high: "Mission-critical system or sensitive customer data store.",
  critical: "Life-safety, core financial gateway, or existential risk.",
};

export default function InputForm({ onResult }) {
  const [systemName, setSystemName] = useState("");
  const [criticality, setCriticality] = useState("medium");
  const [framework, setFramework] = useState("NIST CSF 2.0");
  const [controls, setControls] = useState([]);
  const [threats, setThreats] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Check for pre-filled data from Case Studies or SME Research
  useEffect(() => {
    // 1. Check for full case study
    const caseStudyData = sessionStorage.getItem("load_case_study");
    if (caseStudyData) {
      try {
        const parsed = JSON.parse(caseStudyData);
        if (parsed.system_name) setSystemName(parsed.system_name);
        if (parsed.criticality) setCriticality(parsed.criticality);
        if (parsed.framework) setFramework(parsed.framework);
        if (parsed.controls && parsed.controls.length > 0) setControls(parsed.controls);
        if (parsed.threats && parsed.threats.length > 0) setThreats(parsed.threats);
        sessionStorage.removeItem("load_case_study");
      } catch (e) {
        console.error("Error loading case study:", e);
      }
    }

    // 2. Check for single prefilled threat from research
    const prefilledThreat = sessionStorage.getItem("prefilled_threat");
    if (prefilledThreat) {
      try {
        const parsedThreat = JSON.parse(prefilledThreat);
        setThreats((prev) => [...prev, parsedThreat]);
        sessionStorage.removeItem("prefilled_threat");
      } catch (e) {
        console.error("Error loading prefilled threat:", e);
      }
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!systemName.trim()) newErrors.systemName = "System Name is required.";
    if (controls.length === 0) newErrors.controls = "Please add at least one security control.";
    if (threats.length === 0) newErrors.threats = "Please add at least one threat.";

    controls.forEach((c, i) => {
      if (!c.name.trim()) newErrors[`control_name_${i}`] = "Control name is required.";
      if (!c.description.trim()) newErrors[`control_description_${i}`] = "Description is required.";
    });

    threats.forEach((t, i) => {
      if (!t.category.trim()) newErrors[`threat_category_${i}`] = "Category is required.";
      if (!t.description.trim()) newErrors[`threat_description_${i}`] = "Description is required.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/api/v1/assess", {
        system_name: systemName,
        criticality,
        framework,
        controls,
        threats,
      });
      onResult(res.data);
    } catch (err) {
      console.error("Assessment submit error:", err);
      alert("Assessment failed to process. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const getPillClass = (score) => {
    if (score >= 20) return "pill-critical";
    if (score >= 12) return "pill-high";
    if (score >= 6) return "pill-medium";
    return "pill-low";
  };

  return (
    <form onSubmit={handleSubmit} className="card-dark p-6 shadow-card space-y-6">
      {/* Form Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">System Risk Assessment</h2>
        <p className="text-xs text-muted mt-0.5">
          Define system scope, security controls, and evaluate threat severity.
        </p>
      </div>

      {/* Target System, Criticality, Framework (3-column grid with equal widths) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">
            System / Business Asset Name
          </label>
          <input
            type="text"
            placeholder="e.g. Core Banking Gateway, POS Terminal"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            className="input-dark w-full"
          />
          {errors.systemName && (
            <p className="text-sev-critical text-xs mt-1">{errors.systemName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">
            Business Criticality
          </label>
          <select
            value={criticality}
            onChange={(e) => setCriticality(e.target.value)}
            className="input-dark appearance-none w-full"
            style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <p className="text-[11px] text-muted mt-1 leading-tight">
            {CRITICALITY_HELPERS[criticality] || CRITICALITY_HELPERS.medium}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">
            Framework Alignment
          </label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="input-dark appearance-none w-full"
            style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
          >
            <option value="NIST CSF 2.0">NIST CSF 2.0</option>
            <option value="ISO 27001">ISO 27001</option>
          </select>
          <p className="text-[11px] text-muted mt-1 leading-tight">
            Standard compliance methodology for risk scoring.
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-4 rounded-card bg-surface border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">
              1. Security Controls & Safeguards ({controls.length})
            </h3>
            {controls.length > 0 && (
              <button
                type="button"
                onClick={() => setControls([])}
                className="text-xs text-muted hover:text-sev-critical underline transition-colors"
                title="Remove all security controls"
              >
                Clear All
              </button>
            )}
          </div>
          <span className="text-[12px] text-muted">Govern, Identify, Protect, Detect, Respond, Recover</span>
        </div>

        {errors.controls && (
          <p className="text-sev-critical text-xs">{errors.controls}</p>
        )}

        {controls.length === 0 ? (
          <div className="p-4 text-center rounded-btn border border-dashed border-border bg-raised/20 text-xs text-muted">
            No security controls added yet. Click &quot;Add Control&quot; below to define safeguards.
          </div>
        ) : (
          <div className="space-y-2.5">
            {controls.map((c, i) => (
              <div key={i} className="p-3 bg-raised border border-border rounded-btn">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2.5fr_1.3fr_auto_auto] items-center gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Control Name (e.g. MFA, Firewall)"
                      value={c.name}
                      onChange={(e) => {
                        const newC = [...controls];
                        newC[i].name = e.target.value;
                        setControls(newC);
                      }}
                      className="input-dark w-full text-xs"
                    />
                    {errors[`control_name_${i}`] && (
                      <p className="text-sev-critical text-[11px] mt-0.5">
                        {errors[`control_name_${i}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Description (e.g. Protect logins via MFA)"
                      value={c.description}
                      onChange={(e) => {
                        const newC = [...controls];
                        newC[i].description = e.target.value;
                        setControls(newC);
                      }}
                      className="input-dark w-full text-xs"
                    />
                    {errors[`control_description_${i}`] && (
                      <p className="text-sev-critical text-[11px] mt-0.5">
                        {errors[`control_description_${i}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      value={c.nist_function || "Protect"}
                      onChange={(e) => {
                        const newC = [...controls];
                        newC[i].nist_function = e.target.value;
                        setControls(newC);
                      }}
                      className="input-dark appearance-none w-full text-xs h-10"
                      title="NIST Function"
                    >
                      <option value="Govern">Govern</option>
                      <option value="Identify">Identify</option>
                      <option value="Protect">Protect</option>
                      <option value="Detect">Detect</option>
                      <option value="Respond">Respond</option>
                      <option value="Recover">Recover</option>
                    </select>
                  </div>

                  <div className="flex items-center px-1">
                    <label className="flex items-center space-x-2 text-xs text-secondary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={c.implemented}
                        onChange={(e) => {
                          const newC = [...controls];
                          newC[i].implemented = e.target.checked;
                          setControls(newC);
                        }}
                        className="rounded accent-accent h-4 w-4 bg-base border-border cursor-pointer"
                      />
                      <span className={c.implemented ? "text-sev-low font-semibold" : "text-muted"}>
                        {c.implemented ? "Implemented" : "Pending"}
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setControls(controls.filter((_, idx) => idx !== i))}
                      className="btn-icon-delete"
                      aria-label="Delete control"
                      title="Delete control"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setControls([...controls, { name: "", description: "", nist_function: "Protect", implemented: false }])}
          className="btn-ghost-add"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Control</span>
        </button>
      </div>

      {/* Threats Section */}
      <div className="p-4 rounded-card bg-surface border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">
              2. Identified Threats & Risk Scores ({threats.length})
            </h3>
            {threats.length > 0 && (
              <button
                type="button"
                onClick={() => setThreats([])}
                className="text-xs text-muted hover:text-sev-critical underline transition-colors"
                title="Remove all identified threats"
              >
                Clear All
              </button>
            )}
          </div>
          <span className="text-[12px] text-muted">Risk Score = Likelihood (1-5) × Impact (1-5)</span>
        </div>

        {errors.threats && (
          <p className="text-sev-critical text-xs">{errors.threats}</p>
        )}

        {threats.length === 0 ? (
          <div className="p-4 text-center rounded-btn border border-dashed border-border bg-raised/20 text-xs text-muted">
            No threats added yet. Click &quot;Add Threat&quot; below to define threats.
          </div>
        ) : (
          <div className="space-y-2.5">
            {threats.map((t, i) => {
              const currentScore = (t.likelihood || 1) * (t.impact || 1);
              const pillClass = getPillClass(currentScore);

              return (
                <div key={i} className="p-3 bg-raised border border-border rounded-btn">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_auto_auto_auto_auto] items-center gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Category (e.g. Phishing)"
                        value={t.category}
                        onChange={(e) => {
                          const newT = [...threats];
                          newT[i].category = e.target.value;
                          setThreats(newT);
                        }}
                        className="input-dark w-full text-xs"
                      />
                      {errors[`threat_category_${i}`] && (
                        <p className="text-sev-critical text-[11px] mt-0.5">
                          {errors[`threat_category_${i}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Vulnerability Description"
                        value={t.description}
                        onChange={(e) => {
                          const newT = [...threats];
                          newT[i].description = e.target.value;
                          setThreats(newT);
                        }}
                        className="input-dark w-full text-xs"
                      />
                      {errors[`threat_description_${i}`] && (
                        <p className="text-sev-critical text-[11px] mt-0.5">
                          {errors[`threat_description_${i}`]}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <label className="text-xs text-muted">Likelihood:</label>
                      <select
                        value={t.likelihood || 1}
                        onChange={(e) => {
                          const newT = [...threats];
                          newT[i].likelihood = parseInt(e.target.value, 10);
                          setThreats(newT);
                        }}
                        className="input-dark w-16 text-center font-semibold tabular-nums text-xs h-10 cursor-pointer"
                        title="Likelihood (1 to 5)"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <label className="text-xs text-muted">Impact:</label>
                      <select
                        value={t.impact || 1}
                        onChange={(e) => {
                          const newT = [...threats];
                          newT[i].impact = parseInt(e.target.value, 10);
                          setThreats(newT);
                        }}
                        className="input-dark w-16 text-center font-semibold tabular-nums text-xs h-10 cursor-pointer"
                        title="Impact (1 to 5)"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-center min-w-[56px]">
                      <span className={`text-xs px-2.5 py-1 rounded-pill tabular-nums font-semibold border ${pillClass}`}>
                        {currentScore}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setThreats(threats.filter((_, idx) => idx !== i))}
                        className="btn-icon-delete"
                        aria-label="Delete threat"
                        title="Delete threat"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setThreats([...threats, { category: "", description: "", likelihood: 1, impact: 1 }])}
          className="btn-ghost-add"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Threat</span>
        </button>
      </div>

      {/* Submission Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full h-11 text-sm font-semibold flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Evaluating Risk Metrics...</span>
          </>
        ) : (
          <span>Run Assessment & Generate Report</span>
        )}
      </button>
    </form>
  );
}

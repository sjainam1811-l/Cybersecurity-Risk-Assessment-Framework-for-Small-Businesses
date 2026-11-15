import React, { useState } from "react";
import { threatsData } from "../data/threats";
import { CheckCircle2, Search, ShieldCheck } from "lucide-react";

export default function SMEResearch() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sort by score (Likelihood x Impact) descending; ties broken by impact descending
  const sortedThreats = [...threatsData].sort((a, b) => {
    const scoreA = a.likelihood * a.impact;
    const scoreB = b.likelihood * b.impact;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return b.impact - a.impact;
  });

  const rankedThreats = sortedThreats.map((t, idx) => ({
    ...t,
    rank: `#${idx + 1}`,
    score: t.likelihood * t.impact,
  }));

  const [selectedThreat, setSelectedThreat] = useState(rankedThreats[0]);

  const filteredThreats = rankedThreats.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverity = (score) => {
    if (score >= 20) return { label: "Critical", pillClass: "pill-critical" };
    if (score >= 12) return { label: "High", pillClass: "pill-high" };
    if (score >= 6) return { label: "Medium", pillClass: "pill-medium" };
    return { label: "Low", pillClass: "pill-low" };
  };

  return (
    <div className="min-h-screen bg-base py-6 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="card-dark p-6">
          <div className="max-w-2xl">
            <h1 className="text-[28px] font-semibold text-primary tracking-tight">
              Common SME Cyber Risks
            </h1>
            <p className="text-secondary mt-1.5 text-sm">
              Common cyber threats facing small businesses, calculated risk scores, and recommended safeguards.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-5 relative flex items-center">
            <Search className="w-4 h-4 absolute left-[14px] text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search threats by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark w-full h-10 pl-[44px] pr-4 text-sm"
            />
          </div>

          {/* Severity Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border text-xs text-muted">
            <span className="font-medium text-secondary">Risk Score Scale:</span>
            <span className="pill-low px-2 py-0.5 rounded text-xs font-medium">1–5 Low</span>
            <span className="pill-medium px-2 py-0.5 rounded text-xs font-medium">6–11 Medium</span>
            <span className="pill-high px-2 py-0.5 rounded text-xs font-medium">12–19 High</span>
            <span className="pill-critical px-2 py-0.5 rounded text-xs font-medium">20–25 Critical</span>
            <span className="ml-auto text-[12px] text-muted hidden sm:inline">
              Score = Likelihood × Impact
            </span>
          </div>
        </div>

        {/* 2-Column Threat Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 6 Threat Cards */}
          <div className="lg:col-span-5 space-y-3">
            {filteredThreats.length === 0 ? (
              <div className="card-dark p-6 text-center text-sm text-muted">
                No matching threats found.
              </div>
            ) : (
              filteredThreats.map((threat) => {
                const score = threat.likelihood * threat.impact;
                const { label, pillClass } = getSeverity(score);
                const isSelected = selectedThreat && selectedThreat.id === threat.id;

                return (
                  <div
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    className={`p-4 rounded-card border cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? "border-accent bg-raised shadow-card"
                        : "border-border bg-surface hover:border-border-strong hover:bg-raised/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-1.5 py-0.5 rounded font-mono font-bold bg-base border border-border text-accent">
                          {threat.rank}
                        </span>
                        <span className="text-[12px] font-medium text-muted uppercase tracking-wider">
                          {threat.category}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold tabular-nums ${pillClass}`}>
                        Score {threat.score} ({label})
                      </span>
                    </div>

                    <h2 className="text-base font-semibold text-primary mt-1.5">
                      {threat.name}
                    </h2>

                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {threat.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted tabular-nums">
                      <span>Likelihood: <strong className="text-primary font-medium">{threat.likelihood}</strong>/5</span>
                      <span>Impact: <strong className="text-primary font-medium">{threat.impact}</strong>/5</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Mitigation Controls Panel */}
          <div className="lg:col-span-7">
            {selectedThreat ? (
              <div className="card-dark p-6 space-y-5">
                {/* Panel Header */}
                <div className="border-b border-border pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[12px] text-muted uppercase tracking-wider font-medium">
                        {selectedThreat.category}
                      </span>
                      <h2 className="text-xl font-semibold text-primary mt-0.5">
                        {selectedThreat.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted">NIST CSF 2.0:</span>
                      {selectedThreat.nist_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded border border-border bg-raised text-xs font-mono font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-secondary mt-2">
                    {selectedThreat.description}
                  </p>
                </div>

                {/* Mitigation Controls List */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-[12px]">
                      Recommended Safeguards
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {selectedThreat.mitigations.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-btn border border-border bg-raised/50 flex items-start space-x-3 text-sm text-secondary"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-dark p-8 text-center text-muted text-sm">
                Select a threat to view safeguards.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

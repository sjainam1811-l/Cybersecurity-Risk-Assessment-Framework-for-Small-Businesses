import React, { useState } from "react";
import { Check } from "lucide-react";

export default function BestPractices() {
  const rawItems = [
    {
      id: 1,
      title: "Multi-factor authentication on all email and remote access",
      action: "Require MFA for every employee accessing company email, remote access, and cloud portals.",
      code: "PR.AA",
      priority: "High",
    },
    {
      id: 2,
      title: "Automated daily backups stored offline or in write-protected cloud",
      action: "Back up critical data daily and keep one copy disconnected from the local network.",
      code: "PR.DS",
      priority: "High",
    },
    {
      id: 3,
      title: "Security awareness training for all staff twice a year",
      action: "Train staff to recognize phishing emails, suspicious links, and social engineering tricks.",
      code: "PR.AT",
      priority: "High",
    },
    {
      id: 4,
      title: "Least-privilege access: remove admin rights from daily accounts",
      action: "Run standard user accounts daily and restrict administrator permissions to authorized tasks.",
      code: "PR.AA",
      priority: "High",
    },
    {
      id: 5,
      title: "Network segmentation between guest Wi-Fi and business systems",
      action: "Isolate visitor Wi-Fi on a separate network away from internal business workstations.",
      code: "PR.IR",
      priority: "Medium",
    },
    {
      id: 6,
      title: "Automatic security patching enabled on all endpoints",
      action: "Turn on automatic security updates for operating systems, browsers, and business software.",
      code: "PR.PS",
      priority: "High",
    },
    {
      id: 7,
      title: "Endpoint detection and response (EDR) installed on every computer",
      action: "Deploy modern endpoint protection on all workstations to monitor for malicious behaviors.",
      code: "DE.CM",
      priority: "Medium",
    },
    {
      id: 8,
      title: "Data encryption on all laptops and removable drives",
      action: "Enable full-disk encryption like BitLocker or FileVault to protect lost or stolen hardware.",
      code: "PR.DS",
      priority: "Medium",
    },
    {
      id: 9,
      title: "Incident response plan with emergency contacts written down",
      action: "Maintain an offline printed contact list and immediate response steps for security incidents.",
      code: "RS.MA",
      priority: "Low",
    },
    {
      id: 10,
      title: "Asset inventory: maintain a list of all devices and software",
      action: "Maintain an updated inventory of all company computers, mobile devices, and active software.",
      code: "ID.AM",
      priority: "Low",
    },
  ];

  // Sort by priority (High -> Medium -> Low), preserving original relative order inside each group
  const priorityRank = { high: 1, medium: 2, low: 3 };
  const checklistItems = [...rawItems].sort(
    (a, b) => priorityRank[a.priority.toLowerCase()] - priorityRank[b.priority.toLowerCase()]
  );

  const [checkedIds, setCheckedIds] = useState({ 1: true, 2: true, 6: true });

  const toggleCheck = (id) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = checklistItems.filter((item) => checkedIds[item.id]).length;
  const progressPct = Math.round((completedCount / checklistItems.length) * 100);

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "pill-high";
      case "medium":
        return "pill-medium";
      default:
        return "pill-low";
    }
  };

  return (
    <div className="min-h-screen bg-base py-6 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="card-dark p-6">
          <div className="max-w-2xl">
            <h1 className="text-[28px] font-semibold text-primary tracking-tight">
              SME Cybersecurity Best Practices
            </h1>
            <p className="text-secondary mt-1.5 text-sm">
              Essential cybersecurity safeguards to improve small business defense posture.
            </p>
          </div>

          {/* Simple Progress Counter & Thin 6px Bar */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-secondary font-medium">Implementation Progress</span>
              <span className="text-primary font-semibold tabular-nums">
                {completedCount} of {checklistItems.length} completed ({progressPct}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-raised rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 10 Checklist Items */}
        <div className="space-y-3">
          {checklistItems.map((item) => {
            const isChecked = !!checkedIds[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-card border cursor-pointer transition-colors duration-150 flex items-start space-x-3.5 ${
                  isChecked
                    ? "border-border-strong bg-raised/60"
                    : "border-border bg-surface hover:border-border-strong hover:bg-raised/40"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded mt-0.5 flex-shrink-0 flex items-center justify-center border transition-colors ${
                    isChecked
                      ? "bg-accent border-accent text-white"
                      : "border-border bg-base"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm font-semibold transition-colors ${
                        isChecked ? "text-primary line-through text-muted" : "text-primary"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded border border-border bg-raised text-secondary font-mono font-medium">
                        {item.code}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${getPriorityClass(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Shield } from "lucide-react";

export default function NISTFramework() {
  const [selectedFunction, setSelectedFunction] = useState("Govern");

  const nistFunctions = [
    {
      id: "Govern",
      code: "GV",
      title: "Govern (GV)",
      description:
        "Establish and monitor the organization's cybersecurity risk management strategy, expectations, and policy.",
      categories: [
        {
          code: "GV.OC",
          name: "Organizational Context",
          action: "Identify business mission, legal requirements, and stakeholder expectations.",
        },
        {
          code: "GV.RM",
          name: "Risk Management Strategy",
          action: "Define risk appetite and risk management roles across the business.",
        },
        {
          code: "GV.RR",
          name: "Roles, Responsibilities, and Authorities",
          action: "Assign clear cybersecurity duties to staff and external IT vendors.",
        },
        {
          code: "GV.PO",
          name: "Policy",
          action: "Document and communicate baseline security rules for passwords and data.",
        },
        {
          code: "GV.OV",
          name: "Oversight",
          action: "Review cybersecurity results periodically with company leadership.",
        },
        {
          code: "GV.SC",
          name: "Cybersecurity Supply Chain Risk Management",
          action: "Manage security risks from external suppliers and cloud software services.",
        },
      ],
    },
    {
      id: "Identify",
      code: "ID",
      title: "Identify (ID)",
      description:
        "Understand cybersecurity risk to systems, people, assets, data, and capabilities.",
      categories: [
        {
          code: "ID.AM",
          name: "Asset Management",
          action: "Maintain an accurate inventory of computers, software, and cloud accounts.",
        },
        {
          code: "ID.RA",
          name: "Risk Assessment",
          action: "Regularly identify threats, system vulnerabilities, and operational impacts.",
        },
        {
          code: "ID.IM",
          name: "Improvement",
          action: "Record and implement security lessons from past tests and incidents.",
        },
      ],
    },
    {
      id: "Protect",
      code: "PR",
      title: "Protect (PR)",
      description:
        "Implement safeguards to ensure delivery of critical services and contain security events.",
      categories: [
        {
          code: "PR.AA",
          name: "Identity Management, Authentication, and Access Control",
          action: "Enforce multi-factor authentication and limit administrative permissions.",
        },
        {
          code: "PR.AT",
          name: "Awareness and Training",
          action: "Train all employees to recognize phishing emails and handle data safely.",
        },
        {
          code: "PR.DS",
          name: "Data Security",
          action: "Encrypt sensitive business data at rest, on laptops, and in transit.",
        },
        {
          code: "PR.PS",
          name: "Platform Security",
          action: "Enable automatic updates and patch operating systems promptly.",
        },
        {
          code: "PR.IR",
          name: "Technology Infrastructure Resilience",
          action: "Separate guest Wi-Fi from business networks and maintain offline backups.",
        },
      ],
    },
    {
      id: "Detect",
      code: "DE",
      title: "Detect (DE)",
      description:
        "Discover and analyze cybersecurity attacks and compromises in a timely manner.",
      categories: [
        {
          code: "DE.CM",
          name: "Continuous Monitoring",
          action: "Deploy endpoint detection software to monitor devices for malicious activity.",
        },
        {
          code: "DE.AE",
          name: "Adverse Event Analysis",
          action: "Investigate unusual logins, alerts, or unexplained system changes promptly.",
        },
      ],
    },
    {
      id: "Respond",
      code: "RS",
      title: "Respond (RS)",
      description:
        "Take action regarding a detected cybersecurity incident to contain its impact.",
      categories: [
        {
          code: "RS.MA",
          name: "Incident Management",
          action: "Designate lead responders and follow a written incident checklist.",
        },
        {
          code: "RS.AN",
          name: "Incident Analysis",
          action: "Determine which systems, files, and accounts were affected by the breach.",
        },
        {
          code: "RS.CO",
          name: "Incident Response Reporting and Communication",
          action: "Notify affected staff, customers, and legal authorities if required.",
        },
        {
          code: "RS.MI",
          name: "Incident Mitigation",
          action: "Isolate infected devices from the network immediately to stop spread.",
        },
      ],
    },
    {
      id: "Recover",
      code: "RC",
      title: "Recover (RC)",
      description:
        "Restore capabilities or services that were impaired due to a cybersecurity incident.",
      categories: [
        {
          code: "RC.RP",
          name: "Incident Recovery Plan Execution",
          action: "Restore affected systems and verify data integrity using clean backups.",
        },
        {
          code: "RC.CO",
          name: "Incident Recovery Communication",
          action: "Update staff and clients once systems are safely verified and running.",
        },
      ],
    },
  ];

  const implementationTiers = [
    {
      tier: "Tier 1: Partial",
      summary: "Cybersecurity practices are informal, reactive, and implemented on an ad-hoc basis.",
    },
    {
      tier: "Tier 2: Risk Informed",
      summary: "Management approves security practices and prioritizes risks, but processes are not company-wide.",
    },
    {
      tier: "Tier 3: Repeatable",
      summary: "Formal policies and consistent procedures are documented, maintained, and updated regularly.",
    },
    {
      tier: "Tier 4: Adaptive",
      summary: "Security practices evolve dynamically based on lessons learned and emerging threats.",
    },
  ];

  const currentFunc = nistFunctions.find((f) => f.id === selectedFunction) || nistFunctions[0];

  return (
    <div className="min-h-screen bg-base py-6 px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="card-dark p-6">
          <div className="max-w-2xl">
            <h1 className="text-[28px] font-semibold text-primary tracking-tight">
              NIST Cybersecurity Framework 2.0
            </h1>
            <p className="text-secondary mt-1.5 text-sm">
              Core functions, categories, and practical implementation guidance for small businesses.
            </p>
          </div>
        </div>

        {/* Function Tabs - Underline Only */}
        <div className="border-b border-border flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {nistFunctions.map((func) => {
            const isSelected = selectedFunction === func.id;
            return (
              <button
                key={func.id}
                onClick={() => setSelectedFunction(func.id)}
                className={`h-11 px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 border-b-2 ${
                  isSelected
                    ? "border-accent text-primary bg-transparent"
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                {func.title}
              </button>
            );
          })}
        </div>

        {/* Selected Function Details */}
        <div className="card-dark p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-primary">
              {currentFunc.title}
            </h2>
            <p className="text-secondary text-sm mt-1">
              {currentFunc.description}
            </p>
          </div>

          {/* 3-Column Categories Table */}
          <div className="overflow-x-auto border border-border rounded-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-raised border-b border-border text-[12px] uppercase tracking-wider text-secondary font-semibold">
                  <th className="py-3 px-4 w-32">Category Code</th>
                  <th className="py-3 px-4 w-56">Category Name</th>
                  <th className="py-3 px-4">What a Small Business Should Do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {currentFunc.categories.map((cat) => (
                  <tr key={cat.code} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-accent">
                      {cat.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-primary">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 text-secondary leading-relaxed">
                      {cat.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Implementation Tiers - Plain 4-Column Row */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-accent" />
            <h2 className="text-base font-semibold text-primary">
              NIST CSF Implementation Tiers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {implementationTiers.map((tier) => (
              <div key={tier.tier} className="card-dark p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary">
                    {tier.tier}
                  </h3>
                  <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                    {tier.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

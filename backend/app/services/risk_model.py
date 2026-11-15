"""
Comprehensive Risk Evaluation, NIST CSF Mapping, Automatic Mitigation,
SME Research Data, Case Studies, and Findings Engine.
"""

from typing import List, Dict, Any

# ============================================================================
# 1. SME RISK RESEARCH DATA (Requirement 1)
# ============================================================================
SME_THREATS_RESEARCH = [
    {
        "id": "phishing",
        "name": "Phishing & Spear-Phishing",
        "category": "Social Engineering",
        "common_in_sme": True,
        "default_likelihood": 5,
        "default_impact": 4,
        "description": "Deceptive emails, messages, or websites impersonating trusted entities (vendors, banks, executives) to trick employees into divulging sensitive credentials, financial details, or downloading malware.",
        "attack_vectors": [
            "Deceptive invoices with altered payment bank details (Business Email Compromise - BEC)",
            "Urgent password reset or MFA fatigue prompts",
            "Malicious attachments disguised as PDF purchase orders or resumes",
            "Clone phishing of popular cloud services (Microsoft 365, Google Workspace)"
        ],
        "vulnerabilities_exploited": [
            "Lack of employee cybersecurity awareness and regular phishing simulation",
            "Absence of email authentication protocols (SPF, DKIM, DMARC)",
            "Single-factor authentication or weak MFA implementation"
        ],
        "business_impact": {
            "financial": "Direct monetary loss via fraudulent wire transfers, credential-driven invoice fraud, and costly incident response.",
            "operational": "Email service disruption, account lockouts, and time diverted to forensic investigations.",
            "reputational": "Severe loss of client trust when customer accounts or proprietary communication are compromised.",
            "regulatory": "GDPR / privacy law fines if phishing leads to unauthorized personal data exfiltration."
        },
        "recommended_controls": [
            "Employee Security Awareness & Phishing Simulation Training",
            "Multi-Factor Authentication (MFA) on all email accounts",
            "SPF, DKIM, and DMARC enforcement on email gateway",
            "Strict dual-authorization procedures for wire transfers above set thresholds"
        ],
        "nist_mapping": "Protect (PR.AT - Awareness & Training, PR.AC - Access Control)"
    },
    {
        "id": "ransomware",
        "name": "Ransomware Extortion",
        "category": "Malware / Extortion",
        "common_in_sme": True,
        "default_likelihood": 4,
        "default_impact": 5,
        "description": "Malicious encryption software that blocks access to vital business files, databases, and operational servers until a ransom is paid, often coupled with double-extortion data leak threats.",
        "attack_vectors": [
            "Exposed and unpatched Remote Desktop Protocol (RDP) ports",
            "Phishing emails delivering trojans / loaders (e.g. initial access brokers)",
            "Exploitation of unpatched vulnerabilities in internet-facing network appliances and VPNs",
            "Drive-by downloads from compromised websites"
        ],
        "vulnerabilities_exploited": [
            "Lack of immutable, offline, or air-gapped backups",
            "Weak or unsegmented internal networks allowing lateral movement",
            "Delayed security patch deployment on critical servers and endpoints"
        ],
        "business_impact": {
            "financial": "Ransom demands ranging from $25,000 to over $1,000,000, extortion payments, legal counsel fees, and extortion-related business interruption costs.",
            "operational": "Complete operational halt lasting days or weeks; potential permanent data loss if decryptors fail.",
            "reputational": "Public exposure on extortion leak sites, damaging client confidence and supplier contracts.",
            "regulatory": "Mandatory breach reporting and penalties under data privacy mandates."
        },
        "recommended_controls": [
            "Automated 3-2-1 Data Backup with offline/immutable cloud copy",
            "Endpoint Detection & Response (EDR) with automated behavioral isolation",
            "Next-Generation Firewall (NGFW) with strict network segmentation",
            "Disable or strictly isolate exposed RDP behind VPN and MFA"
        ],
        "nist_mapping": "Protect (PR.PT - Protective Tech), Detect (DE.CM - Monitoring), Recover (RC.RP - Recovery)"
    },
    {
        "id": "insider_threats",
        "name": "Insider Threats (Malicious & Negligent)",
        "category": "Internal Risk",
        "common_in_sme": True,
        "default_likelihood": 3,
        "default_impact": 4,
        "description": "Security risks originating from current or former employees, contractors, or business partners who abuse legitimate access or inadvertently mishandle confidential business information.",
        "attack_vectors": [
            "Disgruntled employees copying customer databases or source code prior to departure",
            "Staff emailing corporate spreadsheets to personal email accounts for remote work convenience",
            "Accidental public sharing of cloud storage buckets (Google Drive, AWS S3, OneDrive)",
            "Contractor accounts remaining active months after contract conclusion"
        ],
        "vulnerabilities_exploited": [
            "Lack of Principle of Least Privilege and excessive user permissions",
            "Absence of prompt employee offboarding protocols",
            "No data loss prevention (DLP) or file access auditing"
        ],
        "business_impact": {
            "financial": "Loss of proprietary IP, stolen client lists causing revenue loss, and intellectual property litigation.",
            "operational": "Unauthorized modification or deletion of crucial operational databases.",
            "reputational": "Embarrassing leaks of internal communications and customer records.",
            "regulatory": "Fines for unauthorized disclosures of personally identifiable information (PII)."
        },
        "recommended_controls": [
            "Role-Based Access Control (RBAC) enforcing Least Privilege",
            "Automated HR-IT offboarding procedure with instant credential revocation",
            "User Activity Monitoring and audit logs for sensitive file access",
            "Data Loss Prevention (DLP) and USB storage restrictions"
        ],
        "nist_mapping": "Identify (ID.GV - Governance), Protect (PR.AC - Access Control), Detect (DE.CM - Monitoring)"
    },
    {
        "id": "malware",
        "name": "Malware, Spyware & Keyloggers",
        "category": "Malicious Software",
        "common_in_sme": True,
        "default_likelihood": 4,
        "default_impact": 4,
        "description": "Trojan horses, rootkits, spyware, and keyloggers silently installed on SME endpoints to harvest financial credentials, monitor keystrokes, and turn workstations into botnet proxies.",
        "attack_vectors": [
            "Downloading pirated software, cracked utilities, or unauthorized tools",
            "Infected USB drives plugged into point-of-sale (POS) or workstation machines",
            "Malicious advertising (malvertising) delivering silent browser exploit kits",
            "Secondary payload execution following credential theft"
        ],
        "vulnerabilities_exploited": [
            "Absence of real-time endpoint antivirus protection or out-of-date signature databases",
            "Employees running workstation accounts with full local Administrator privileges",
            "Unmanaged personal devices (BYOD) accessing the corporate network"
        ],
        "business_impact": {
            "financial": "Interception of banking credentials leading to unauthorized account withdrawals and clean-up expenses.",
            "operational": "System sluggishness, hardware degradation, and re-imaging downtime.",
            "reputational": "Customers receiving malware-infected files sent inadvertently from the SME's email accounts.",
            "regulatory": "Compliance violations under PCI-DSS or industry security baselines."
        },
        "recommended_controls": [
            "Managed Endpoint Protection / Antivirus with real-time heuristic scanning",
            "Revocation of standard user local administrative rights",
            "Centralized automated patch management for OS and third-party software",
            "Web filtering and DNS-layer security blocking malicious domains"
        ],
        "nist_mapping": "Protect (PR.PT - Protective Tech), Detect (DE.AE - Anomalies & Events)"
    },
    {
        "id": "data_breaches",
        "name": "Data Breaches & Unencrypted Leakage",
        "category": "Information Security",
        "common_in_sme": True,
        "default_likelihood": 3,
        "default_impact": 5,
        "description": "Unauthorized access, extraction, or disclosure of sensitive company records, including customer PII, credit card details, medical records, or proprietary trade secrets.",
        "attack_vectors": [
            "Misconfigured public cloud storage databases or Elasticsearch clusters",
            "Lost or stolen unencrypted company laptops, tablets, or backup hard drives",
            "SQL injection (SQLi) vulnerabilities in public web applications or customer portals",
            "Third-party vendor compromise leading to supply-chain access"
        ],
        "vulnerabilities_exploited": [
            "Storing customer information in plaintext without database-level or full-disk encryption",
            "Inadequate web application security hygiene and absence of input sanitization",
            "No data retention policy or regular sensitive data discovery audit"
        ],
        "business_impact": {
            "financial": "Forensic audit costs, mandatory customer credit monitoring services, regulatory penalties, and lawsuits.",
            "operational": "Mandatory breach notification overhead, emergency database hardening, and legal audits.",
            "reputational": "Catastrophic loss of brand equity; industry studies show up to 60% of SMEs struggle to stay in business within 6 months of a major data breach.",
            "regulatory": "Severe fines under GDPR, HIPAA, PCI-DSS, or local consumer privacy acts."
        },
        "recommended_controls": [
            "Full-Disk Encryption (BitLocker / FileVault) and database AES-256 encryption at rest",
            "TLS 1.3 encryption for all data in transit",
            "Web Application Firewall (WAF) to prevent SQL injection and cross-site scripting",
            "Strict vendor risk assessments and Third-Party access reviews"
        ],
        "nist_mapping": "Identify (ID.AM - Asset Management), Protect (PR.DS - Data Security)"
    },
    {
        "id": "weak_passwords",
        "name": "Weak Passwords & Credential Stuffing",
        "category": "Access Management",
        "common_in_sme": True,
        "default_likelihood": 5,
        "default_impact": 4,
        "description": "Use of predictable, short, default, or reused passwords across multiple internal and cloud platforms, leaving systems highly vulnerable to brute-force attacks and credential stuffing lists.",
        "attack_vectors": [
            "Automated credential stuffing utilizing billions of breached username/password pairs from third-party leaks",
            "Password spraying against company single sign-on (SSO) or remote portals using common passwords like 'Company2024!'",
            "Default passwords left active on newly installed routers, security cameras, and network printers",
            "Written passwords on sticky notes attached to workstation monitors"
        ],
        "vulnerabilities_exploited": [
            "Absence of an enforced strong password policy (length, complexity, and breach checking)",
            "No multi-factor authentication (MFA) barrier after password entry",
            "Lack of an enterprise-approved password management solution"
        ],
        "business_impact": {
            "financial": "Immediate takeover of accounting portals, email, and payroll software leading to fund diversion.",
            "operational": "Administrative account lockout, unauthorized profile changes, and account recovery delays.",
            "reputational": "Compromised administrative accounts used to deface company websites or message clients.",
            "regulatory": "Failure to demonstrate minimum standard of care in data protection audits."
        },
        "recommended_controls": [
            "Enforce Multi-Factor Authentication (MFA) across ALL business applications without exception",
            "Deploy an Enterprise Password Manager (e.g. 1Password, Bitwarden) for all staff",
            "Enforce a minimum 14-character passphrase policy and ban common/leaked passwords",
            "Implement automated account lockout after 5 consecutive failed attempts"
        ],
        "nist_mapping": "Protect (PR.AC - Access Control, PR.AT - Awareness & Training)"
    }
]

# ============================================================================
# 2. BUSINESS CASE STUDIES (Requirement 5 - Simulated Data)
# ============================================================================
SME_CASE_STUDIES = [
    {
        "id": "retail-shop",
        "title": "Case Study 1: Retail Shop ('Apex Urban Retailers')",
        "sector": "Retail & E-Commerce",
        "company_size": "28 Employees, 2 Physical Outlets + Shopify Store",
        "simulated": True,
        "profile": "A mid-sized clothing and sports equipment retailer operating Point-of-Sale (POS) terminals in two retail storefronts and an integrated Shopify online store. The business handles payment card numbers, customer addresses, and local staff attendance data.",
        "identified_risks": [
            {
                "category": "Weak Passwords",
                "description": "Default passwords left on in-store POS terminals and shared manager login for Shopify admin portal.",
                "likelihood": 5,
                "impact": 4,
                "score": 20,
                "severity": "Critical",
                "rank": 1
            },
            {
                "category": "Phishing",
                "description": "Store managers received fraudulent supplier emails requesting payment rerouting to bogus bank accounts.",
                "likelihood": 4,
                "impact": 4,
                "score": 16,
                "severity": "High",
                "rank": 2
            },
            {
                "category": "Data Breaches",
                "description": "Cardholder and customer contact data stored unencrypted on an on-premise inventory desktop.",
                "likelihood": 3,
                "impact": 5,
                "score": 15,
                "severity": "High",
                "rank": 3
            },
            {
                "category": "Ransomware",
                "description": "Shared accounting computer running obsolete Windows 10 without isolated backups.",
                "likelihood": 3,
                "impact": 4,
                "score": 12,
                "severity": "High",
                "rank": 4
            }
        ],
        "initial_score": 15.75,
        "initial_risk_level": "High",
        "applied_mitigations": [
            "Implemented unique user credentials with MFA for all POS terminals and Shopify administrative access.",
            "Installed a Next-Generation Firewall to segment the in-store Wi-Fi guest network from the POS payment VLAN.",
            "Deployed automated 3-2-1 encrypted cloud backup for POS sales databases and inventory data.",
            "Conducted staff phishing training and enforced dual-signoff on supplier wire changes."
        ],
        "residual_score": 5.25,
        "residual_risk_level": "Low",
        "risk_reduction_pct": 66.7,
        "results": "PCI-DSS compliance verified; zero unauthorized transactions recorded over 12 months; employee phishing click-rate reduced from 38% to under 4%."
    },
    {
        "id": "healthcare-clinic",
        "title": "Case Study 2: Healthcare Clinic ('MetroCare Family Health Center')",
        "sector": "Healthcare & Medical Services",
        "company_size": "18 Staff (5 Doctors, 7 Nurses, 6 Admin)",
        "simulated": True,
        "profile": "An outpatient family healthcare clinic managing electronic health records (EHR), digital diagnostic imaging, prescription databases, and sensitive HIPAA-regulated patient information.",
        "identified_risks": [
            {
                "category": "Ransomware",
                "description": "High threat of medical record encryption halting clinic appointments and emergency consultations.",
                "likelihood": 4,
                "impact": 5,
                "score": 20,
                "severity": "Critical",
                "rank": 1
            },
            {
                "category": "Data Breaches",
                "description": "Patient EHR records stored on local clinic server without full database encryption or remote access MFA.",
                "likelihood": 3,
                "impact": 5,
                "score": 15,
                "severity": "High",
                "rank": 2
            },
            {
                "category": "Insider Threats",
                "description": "Administrative staff possess unrestricted read/write access across all medical files with no access logging.",
                "likelihood": 3,
                "impact": 4,
                "score": 12,
                "severity": "High",
                "rank": 3
            },
            {
                "category": "Malware",
                "description": "Legacy Windows terminals connected to ultrasound equipment lacking modern EDR antivirus protection.",
                "likelihood": 3,
                "impact": 4,
                "score": 12,
                "severity": "High",
                "rank": 4
            }
        ],
        "initial_score": 14.75,
        "initial_risk_level": "High",
        "applied_mitigations": [
            "Deployed HIPAA-compliant immutable daily offsite cloud backup with 1-hour recovery time objective (RTO).",
            "Enforced Role-Based Access Control (RBAC) so administrative staff only view demographic info without full medical history.",
            "Enforced AES-256 BitLocker full-disk encryption on all clinic doctor laptops and workstations.",
            "Isolated legacy diagnostic ultrasound equipment on a separate VLAN behind a dedicated hardware firewall."
        ],
        "residual_score": 4.50,
        "residual_risk_level": "Low",
        "risk_reduction_pct": 69.5,
        "results": "Passed independent HIPAA cybersecurity audit; successfully simulated disaster recovery restoration in 42 minutes; eliminated unencrypted storage exposure."
    },
    {
        "id": "small-it-company",
        "title": "Case Study 3: Small IT Company ('NovaTech Cloud Solutions')",
        "sector": "Technology & Software Development",
        "company_size": "35 Software Engineers & DevOps Consultants",
        "simulated": True,
        "profile": "A boutique software consultancy developing cloud-native SaaS applications for enterprise clients. Engineers manage source code repositories on GitHub, AWS infrastructure environments, and customer production API keys.",
        "identified_risks": [
            {
                "category": "Insider Threats",
                "description": "Contract developers having broad read/write access to customer production database credentials and AWS keys.",
                "likelihood": 4,
                "impact": 5,
                "score": 20,
                "severity": "Critical",
                "rank": 1
            },
            {
                "category": "Phishing",
                "description": "Sophisticated spear-phishing targeting DevOps engineers to harvest GitHub tokens and AWS root credentials.",
                "likelihood": 4,
                "impact": 4,
                "score": 16,
                "severity": "High",
                "rank": 2
            },
            {
                "category": "Weak Passwords",
                "description": "Staging servers and staging databases utilizing static, shared passwords among development squads.",
                "likelihood": 4,
                "impact": 4,
                "score": 16,
                "severity": "High",
                "rank": 3
            },
            {
                "category": "Data Breaches",
                "description": "Accidental exposure of hardcoded database API tokens committed into Git version control repositories.",
                "likelihood": 3,
                "impact": 4,
                "score": 12,
                "severity": "High",
                "rank": 4
            }
        ],
        "initial_score": 16.00,
        "initial_risk_level": "High",
        "applied_mitigations": [
            "Mandated Hardware FIDO2 / Authenticator MFA for all GitHub and AWS Console logins with zero SMS MFA fallback.",
            "Integrated automated secret scanning (GitGuardian / TruffleHog) into CI/CD pipelines to block secret commits.",
            "Implemented Least Privilege AWS IAM policies with temporary role-based credentials (STS) replacing static keys.",
            "Enforced centralized corporate password manager (1Password) with automated credential rotation for all environments."
        ],
        "residual_score": 4.00,
        "residual_risk_level": "Low",
        "risk_reduction_pct": 75.0,
        "results": "Achieved SOC 2 Type I readiness; zero secret leakage incidents across 450+ Git commits; average onboarding/offboarding credential revocation time reduced to 3 minutes."
    }
]

# ============================================================================
# 3. SME CYBERSECURITY BEST PRACTICES (Requirement 6)
# ============================================================================
SME_BEST_PRACTICES = [
    {
        "id": 1,
        "title": "Mandatory Multi-Factor Authentication (MFA)",
        "priority": "Critical",
        "category": "Access Control",
        "summary": "Enable MFA on all business email accounts (Microsoft 365 / Google Workspace), cloud storage, VPNs, accounting software, and administrative portals. MFA stops over 99% of automated credential attacks.",
        "nist_function": "Protect (PR.AC)"
    },
    {
        "id": 2,
        "title": "Enforce 3-2-1 Automated Immutable Backups",
        "priority": "Critical",
        "category": "Data Recovery",
        "summary": "Maintain 3 copies of vital business data on 2 different media types, with at least 1 copy stored securely offsite or in an air-gapped/immutable cloud repository to guarantee recovery against ransomware.",
        "nist_function": "Recover (RC.RP)"
    },
    {
        "id": 3,
        "title": "Continuous Employee Cybersecurity Awareness Training",
        "priority": "High",
        "category": "Human Defense",
        "summary": "Conduct quarterly interactive training and monthly simulated phishing exercises for all employees. Staff are your frontline defense against social engineering and wire fraud.",
        "nist_function": "Protect (PR.AT)"
    },
    {
        "id": 4,
        "title": "Apply Principle of Least Privilege & RBAC",
        "priority": "High",
        "category": "Access Management",
        "summary": "Grant employees access only to the data and applications necessary for their specific role. Never permit daily administrative tasks to be run under root or local admin accounts.",
        "nist_function": "Protect (PR.AC)"
    },
    {
        "id": 5,
        "title": "Next-Generation Firewalls & Network Segmentation",
        "priority": "High",
        "category": "Network Security",
        "summary": "Deploy a managed firewall to isolate payment terminals (POS), operational workstations, and guest Wi-Fi networks into distinct VLANs to prevent lateral malware propagation.",
        "nist_function": "Protect (PR.PT)"
    },
    {
        "id": 6,
        "title": "Automated Software Patching & Vulnerability Management",
        "priority": "High",
        "category": "System Maintenance",
        "summary": "Configure automated updates for operating systems, browsers, VPN endpoints, and third-party software. Patch critical vulnerabilities within 14 days of public release.",
        "nist_function": "Protect (PR.MA)"
    },
    {
        "id": 7,
        "title": "Deploy Managed Endpoint Detection & Response (EDR / Antivirus)",
        "priority": "High",
        "category": "Threat Detection",
        "summary": "Replace basic legacy signature antivirus with next-generation EDR on all company endpoints for real-time behavioral malware detection, ransomware blocking, and instant device isolation.",
        "nist_function": "Detect (DE.CM)"
    },
    {
        "id": 8,
        "title": "Full-Disk and In-Transit Encryption",
        "priority": "Medium",
        "category": "Data Protection",
        "summary": "Turn on BitLocker (Windows) or FileVault (macOS) on all laptops to render stolen hardware unreadable. Enforce HTTPS / TLS 1.3 for all internal and external web communication.",
        "nist_function": "Protect (PR.DS)"
    },
    {
        "id": 9,
        "title": "Formal Incident Response & Recovery Checklist",
        "priority": "Medium",
        "category": "Incident Response",
        "summary": "Maintain a documented, laminated emergency contact sheet with your IT provider, legal counsel, cyber insurer, and data protection authority. Test data restoration twice per year.",
        "nist_function": "Respond (RS.RP) / Recover (RC.RP)"
    },
    {
        "id": 10,
        "title": "Maintain a Hardware & Software Asset Inventory",
        "priority": "Medium",
        "category": "Asset Management",
        "summary": "You cannot protect what you do not know you have. Maintain an up-to-date registry of all connected devices, cloud SaaS subscriptions, and remote access accounts.",
        "nist_function": "Identify (ID.AM)"
    }
]

# ============================================================================
# 4. ADVANCED RISK EVALUATION LOGIC (Requirement 3)
# ============================================================================
def get_severity(score: int) -> str:
    """Return severity label based on calculated Risk Score (Likelihood x Impact)."""
    if score >= 19:
        return "Critical"
    elif score >= 12:
        return "High"
    elif score >= 6:
        return "Medium"
    else:
        return "Low"

def map_threat_to_nist(category: str, description: str) -> str:
    """Map a threat description to the most relevant NIST CSF domain."""
    text = f"{category} {description}".lower()
    if any(k in text for k in ["backup", "restore", "recovery", "disaster"]):
        return "Recover"
    elif any(k in text for k in ["monitor", "detect", "siem", "alert", "log", "antivirus", "edr", "anomaly"]):
        return "Detect"
    elif any(k in text for k in ["incident", "response", "contain", "mitigate", "breach reaction"]):
        return "Respond"
    elif any(k in text for k in ["password", "mfa", "firewall", "train", "access", "encrypt", "patch", "phish"]):
        return "Protect"
    elif any(k in text for k in ["asset", "inventory", "govern", "policy", "audit", "compliance"]):
        return "Identify"
    return "Protect"

def evaluate_threats(threats: List[Dict[str, Any]], controls: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Evaluates each threat:
    - Calculates Risk Score = Likelihood x Impact
    - Assigns Severity (Low, Medium, High, Critical)
    - Maps to NIST CSF domain
    - Generates automatic mitigation recommendation
    - Computes Priority Ranking (Rank #1, #2, ...)
    """
    if controls is None:
        controls = []

    implemented_control_names = [
        c.get("name", "").lower() for c in controls if c.get("implemented", False)
    ]
    implemented_control_text = " ".join([
        f"{c.get('name', '')} {c.get('description', '')}".lower()
        for c in controls if c.get("implemented", False)
    ])

    def parse_metric(val):
        if isinstance(val, (int, float)):
            return max(1, min(5, int(val)))
        if isinstance(val, str):
            v = val.strip().lower()
            if v == "critical": return 5
            if v == "high": return 4
            if v == "medium": return 3
            if v == "low": return 2
            try:
                return max(1, min(5, int(float(v))))
            except ValueError:
                return 1
        return 1

    evaluated = []
    for t in threats:
        likelihood = parse_metric(t.get("likelihood", 1))
        impact = parse_metric(t.get("impact", 1))
        score = likelihood * impact
        severity = get_severity(score)
        category = t.get("category", "General Security")
        desc = t.get("description", "")
        nist_domain = map_threat_to_nist(category, desc)

        # Automatic mitigation determination
        mitigation = recommend_solution_for_threat(category, desc, implemented_control_names, implemented_control_text)

        evaluated.append({
            "category": category,
            "description": desc,
            "likelihood": likelihood,
            "impact": impact,
            "score": score,
            "severity": severity,
            "nist_domain": nist_domain,
            "mitigation": mitigation
        })

    # Sort descending by score for priority ranking
    evaluated.sort(key=lambda x: x["score"], reverse=True)
    for idx, item in enumerate(evaluated):
        item["rank"] = idx + 1

    return evaluated

# ============================================================================
# 5. AUTOMATIC RISK MITIGATION ENGINE (Requirement 4)
# ============================================================================
def recommend_solution_for_threat(
    category: str,
    description: str,
    implemented_names: List[str],
    implemented_text: str
) -> Dict[str, Any]:
    """
    Recommend suitable solutions for identified threats including:
    Firewalls, MFA, Data Backup, Antivirus, Employee Training, and Access Control.
    """
    text = f"{category} {description}".lower()

    if "phish" in text or "social engineer" in text:
        primary_control = "Employee Training & MFA"
        solution = "Deploy simulated phishing campaigns and enforce FIDO2/app-based MFA on all email accounts with DMARC/SPF gateway filtering."
        suggested_tools = ["Employee Training", "Multi-Factor Authentication (MFA)", "Email Security Gateway"]
        control_type = "Administrative & Technical"
        is_covered = any(k in implemented_text for k in ["train", "awareness", "phish", "mfa"])
    elif "ransom" in text or "extort" in text:
        primary_control = "Data Backup & EDR Antivirus"
        solution = "Implement automated 3-2-1 immutable cloud backups, deploy managed EDR antivirus, and restrict internal lateral movement."
        suggested_tools = ["Data Backup", "Antivirus / EDR", "Firewalls", "Access Control"]
        control_type = "Technical"
        is_covered = any(k in implemented_text for k in ["backup", "restore", "edr", "antivirus"])
    elif "insider" in text or "privilege" in text or "unauthorized access" in text:
        primary_control = "Access Control & Audit Logging"
        solution = "Apply Role-Based Access Control (RBAC), enforce least privilege, and implement user activity monitoring with strict offboarding."
        suggested_tools = ["Access Control", "Activity Monitoring", "Employee Training"]
        control_type = "Technical & Administrative"
        is_covered = any(k in implemented_text for k in ["access control", "rbac", "least privilege", "audit"])
    elif "malware" in text or "virus" in text or "trojan" in text or "keylogger" in text:
        primary_control = "Antivirus & Firewall"
        solution = "Install managed Next-Gen Antivirus/EDR with real-time heuristic monitoring and block malicious outbound domains via Next-Gen Firewall."
        suggested_tools = ["Antivirus / EDR", "Firewalls", "Patch Management"]
        control_type = "Technical"
        is_covered = any(k in implemented_text for k in ["antivirus", "edr", "firewall", "endpoint"])
    elif "password" in text or "credential" in text:
        primary_control = "Multi-Factor Authentication & Password Manager"
        solution = "Mandate an Enterprise Password Manager, enforce 14+ character complex passphrases, and require MFA for all logins."
        suggested_tools = ["Multi-Factor Authentication (MFA)", "Password Manager", "Access Control"]
        control_type = "Technical & Administrative"
        is_covered = any(k in implemented_text for k in ["mfa", "password manager", "multi-factor"])
    elif "data breach" in text or "leak" in text or "exfiltrat" in text or "unencrypt" in text:
        primary_control = "Data Encryption & Firewalls"
        solution = "Implement AES-256 encryption for data at rest, enforce TLS 1.3 for data in transit, and isolate databases behind a Web Application Firewall."
        suggested_tools = ["Data Backup", "Firewalls", "Access Control", "Encryption"]
        control_type = "Technical"
        is_covered = any(k in implemented_text for k in ["encrypt", "firewall", "dlp", "waf"])
    else:
        primary_control = "Defense-in-Depth Core Controls"
        solution = "Deploy core security hygiene: Next-Gen Firewall, MFA, automated daily backups, managed antivirus, and staff cybersecurity training."
        suggested_tools = ["Firewalls", "Multi-Factor Authentication (MFA)", "Data Backup", "Antivirus / EDR", "Employee Training", "Access Control"]
        control_type = "Technical & Administrative"
        is_covered = len(implemented_names) > 0

    return {
        "primary_control": primary_control,
        "recommended_solution": solution,
        "suggested_tools": suggested_tools,
        "control_type": control_type,
        "status": "Mitigated / Implemented" if is_covered else "Action Required / Unmitigated",
        "is_covered": is_covered,
        "cost_effort": "Low to Medium for SMEs"
    }

def aggregate_mitigation_plan(evaluated_threats: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate a clean deduplicated list of mitigation actions for the assessment."""
    plan = []
    seen = set()
    for t in evaluated_threats:
        mit = t.get("mitigation", {})
        key = mit.get("primary_control")
        if key and key not in seen:
            seen.add(key)
            plan.append({
                "control_name": key,
                "solution": mit.get("recommended_solution"),
                "control_type": mit.get("control_type"),
                "suggested_tools": mit.get("suggested_tools", []),
                "status": mit.get("status"),
                "cost_effort": mit.get("cost_effort"),
                "associated_threat": t.get("category"),
                "threat_severity": t.get("severity")
            })
    return plan

# ============================================================================
# 6. NIST CSF MAPPING & DOMAIN CLASSIFICATION (Requirement 2)
# ============================================================================
NIST_DOMAINS = ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"]

def classify_domains(controls: List[Dict[str, Any]], framework: str = "NIST CSF 2.0") -> Dict[str, float]:
    """
    Calculates percentage coverage based on implemented controls per NIST CSF 2.0 function
    or ISO domains.
    For each function: score = (implemented controls / total controls in that function) * 100.
    A function with no controls scores 0.0.
    """
    if framework and "ISO" in framework.upper():
        domains = {
            "Organizational": 0,
            "People": 0,
            "Physical": 0,
            "Technological": 0
        }
        domain_totals = {d: 0 for d in domains}
        for c in controls:
            text = f"{c.get('name', '')} {c.get('description', '')}".lower()
            assigned = "Technological"
            if any(k in text for k in ["train", "people", "staff", "employee", "phish"]):
                assigned = "People"
            elif any(k in text for k in ["physic", "lock", "cctv", "door", "building"]):
                assigned = "Physical"
            elif any(k in text for k in ["policy", "govern", "audit", "compliance", "lead"]):
                assigned = "Organizational"

            domain_totals[assigned] += 1
            if c.get("implemented", False):
                domains[assigned] += 1

        result = {}
        for d in domains:
            tot = domain_totals[d]
            result[d] = round((domains[d] / tot * 100), 2) if tot > 0 else 0.0
        return result

    # NIST CSF 2.0 (All 6 Functions: Govern, Identify, Protect, Detect, Respond, Recover)
    domain_counts = {d: 0 for d in NIST_DOMAINS}
    domain_totals = {d: 0 for d in NIST_DOMAINS}

    for c in controls:
        raw_func = c.get("nist_function") or "Protect"
        func = raw_func.strip().capitalize()
        if func not in domain_totals:
            func = "Protect"

        domain_totals[func] += 1
        if c.get("implemented", False):
            domain_counts[func] += 1

    result = {}
    for d in NIST_DOMAINS:
        tot = domain_totals[d]
        result[d] = round((domain_counts[d] / tot * 100), 2) if tot > 0 else 0.0

    return result

# ============================================================================
# 7. OVERALL METRIC & FINDINGS GENERATION (Requirements 3 & 6)
# ============================================================================
def calculate_risk_score(threats: List[Dict[str, Any]]) -> float:
    """Calculate overall risk score from threats (average of Likelihood x Impact)."""
    if not threats:
        return 0.0

    def parse_m(val):
        if isinstance(val, (int, float)):
            return max(1, min(5, int(val)))
        if isinstance(val, str):
            v = val.strip().lower()
            if v == "critical": return 5
            if v == "high": return 4
            if v == "medium": return 3
            if v == "low": return 2
            try:
                return max(1, min(5, int(float(v))))
            except ValueError:
                return 1
        return 1

    total = sum(parse_m(t.get("likelihood", 1)) * parse_m(t.get("impact", 1)) for t in threats)
    return round(total / len(threats), 2)

def generate_findings(
    system_name: str,
    overall_score: float,
    evaluated_threats: List[Dict[str, Any]],
    domain_scores: Dict[str, float],
    controls: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Generates structured assessment findings and prioritized recommendations.
    """
    critical_threats = [t for t in evaluated_threats if t.get("severity") == "Critical"]
    high_threats = [t for t in evaluated_threats if t.get("severity") == "High"]
    unmitigated = [t for t in evaluated_threats if not t.get("mitigation", {}).get("is_covered", False)]

    # Key observations
    findings_list = []
    if critical_threats:
        findings_list.append(
            f"CRITICAL VULNERABILITY: Identified {len(critical_threats)} Critical-severity threat(s) (including {critical_threats[0]['category']}) capable of causing catastrophic business shutdown."
        )
    if unmitigated:
        findings_list.append(
            f"SECURITY GAP: {len(unmitigated)} threat(s) currently lack active or verified mitigation controls in place."
        )

    # Domain coverage checks
    for domain, score in domain_scores.items():
        if score < 40.0:
            findings_list.append(
                f"NIST CSF DEFICIENCY: '{domain}' function shows inadequate implementation coverage ({score}%). Immediate control uplift required."
            )

    if not findings_list:
        findings_list.append(
            f"BASELINE SATISFACTORY: System '{system_name}' displays robust defensive coverage across primary threat vectors, with ongoing monitoring advised."
        )

    # Prioritized actionable recommendations
    recommendations = []
    recommendations.append({
        "phase": "Immediate (Days 1 - 30)",
        "action": "Enforce Multi-Factor Authentication (MFA) across all administrative and remote portals; verify offline air-gapped backups."
    })
    recommendations.append({
        "phase": "Short-Term (Days 31 - 60)",
        "action": "Deploy Managed EDR Antivirus on all workstations and segment network via Next-Gen Firewalls."
    })
    recommendations.append({
        "phase": "Ongoing (Continuous)",
        "action": "Conduct monthly employee phishing simulation training and quarterly incident response tabletop drills."
    })

    return {
        "summary": f"Assessment for system '{system_name}' resulted in an overall risk score of {overall_score}/25 ({get_severity(int(overall_score))} Risk Profile).",
        "risk_level": get_severity(int(overall_score)),
        "critical_count": len(critical_threats),
        "high_count": len(high_threats),
        "unmitigated_count": len(unmitigated),
        "findings": findings_list,
        "recommendations": recommendations
    }

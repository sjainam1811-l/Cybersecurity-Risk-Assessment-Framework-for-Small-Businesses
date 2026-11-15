# Cybersecurity Risk Assessment Framework for Small Businesses

> **Minor Project 1 — Group C (Academic Year 2026–2027)**  
> Developed by **Jainam Shah** and **Mahi Patel**

A practical, lightweight cybersecurity risk assessment platform designed specifically for Small and Medium Enterprises (SMEs). Aligned with the **NIST Cybersecurity Framework (CSF) 2.0** and **ISO/IEC 27001**, enabling small businesses to evaluate, quantify, and visualize cyber risks effectively.

---

## 🚀 Quick Start (Single Command)

You can launch all services (**MongoDB + FastAPI Backend + React Frontend**) with **one single command** from the project root:

### In Windows Command Prompt (CMD):
```cmd
run
```
*(or double-click `run.bat`)*

**What happens automatically:**
1. Starts **MongoDB** on `mongodb://127.0.0.1:27017`
2. Starts **FastAPI Backend** on `http://127.0.0.1:8000`
3. Starts **React Frontend** on `http://localhost:3000`
4. Automatically opens your default web browser to the dashboard!

---

### To Stop All Services:
```cmd
stop
```
*(or double-click `stop.bat`)*

---

### Alternative CLI Commands:
```bash
# Using Python:
python run.py       # Start all services
python stop.py      # Stop all services

# Using npm:
npm start           # Start all services
npm run stop        # Stop all services
```

---

## 🌐 Application Endpoints

| Service | URL | Operational Description |
|---|---|---|
| **Web Dashboard** | `http://localhost:3000` | Interactive React frontend UI |
| **API Documentation** | `http://127.0.0.1:8000/docs` | Swagger interactive API docs |
| **Backend REST API** | `http://127.0.0.1:8000/api/v1` | FastAPI service endpoints |
| **MongoDB Database** | `mongodb://127.0.0.1:27017` | Local NoSQL document store |

---

## ✨ Key Features

- **SME Cyber Risks Knowledge Base:** Pre-researched database of the 6 most common SME threats (Phishing, Ransomware, Weak Passwords, Malware, Data Breaches, Insider Threats).
- **NIST CSF 2.0 Alignment:** Full coverage of all 6 core functions: **Govern, Identify, Protect, Detect, Respond, Recover**.
- **Quantitative 5×5 Risk Metric:** Threat scoring formula `Risk = Likelihood (1-5) × Impact (1-5)` mapping to Low, Medium, High, and Critical severity levels.
- **Interactive Visualizations:** 6-axis NIST CSF radar chart and 5×5 color-coded risk heatmaps.
- **Automated Mitigation Engine:** Automatically recommends technical countermeasures (MFA, 3-2-1 Backups, EDR Antivirus, VLANs) based on identified threats.
- **Three SME Case Studies:** Realistically simulated validation scenarios for Retail POS, Healthcare Clinic, and Small IT Company.
- **Ten Prioritized Best Practices:** Actionable cyber hygiene checklist ranked by urgency.
- **Executive PDF Report Export:** Download a professional single-page executive security assessment report.
- **Secure Authentication:** Account creation with password confirmation and stateless JWT tokens.

---

## 📁 Project Structure

```
Cybersecurity-Risk-Assessment-Framework-for-Small-Businesses/
│
├── backend/                  # Python FastAPI REST API
│   ├── app/
│   │   ├── api/v1/           # API routes (auth, assessments, export)
│   │   ├── core/             # Configuration & JWT security
│   │   ├── db/               # MongoDB Motor connection & Pydantic schemas
│   │   ├── services/         # Risk model & NIST CSF 2.0 scoring logic
│   │   └── main.py           # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   └── start.sh              # Unix startup script
│
├── frontend/                 # React.js SPA Application
│   ├── public/               # Static assets & HTML index
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (Navbar, RadarChart, HeatMap)
│   │   ├── data/             # Threats research knowledge base (threats.js)
│   │   ├── pages/            # App pages (Dashboard, SMEResearch, NISTFramework, etc.)
│   │   └── App.js            # Router switchboard
│   └── package.json          # Node.js dependencies & scripts
│
├── Photos/                   # Application Screenshots
│   ├── 1.png                 # Create Account Screen
│   ├── 1.1.png               # Sign In Screen
│   ├── 2.png                 # Assessment Dashboard
│   ├── 3.png                 # Common SME Risks Research
│   ├── 4.png                 # NIST CSF 2.0 Framework
│   ├── 5.png                 # Validation Case Studies
│   ├── 6.png                 # SME Best Practices
│   └── 7.pdf                 # Sample Assessment Audit Report
│
├── reports/                  # Academic Project Deliverables
│   ├── Minor_Project_1_Report.docx   # Word Report
│   ├── Minor_Project_1_Report.pdf    # Compiled PDF Report
│   └── SME Risk Framework.pptx       # Presentation Slides
│
├── .gitignore                # Git ignore configuration
├── package.json              # Root npm launcher scripts
├── README.md                 # Project documentation
├── run.bat                   # 1-Click Windows CMD service launcher
├── run.py                    # Cross-platform Python service launcher
├── stop.bat                  # 1-Click Windows CMD service stopper
└── stop.py                   # Cross-platform Python service stopper
```

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Tailwind CSS, Chart.js, Lucide Icons, Axios
- **Backend:** Python 3.13, FastAPI, Uvicorn, Motor (AsyncIOMotorClient), ReportLab
- **Database:** MongoDB Community Server 7.0
- **Security:** Passlib (Bcrypt password hashing), PyJWT (HS256 tokens)

---

## 👥 Authors

- **Jainam Shah** — `sjainam1811@gmail.com`
- **Mahi Patel** — `mahip290905@gmail.com`
- **Group:** C  
- **Academic Year:** 2026–2027

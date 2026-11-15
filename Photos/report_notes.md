# Minor Project 1 Report Documentation & Verification Notes

**Project Title:** Minor Project 1: Cybersecurity Risk Assessment Framework for Small Businesses (SME Risk Framework)  
**Authors:** Mahi Patel (`mahip290905@gmail.com`), Jainam Shah (`sjainam1811@gmail.com`)  
**Group:** C  
**Academic Year:** 2026–2027  
**Curriculum Allotment:** Naviotech Cyber Security Project List (September 2026)  
**Deliverables Generated:**
1. `report/Minor_Project_1_Report.docx` (Microsoft Word Document, A4, Times New Roman, Double-border frame)
2. `report/Minor_Project_1_Report.pdf` (Compiled PDF Document converted directly via Microsoft Word COM engine)
3. `report/report_notes.md` (Technical implementation and verification documentation)
4. Mirrored copies preserved in: `C:\Users\uasha\Videos\minor 1\`

---

## 1. Compliance with Strict Document Formatting Standards

- **Paper Size & Margins:** Standard ISO A4 (210 mm × 297 mm, 11906 × 16838 dxa) with 2.54 cm (1.0 inch / 1440 dxa) margins on all four sides.
- **Double-Line Border Frame:** Configured on all document sections using WordprocessingML XML:
  ```xml
  <w:pgBorders w:offsetFrom="page">
    <w:top w:val="thinThickThinSmallGap" w:sz="24" w:space="24" w:color="auto" />
    <w:left w:val="thinThickThinSmallGap" w:sz="24" w:space="24" w:color="auto" />
    <w:bottom w:val="thinThickThinSmallGap" w:sz="24" w:space="24" w:color="auto" />
    <w:right w:val="thinThickThinSmallGap" w:sz="24" w:space="24" w:color="auto" />
  </w:pgBorders>
  ```
- **Typography & Font:** Times New Roman applied across all text elements.
  - **Cover Page Titles:** 16 pt Bold, Uppercase (`MAJOR PROJECT REPORT`, `CYBERSECURITY RISK ASSESSMENT FRAMEWORK FOR SMALL BUSINESSES`).
  - **Cover Page Metadata:** 14 pt Bold label with 14 pt Regular values.
  - **Chapter Headings:** 14 pt Bold, Uppercase, Numbered (`1. INTRODUCTION`, `2. REQUIREMENT MAPPING`, etc.).
  - **Section Subheadings:** 14 pt Bold, Title Case, Numbered (`1.1 Background`, `1.2 Problem Statement`, etc.).
  - **Body Paragraphs:** 12 pt Regular, Justified alignment, 1.5 Line Spacing, 6 pt Space After.
  - **Table Text:** 12 pt Regular (12 pt Bold for Header Row), Left/Center aligned, 1.15 line spacing.
  - **Captions:** 12 pt Centered (Above tables for `Table X.Y: ...`, Below figures for `Figure X.Y: ...`).
- **Color Discipline:** 100% black text on pure white backgrounds. No colored text, colored fills, or background shading.
- **Tone & Voice:** Technical writing voice using plain, concise English with short sentences (<20 words) and "we" perspective. Strictly free of marketing buzzwords (`comprehensive`, `robust`, `seamless`, `leverage`, `holistic`, `cutting-edge`, `blueprint`, `empirical`).

---

## 2. Page Numbering Structure

- **Section 1 (Front Matter):**
  - Cover page: Header and footer suppressed via `<w:titlePg/>` (`different_first_page_header_footer = True`).
  - Acknowledgement, Abstract, Table of Contents, List of Figures, List of Tables: Centered Roman numerals (`i`, `ii`, `iii`, `iv`, `v`, `vi`).
- **Section 2 (Main Body & Appendices):**
  - Chapters 1 through 9, References, Appendix A, and Appendix B: Centered Arabic numerals starting at `1` (`<w:pgNumType w:fmt="decimal" w:start="1"/>`).

---

## 3. Mapping to the Six Syllabus Requirements

| Requirement # | Syllabus Requirement | Implemented Code Module | Route & File Location | Document Verification Point |
|---|---|---|---|---|
| **Req 1** | Research common cybersecurity risks in SMEs (phishing, ransomware, insider threats). | Knowledge base of 6 SME threats with Likelihood, Impact, and NIST tags. | `GET /api/v1/sme-research`<br>`frontend/src/data/threats.js` | Table 4.1, Figure 4.1 |
| **Req 2** | Develop a risk assessment model (NIST Cybersecurity Framework). | Six-function NIST CSF 2.0 model (Govern, Identify, Protect, Detect, Respond, Recover) + 4 implementation tiers. | `backend/app/services/risk_model.py`<br>`frontend/src/pages/NISTFramework.jsx` | Table 4.2, Figure 4.2 |
| **Req 3** | Create a risk evaluation metric to rank threats by severity and impact. | Quantitative 5x5 Matrix ($Risk = Likelihood \times Impact$, 1–25 scale) with Low, Medium, High, Critical bands. | `evaluate_threats()`, `get_severity()` in `risk_model.py` | Table 4.3 (5x5 Matrix), Table 6.1 |
| **Req 4** | Propose risk mitigation strategies (firewalls, MFA, employee training). | Automated threat-to-safeguard recommendation rule engine. | `recommend_solution_for_threat()` in `risk_model.py` | Table 4.4, Figure 4.1 |
| **Req 5** | Validate the model with case studies on different businesses. | Three simulated SME scenarios: Retail Shop, Healthcare Clinic, Small IT Company with residual risk scoring. | `GET /api/v1/case-studies`<br>`frontend/src/pages/CaseStudies.jsx` | Table 4.5, Figure 4.3, Table 7.1 |
| **Req 6** | Document findings and provide best practices for SME cybersecurity. | Ten prioritized SME cyber hygiene best practices + executive single-page PDF report generator. | `GET /api/v1/best-practices`<br>`backend/app/api/v1/routes_export.py` | Table 4.6, Figure 4.4, Figure 5.4 |

---

## 4. Screenshot Sources and Image Evidence

All figures incorporated into the final Word document and PDF were captured from the running application:

1. **Figure 4.1: SME Cyber Risk Research Knowledge Base**  
   - Source: `C:\Users\uasha\Videos\minor 1\3.png` (1921 × 2010 px)
   - Route: `http://localhost:3000/sme-research`
   - Shows: Six ranked threat cards with computed severity scores, search filter, and mitigation panels.

2. **Figure 4.2: NIST Cybersecurity Framework 2.0 Browser View**  
   - Source: `C:\Users\uasha\Videos\minor 1\4.png` (1921 × 1542 px)
   - Route: `http://localhost:3000/nist-framework`
   - Shows: CSF 2.0 function tabs (Govern to Recover), subcategories, and four implementation tiers.

3. **Figure 4.3: SME Case Studies Evaluation Screen**  
   - Source: `C:\Users\uasha\Videos\minor 1\5.png` (1921 × 2288 px)
   - Route: `http://localhost:3000/case-studies`
   - Shows: Three business validation profiles comparing initial risk scores against mitigated residual risk.

4. **Figure 4.4: SME Cybersecurity Best Practices Screen**  
   - Source: `C:\Users\uasha\Videos\minor 1\6.png` (1921 × 1822 px)
   - Route: `http://localhost:3000/best-practices`
   - Shows: Ten prioritized cyber hygiene guidelines with operational actions and NIST CSF tags.

5. **Figure 5.1: User Account Registration Screen**  
   - Source: `C:\Users\uasha\Videos\minor 1\1.png` (1921 × 840 px)
   - Route: `http://localhost:3000/register`
   - Shows: Account creation form with email, password, and confirm password fields.

6. **Figure 5.2: User Sign In Screen**  
   - Source: `C:\Users\uasha\Videos\minor 1\1.1.png` (1921 × 840 px)
   - Route: `http://localhost:3000/login`
   - Shows: Clean login card with email and password inputs.

7. **Figure 5.3: Risk Assessment Dashboard with Radar Chart and Heatmap**  
   - Source: `C:\Users\uasha\Videos\minor 1\2.png` (1921 × 2704 px)
   - Route: `http://localhost:3000/dashboard`
   - Shows: Full interactive assessment entry form, 6-axis NIST CSF radar chart, threat heatmap, and assessment history.

8. **Figure 5.4: Single-Page Executive PDF Security Assessment Report Preview**  
   - Source: `downloaded_test_preview.png` (1224 × 1584 px)
   - Route: `GET /api/v1/assessment/{id}/pdf`
   - Shows: ReportLab-generated executive PDF with system metadata, threat evaluation rankings, CSF coverage, and roadmap.

---

## 5. Algorithmic Verification & Real Model Runs

The numerical calculations presented in Chapter 6 (Table 6.1) were executed directly through `backend/app/services/risk_model.py` to confirm exact mathematical fidelity:

- **Test Case 1 (Single Critical Threat with Recover Control):**
  - Input Threat: Ransomware ($L=5, I=5$)
  - Input Controls: Data Backup (Implemented, Recover function), EDR Antivirus (Not Implemented, Detect function)
  - Calculated Score: $5 \times 5 = 25.0$ (Critical)
  - Function Coverage: Recover = $100.0\%$, Detect = $0.0\%$, Govern/Identify/Protect/Respond = $0.0\%$
  - Result: Verified identical output.

- **Test Case 2 (Dual High Threats with Protect Controls):**
  - Input Threats: Phishing ($L=4, I=4 \rightarrow 16$), Weak Passwords ($L=3, I=4 \rightarrow 12$)
  - Input Controls: Multi-Factor Authentication (Implemented, Protect), Employee Training (Implemented, Protect)
  - Calculated Overall Score: $\frac{16 + 12}{2} = 14.0$ (High)
  - Function Coverage: Protect = $100.0\%$
  - Mitigation Status: Both threats marked as mitigated by active controls.
  - Result: Verified identical output.

- **Test Case 3 (Low-Risk Threat with Perimeter Control):**
  - Input Threat: Malware ($L=1, I=2 \rightarrow 2$)
  - Input Control: Perimeter Firewall (Implemented, Protect)
  - Calculated Overall Score: $2.0$ (Low)
  - Function Coverage: Protect = $100.0\%$
  - Result: Verified identical output.

---

## 6. Open Source Attribution and Student Contributions

- **Base Open-Source Project:**
  - Author: Abdul Matheen (`abdmath`)
  - Repository: `https://github.com/abdmath/Security-Risk-Assessment-Dashboard`
  - License: MIT License (Copyright (c) 2025 Abdul Matheen)

- **Student Engineering Additions (Group C):**
  1. **SME Risk Research Knowledge Base:** Researched and implemented the 6 common SME threats, Likelihood × Impact scores, and NIST tags.
  2. **NIST CSF 2.0 Integration:** Upgraded model to CSF 2.0, adding the "Govern" function to domain scoring, radar charts, and PDF reporting.
  3. **Strict 5x5 Risk Evaluation Metric:** Formulated the Likelihood (1-5) × Impact (1-5) scoring formula with Low, Medium, High, and Critical severity bands.
  4. **Automated Mitigation Recommender:** Engineered the `recommend_solution_for_threat()` rule engine linking controls to threats.
  5. **Three SME Case Studies:** Authored and validated three simulated industry scenarios (Retail, Health, IT) with residual score equations.
  6. **Ten SME Best Practices Checklist:** Formulated prioritized cyber hygiene controls with NIST CSF category tags.
  7. **Complete UI Redesign:** Replaced legacy layout with a dark theme (#121316), orange accents (#F2511B), and responsive navigation.
  8. **Single-Page Executive PDF Report:** Built a custom ReportLab PDF compiler for single-page executive audit reports.
  9. **Authentication & Lifecycle Automation:** Added confirm password validation, persistent login state, and single-click startup scripts (`run.bat`, `stop.bat`).

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from app.db import database as db
from bson import ObjectId
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from app.services import risk_model

router = APIRouter()

def convert_mongo_types(data: dict):
    """Convert ObjectId and datetime to strings recursively."""
    def convert(value):
        if isinstance(value, ObjectId):
            return str(value)
        elif isinstance(value, datetime):
            return value.isoformat()
        elif isinstance(value, dict):
            return {k: convert(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [convert(item) for item in value]
        else:
            return value

    return convert(data)

# JSON export route preserved for API compatibility
@router.get("/assessment/{id}/json")
async def export_json(id: str):
    try:
        assessment = await db.db.assessments.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid assessment ID format")

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    converted = convert_mongo_types(assessment)
    return JSONResponse(content=converted)

# HIGH-PRECISION SINGLE-PAGE PDF REPORT EXPORT
@router.get("/assessment/{id}/pdf")
async def export_pdf(id: str):
    try:
        assessment = await db.db.assessments.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid assessment ID format")

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    converted = convert_mongo_types(assessment)

    # Extract or compute required fields
    system_name = converted.get("system_name", "Enterprise System")
    criticality = str(converted.get("criticality", "Medium")).capitalize()
    framework = converted.get("framework", "NIST CSF 2.0")
    if framework == "NIST":
        framework = "NIST CSF 2.0"
    created_at = converted.get("created_at", datetime.utcnow().isoformat())
    overall_score = float(converted.get("overall_score", 0.0))
    risk_level = converted.get("risk_level") or risk_model.get_severity(int(overall_score))

    threats = converted.get("threats", [])
    controls = converted.get("controls", [])

    # Evaluate threats and mitigations
    threat_eval = converted.get("threat_evaluation")
    if not threat_eval:
        threat_eval = risk_model.evaluate_threats(threats, controls)

    mitigations = converted.get("mitigation_strategies")
    if not mitigations:
        mitigations = risk_model.aggregate_mitigation_plan(threat_eval)

    domain_scores = converted.get("domain_scores")
    if not domain_scores:
        domain_scores = risk_model.classify_domains(controls, framework)

    findings_data = converted.get("findings")
    if not findings_data or isinstance(findings_data, list):
        generated = risk_model.generate_findings(system_name, overall_score, threat_eval, domain_scores, controls)
        findings_list = findings_data if isinstance(findings_data, list) and findings_data else generated["findings"]
        recommendations = converted.get("recommendations") or generated["recommendations"]
    else:
        findings_list = findings_data.get("findings", [])
        recommendations = findings_data.get("recommendations", [])

    # Build 1-Page PDF buffer
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=24,
        leftMargin=24,
        topMargin=18,
        bottomMargin=18
    )

    styles = getSampleStyleSheet()

    # High-legibility typography styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontSize=14,
        leading=17,
        textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica-Bold"
    )
    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#64748b"),
        fontName="Helvetica"
    )
    sec_heading_style = ParagraphStyle(
        "SecHeading",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica-Bold",
        spaceBefore=7,
        spaceAfter=3
    )
    header_cell_style = ParagraphStyle(
        "HeaderCell",
        parent=styles["Normal"],
        fontSize=8,
        leading=10,
        textColor=colors.white,
        fontName="Helvetica-Bold"
    )
    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1e293b"),
        fontName="Helvetica"
    )
    body_bold = ParagraphStyle(
        "ReportBodyBold",
        parent=styles["Normal"],
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica-Bold"
    )
    badge_style = ParagraphStyle(
        "BadgeText",
        parent=styles["Normal"],
        fontSize=8.5,
        leading=10.5,
        fontName="Helvetica-Bold",
        alignment=TA_CENTER
    )
    footer_style = ParagraphStyle(
        "FooterText",
        parent=styles["Normal"],
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#64748b"),
        alignment=TA_CENTER,
        fontName="Helvetica"
    )

    story = []

    # 1. HEADER BANNER
    story.append(Paragraph("SECURITY RISK ASSESSMENT REPORT", title_style))
    story.append(Paragraph("Small &amp; Medium Enterprise (SME) Cybersecurity Risk Framework &bull; NIST CSF 2.0 Aligned", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#F2511B"), spaceAfter=5))

    # 2. SYSTEM OVERVIEW TABLE (564 pt width)
    level_color_hex = "#16a34a" # Green
    if risk_level == "Critical":
        level_color_hex = "#dc2626"
    elif risk_level == "High":
        level_color_hex = "#ea580c"
    elif risk_level == "Medium":
        level_color_hex = "#ca8a04"

    date_str = created_at[:16].replace("T", " ") if created_at else datetime.utcnow().strftime("%Y-%m-%d %H:%M")

    overview_data = [
        [
            Paragraph("<b>Target System:</b>", body_style), Paragraph(system_name, body_bold),
            Paragraph("<b>Assessment Date:</b>", body_style), Paragraph(date_str, body_style)
        ],
        [
            Paragraph("<b>Criticality Tier:</b>", body_style), Paragraph(criticality, body_style),
            Paragraph("<b>Framework Standard:</b>", body_style), Paragraph(framework, body_style)
        ],
        [
            Paragraph("<b>Overall Risk Score:</b>", body_style),
            Paragraph(f"<b>{overall_score:.2f} / 25.0</b>", body_bold),
            Paragraph("<b>Risk Severity Level:</b>", body_style),
            Paragraph(f"<font color='{level_color_hex}'><b>{risk_level.upper()}</b></font>", badge_style)
        ]
    ]

    t_overview = Table(overview_data, colWidths=[100, 182, 110, 172])
    t_overview.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_overview)
    story.append(Spacer(1, 6))

    # 3. ADVANCED RISK EVALUATION & THREAT RANKING (564 pt width)
    story.append(Paragraph("1. Advanced Risk Evaluation &amp; Threat Ranking", sec_heading_style))

    eval_table_data = [
        [
            Paragraph("Rank", header_cell_style),
            Paragraph("Threat Category &amp; Scope", header_cell_style),
            Paragraph("Likelihood", header_cell_style),
            Paragraph("Impact", header_cell_style),
            Paragraph("Score", header_cell_style),
            Paragraph("Severity", header_cell_style),
            Paragraph("NIST Function", header_cell_style)
        ]
    ]

    # Limit to top 3 threats for clean 1-page fit
    for t in threat_eval[:3]:
        rank_str = f"#{t.get('rank', 1)}"
        cat = t.get('category', 'Threat')
        desc = t.get('description', '')
        summary_text = f"<b>{cat}</b> - <font color='#475569'>{desc[:75] + ('...' if len(desc)>75 else '')}</font>"
        sev = t.get('severity', 'Medium')
        c_hex = "#16a34a"
        if sev == "Critical":
            c_hex = "#dc2626"
        elif sev == "High":
            c_hex = "#ea580c"
        elif sev == "Medium":
            c_hex = "#ca8a04"

        eval_table_data.append([
            Paragraph(rank_str, body_bold),
            Paragraph(summary_text, body_style),
            Paragraph(f"{t.get('likelihood', 1)} / 5", body_style),
            Paragraph(f"{t.get('impact', 1)} / 5", body_style),
            Paragraph(f"<b>{t.get('score', 1)}</b>", body_bold),
            Paragraph(f"<font color='{c_hex}'><b>{sev}</b></font>", body_bold),
            Paragraph(t.get('nist_domain', 'Protect'), body_style)
        ])

    t_eval = Table(eval_table_data, colWidths=[40, 195, 62, 48, 45, 56, 118])
    t_eval.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_eval)
    story.append(Spacer(1, 6))

    # 4. NIST CSF 2.0 FUNCTION COVERAGE (564 pt width)
    story.append(Paragraph("2. NIST Cybersecurity Framework (CSF 2.0) Function Coverage", sec_heading_style))

    nist_table_data = [
        [
            Paragraph("Core Function", header_cell_style),
            Paragraph("Key Safeguards &amp; Operational Scope", header_cell_style),
            Paragraph("Coverage %", header_cell_style),
            Paragraph("Status", header_cell_style)
        ]
    ]

    nist_objectives = {
        "Govern": "Strategy, policies, roles, authorities, supply chain risk oversight",
        "Identify": "Physical devices, software platforms, data assets, risk assessments",
        "Protect": "MFA, least privilege, data encryption, automatic software patching",
        "Detect": "Continuous monitoring, endpoint detection (EDR), anomaly logging",
        "Respond": "Incident management playbooks, containment, stakeholders alert",
        "Recover": "Immutable offline backups, restoration procedures, lessons learned"
    }

    all_six_functions = ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"]
    for dom in all_six_functions:
        score = float(domain_scores.get(dom, 0.0))
        st_label = "Optimal (>80%)" if score >= 80 else ("Moderate (>50%)" if score >= 50 else "Critical Gap (<50%)")
        color_tag = "#16a34a" if score >= 80 else ("#ca8a04" if score >= 50 else "#dc2626")
        nist_table_data.append([
            Paragraph(f"<b>{dom}</b>", body_bold),
            Paragraph(nist_objectives.get(dom, "Safeguards implementation"), body_style),
            Paragraph(f"<b>{score:.1f}%</b>", body_bold),
            Paragraph(f"<font color='{color_tag}'><b>{st_label}</b></font>", body_bold)
        ])

    t_nist = Table(nist_table_data, colWidths=[78, 280, 76, 130])
    t_nist.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f766e")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_nist)
    story.append(Spacer(1, 6))

    # 5. AUTOMATED RISK SAFEGUARDS (564 pt width)
    story.append(Paragraph("3. Automated Risk Safeguards &amp; Remediation Plan", sec_heading_style))

    mit_table_data = [
        [
            Paragraph("Target Threat / Risk", header_cell_style),
            Paragraph("Recommended Safeguard Solution", header_cell_style),
            Paragraph("Type", header_cell_style),
            Paragraph("Mitigation Status", header_cell_style)
        ]
    ]

    # Limit to top 2-3 mitigations for single page fit
    for m in mitigations[:3]:
        status_txt = m.get('status', 'Action Required')
        st_color = "#16a34a" if "Implemented" in status_txt else "#dc2626"
        sol_text = f"<b>{m.get('control_name', 'Control')}</b>: <font color='#475569'>{m.get('solution', '')[:95]}</font>"
        mit_table_data.append([
            Paragraph(m.get('associated_threat', 'General Threat'), body_bold),
            Paragraph(sol_text, body_style),
            Paragraph(m.get('control_type', 'Technical'), body_style),
            Paragraph(f"<font color='{st_color}'><b>{status_txt}</b></font>", body_bold)
        ])

    t_mit = Table(mit_table_data, colWidths=[110, 249, 75, 130])
    t_mit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284c7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_mit)
    story.append(Spacer(1, 6))

    # 6. FINDINGS & IMPLEMENTATION ROADMAP (2-Column Grid - 564 pt width)
    story.append(Paragraph("4. Assessment Findings &amp; Prioritized Roadmap", sec_heading_style))

    # Concise findings
    findings_bullets = ""
    for f in findings_list[:2]:
        short_f = f[:120] + ("..." if len(f) > 120 else "")
        findings_bullets += f"&bull; {short_f}<br/>"
    if not findings_bullets:
        findings_bullets = "&bull; Baseline cybersecurity configuration acceptable; ongoing monitoring recommended.<br/>"

    # Concise roadmap
    roadmap_bullets = ""
    for r in recommendations[:2]:
        roadmap_bullets += f"&bull; <b>{r.get('phase', 'Action')}:</b> {r.get('action', '')[:95]}<br/>"
    if not roadmap_bullets:
        roadmap_bullets = "&bull; <b>Immediate:</b> Deploy MFA and review backup schedules.<br/>"

    col_findings = [
        Paragraph("<b>Key Security Observations:</b>", body_bold),
        Spacer(1, 2),
        Paragraph(findings_bullets, body_style)
    ]
    col_roadmap = [
        Paragraph("<b>Implementation Milestones:</b>", body_bold),
        Spacer(1, 2),
        Paragraph(roadmap_bullets, body_style)
    ]

    t_findings = Table([[col_findings, col_roadmap]], colWidths=[282, 282])
    t_findings.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_findings)
    story.append(Spacer(1, 6))

    # 7. FOOTER
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=3))
    story.append(Paragraph(
        "Minor Project 1: Cybersecurity Risk Assessment Framework for Small Businesses &bull; Developed by Jainam Shah &amp; Mahi Patel &bull; Group C",
        footer_style
    ))

    # Build PDF document
    doc.build(story)

    buffer.seek(0)
    clean_sys = system_name.replace(" ", "_").replace("/", "_")
    filename = f"Risk_Assessment_{clean_sys}_{datetime.utcnow().strftime('%Y%m%d')}.pdf"

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

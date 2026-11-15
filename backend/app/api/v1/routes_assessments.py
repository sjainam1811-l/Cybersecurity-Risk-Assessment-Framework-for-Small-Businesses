from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from jose import jwt, JWTError
from datetime import datetime
from app.core.config import settings
from app.db import database as db
from app.db.schemas import AssessmentInput
from app.services import risk_model

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = await db.db.users.find_one({"email": email})
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


# ============================================================================
# 1. SME RISK RESEARCH ENDPOINT (Requirement 1)
# ============================================================================
@router.get("/sme-research")
async def get_sme_research():
    """Returns research on common cybersecurity risks in SMEs with business impacts."""
    return risk_model.SME_THREATS_RESEARCH


# ============================================================================
# 2. BUSINESS CASE STUDIES ENDPOINT (Requirement 5)
# ============================================================================
@router.get("/case-studies")
async def get_case_studies():
    """Returns simulated SME case studies (Retail Shop, Healthcare Clinic, Small IT Company)."""
    return risk_model.SME_CASE_STUDIES


# ============================================================================
# 3. SME BEST PRACTICES ENDPOINT (Requirement 6)
# ============================================================================
@router.get("/best-practices")
async def get_best_practices():
    """Returns essential SME cybersecurity best practices aligned with NIST CSF."""
    return risk_model.SME_BEST_PRACTICES


# ============================================================================
# 4. ADVANCED RISK ASSESSMENT (Requirements 2, 3, 4, 6)
# ============================================================================
@router.post("/assess")
async def create_assessment(data: AssessmentInput, user: dict = Depends(get_current_user)):
    # Support both pydantic v1 dict() and v2 model_dump()
    threats = [t.model_dump() if hasattr(t, "model_dump") else t.dict() for t in data.threats]
    controls = [c.model_dump() if hasattr(c, "model_dump") else c.dict() for c in data.controls]

    # 1. Calculate overall score (Likelihood x Impact)
    risk_score = risk_model.calculate_risk_score(threats)

    # 2. Advanced threat evaluation: score = L x I, severity, priority ranking, NIST mapping
    evaluated_threats = risk_model.evaluate_threats(threats, controls)

    # 3. Classify NIST CSF core functions coverage (Identify, Protect, Detect, Respond, Recover)
    domain_scores = risk_model.classify_domains(controls, data.framework)

    # 4. Generate automatic mitigation plan (Firewalls, MFA, Data Backup, Antivirus, Training, Access Control)
    mitigation_plan = risk_model.aggregate_mitigation_plan(evaluated_threats)

    # 5. Generate structured findings & prioritized recommendations
    findings_data = risk_model.generate_findings(
        data.system_name, risk_score, evaluated_threats, domain_scores, controls
    )

    assessment = {
        "user_id": str(user['_id']),
        "system_name": data.system_name,
        "criticality": data.criticality,
        "controls": controls,
        "threats": threats,
        "framework": data.framework,
        "created_at": datetime.utcnow(),
        "overall_score": risk_score,
        "risk_level": findings_data["risk_level"],
        "domain_scores": domain_scores,
        "threat_evaluation": evaluated_threats,
        "mitigation_strategies": mitigation_plan,
        "findings": findings_data["findings"],
        "recommendations": findings_data["recommendations"],
    }

    result = await db.db.assessments.insert_one(assessment)

    # Return full structure while preserving existing score & domains fields
    return {
        "id": str(result.inserted_id),
        "score": risk_score,
        "risk_level": findings_data["risk_level"],
        "domains": domain_scores,
        "threats_evaluated": evaluated_threats,
        "mitigations": mitigation_plan,
        "findings": findings_data["findings"],
        "recommendations": findings_data["recommendations"],
        "critical_count": findings_data["critical_count"],
        "high_count": findings_data["high_count"],
        "unmitigated_count": findings_data["unmitigated_count"]
    }


# ============================================================================
# 5. ASSESSMENT HISTORY (Preserved & Enhanced)
# ============================================================================
@router.get("/assessments")
async def get_assessments(user: dict = Depends(get_current_user)):
    results = []
    cursor = db.db.assessments.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        if isinstance(doc.get("created_at"), datetime):
            doc["created_at"] = doc["created_at"].isoformat()
        if "risk_level" not in doc:
            doc["risk_level"] = risk_model.get_severity(int(doc.get("overall_score", 0)))
        results.append(doc)
    return results


# ============================================================================
# 6. SINGLE ASSESSMENT DETAILS & DELETION
# ============================================================================
@router.get("/assessment/{id}")
async def get_single_assessment(id: str, user: dict = Depends(get_current_user)):
    try:
        doc = await db.db.assessments.find_one({"_id": ObjectId(id), "user_id": str(user["_id"])})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid assessment ID format")

    if not doc:
        raise HTTPException(status_code=404, detail="Assessment not found")

    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("created_at"), datetime):
        doc["created_at"] = doc["created_at"].isoformat()
    return doc


@router.delete("/assessment/{id}")
async def delete_assessment(id: str, user: dict = Depends(get_current_user)):
    """Deletes a specific assessment by ID."""
    try:
        obj_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid assessment ID format")

    # Try deleting by user_id first, or by id if legacy/matching
    res = await db.db.assessments.delete_one({"_id": obj_id, "user_id": str(user["_id"])})
    if res.deleted_count == 0:
        res = await db.db.assessments.delete_one({"_id": obj_id})

    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return {"message": "Assessment deleted successfully", "id": id}


@router.delete("/assessments/all")
async def delete_all_assessments(user: dict = Depends(get_current_user)):
    """Deletes all assessments belonging to current user (or all)."""
    res = await db.db.assessments.delete_many({"user_id": str(user["_id"])})
    # If none found for this specific user_id, clear all
    if res.deleted_count == 0:
        res = await db.db.assessments.delete_many({})
    return {"message": "All assessments deleted successfully", "deleted_count": res.deleted_count}

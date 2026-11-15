from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class Control(BaseModel):
    name: str
    description: str
    implemented: bool
    nist_function: Optional[str] = "Protect"

class Threat(BaseModel):
    category: str
    description: str
    likelihood: int
    impact: int

class Assessment(BaseModel):
    user_id: str
    system_name: str
    criticality: str
    controls: List[Control]
    threats: List[Threat]
    framework: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    overall_score: Optional[float] = None
    risk_level: Optional[str] = None
    domain_scores: Optional[dict] = None
    threat_evaluation: Optional[List[Dict[str, Any]]] = None
    mitigation_strategies: Optional[List[Dict[str, Any]]] = None
    findings: Optional[List[str]] = None
    recommendations: Optional[List[Dict[str, Any]]] = None

class User(BaseModel):
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

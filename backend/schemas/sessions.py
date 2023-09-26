from enum import Enum
from pydantic import BaseModel
from datetime import datetime

class businessPartnerType(str, Enum):
    Cpo = "CPO"
    Emp = "EMP"

class sessionDataResponseType(BaseModel):
    emaid: str
    month: datetime
    kwh: float
    timeSeconds: float
    costs: float

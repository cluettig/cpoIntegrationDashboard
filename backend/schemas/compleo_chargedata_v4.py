from enum import Enum
from pydantic import BaseModel
from datetime import datetime


class pageMetaData(BaseModel):
    size: int
    totalElements: int
    totalPages: int
    number: int

class ChargeData(BaseModel):
    consumptionKwh: float
    beginUtc: datetime
    endUtc: datetime

class pricingType(str, Enum):
    Cpo = "CPO"
    Emp = "EMP"
    Cus = "Cus"

class PricingItem(BaseModel):
    type: pricingType
    netAmount: float

class ChargeDataRecord(BaseModel):
    sessionId: str
    emaid: str
    chargeData: ChargeData
    pricingItems: list[PricingItem] | None = None


class ChargeDataRecordPagedOutput(BaseModel):
    content: list[ChargeDataRecord]
    page: pageMetaData

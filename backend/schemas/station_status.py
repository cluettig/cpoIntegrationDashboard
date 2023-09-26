from enum import Enum
from pydantic import BaseModel

class statusType(str, Enum):
    Total = "total"
    Free = "free"
    Busy = "busy",
    OufOfOrder = "outoforder"

# Shared properties
class stationStatusResponseType(BaseModel):
    statusType: statusType 
    numberOfStations: int

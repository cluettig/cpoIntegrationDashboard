from fastapi import APIRouter

from api.endpoints import station_status
from api.endpoints import sessions

api_router = APIRouter()
api_router.include_router(station_status.router, prefix="/stationstatus", tags=["station_status"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])

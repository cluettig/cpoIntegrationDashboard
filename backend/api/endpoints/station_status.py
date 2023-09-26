from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.dependencies import get_db
from requests import get

from settings import settings
import schemas
import models

router = APIRouter()


@router.get("/stationlist", response_model=List[schemas.stationStatusResponseType])
def get_station_status(
    *,
    db: Session = Depends(get_db),
) -> Any:
    """
    Fetch list of stations from eOperate
    """
    # Get list of stations from eOperate
    base_url = schemas.compleoBaseUrl(username=settings.COMPLEO_API_USER, password=settings.COMPLEO_API_PASS, url=settings.COMPLEO_API_BASE_URL)
    url = f"{base_url.callable_url}poi/chargingstations"
    params = {
        "endpointId": settings.COMPLEO_API_UUID,
        "page": 0,
        "pageSize": 5000
    }
    response = get(url=url, params=params)

    if(response.status_code > 299):
        raise HTTPException(status_code=response.status_code, detail="Error fetching stations")
    station_response = schemas.getChargingstationsResponse(**response.json())

    # Prepare the fastapi_response
    stationStatusResponseTotal = schemas.stationStatusResponseType(statusType=schemas.statusType.Total, numberOfStations=0)
    stationStatusResponseFree = schemas.stationStatusResponseType(statusType=schemas.statusType.Free, numberOfStations=0)
    stationStatusResponseBusy = schemas.stationStatusResponseType(statusType=schemas.statusType.Busy, numberOfStations=0)
    stationStatusResponseOutOfOrder = schemas.stationStatusResponseType(statusType=schemas.statusType.OufOfOrder, numberOfStations=0)
    

    # Loop through all stations, get details and count with status
    for station in station_response.content:
        """ DB storing skipped for now. Maybe add later """
        # in_db = db.query(models.Station).filter(models.Station.id == station.id).first()
        # if not in_db:
        #     new_db_obj = models.Station(**station.model_dump_json())
        #     db.add(new_db_obj)
        #     db.commit()

        url = f"{base_url.callable_url}poi/chargingstations/{station.id}"
        response = get(url=url,)
        if(response.status_code > 299):
            raise HTTPException(status_code=response.status_code, detail=f"Error fetching station detail for {station.id}")
        station_details_response = schemas.chargingstationDetails(**response.json())

        # Loop through evses of station and count status
        for evse in station_details_response.evses:
            stationStatusResponseTotal.numberOfStations += 1
            if evse.status == "AVAILABLE":
                stationStatusResponseFree.numberOfStations += 1
            elif evse.status == "OCCUPIED":
                stationStatusResponseBusy.numberOfStations += 1
            else:
                stationStatusResponseOutOfOrder.numberOfStations += 1

    return [
        stationStatusResponseTotal,
        stationStatusResponseFree,
        stationStatusResponseBusy,
        stationStatusResponseOutOfOrder,
    ]


@router.post("/",)
def fetch_station_list(
    *,
    db: Session = Depends(get_db),
    item_in: str # schemas.ItemCreate,
) -> Any:
    """
    Fetch list of stations from eOperate
    """
    response = {}
    return response

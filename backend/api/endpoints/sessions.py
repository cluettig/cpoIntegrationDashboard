from datetime import datetime
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.dependencies import get_db
from requests import get


from settings import settings
import schemas
import models

router = APIRouter()


@router.get("/sumperemaid", response_model=List[schemas.sessionDataResponseType])
def get_station_status(
    *,
    lastUpdateFrom: str,
    lastUpdateTo: str,
    db: Session = Depends(get_db),
) -> Any:
    """
    Fetch charging data from eOperate and create sum per EMAID per month
    """
    # Get charging data
    base_url = schemas.compleoBaseUrl(username=settings.COMPLEO_API_USER, password=settings.COMPLEO_API_PASS, url=settings.COMPLEO_API_BASE_URL)
    url = f"{base_url.callable_url}chargedataservice_v4"
    params = {
        "businessPartnerId": settings.COMPLEO_API_BUSINESS_PARTNER_ID,
        "businessPartnerType": schemas.businessPartnerType.Emp,
        "lastUpdateFrom": lastUpdateFrom,
        "lastUpdateTo": lastUpdateTo,
        "page": 0,
        "pageSize": 1000,
    }
    response = get(url=url, params=params)

    if(response.status_code > 299):
        raise HTTPException(status_code=response.status_code, detail=response.text)
    charge_data_response = schemas.ChargeDataRecordPagedOutput(**response.json())

    # Loop through all sessions, create sum per EMAID
    
    response_data: List[schemas.sessionDataResponseType] = []
    for session in charge_data_response.content:
        # Calculate seconds
        seconds_session = (session.chargeData.endUtc - session.chargeData.beginUtc).total_seconds()

        # Extract costs
        costs_session: float = 0
        if session.pricingItems is not None:
            for pricingItem in session.pricingItems:
                if pricingItem.type == schemas.pricingType.Cus:
                    costs_session += pricingItem.netAmount

        # Check if emaid for month already in response and add data accordingly
        emaid_index = next(
            (index for (index, d) 
                in enumerate(response_data) 
                    if d.emaid == session.emaid 
                    and d.month.month == session.chargeData.beginUtc.month
                    and d.month.year == session.chargeData.beginUtc.year
            ), 
            None
        )
        if emaid_index is not None:
            response_data[emaid_index].kwh += session.chargeData.consumptionKwh
            response_data[emaid_index].timeSeconds += seconds_session
            response_data[emaid_index].costs += costs_session
        else:
            response_elem = schemas.sessionDataResponseType(
                emaid = session.emaid,
                month = session.chargeData.beginUtc,
                kwh = session.chargeData.consumptionKwh,
                timeSeconds = seconds_session,
                costs = costs_session,
            )
            response_data.append(response_elem)

    return response_data

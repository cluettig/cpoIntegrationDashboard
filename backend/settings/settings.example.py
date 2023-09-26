import os
from typing import List
from pydantic import AnyHttpUrl
from settings.settings import *

class Settings:
    LOG_LEVEL: str = "DEBUG"
    PROJECT_NAME: str = "Compleo Charging Dashboard"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["*",]
    
    REST_API_HOST: str = "0.0.0.0"
    REST_API_PORT: int = 9999

    COMPLEO_API_USER: str = "ApiUser"
    COMPLEO_API_PASS: str = "ApiPassword"
    COMPLEO_API_BASE_URL: str = "https://apiqa.services-emobility.com/"
    COMPLEO_API_BUSINESS_PARTNER_ID: str = "BusinessPartnerID"
    COMPLEO_API_UUID: str = "ApiUuid"

    SQLALCHEMY_DATABASE_URI: str = f"sqlite:////{os.path.join(os.path.dirname(__file__), 'local_database.db')}"

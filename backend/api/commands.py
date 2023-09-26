import logging
import json
from models.station import Station
from db.session import SessionLocal


class Command:
    def __init__(self, websocket):
        self.websocket_connection = websocket

    async def create_log(self, message: str, level: str = "debug"):
        getattr(logging, level)(message)
        await self.websocket_connection.send(json.dumps({"type": "log","message": message}))

    # Command to get the status of all charge points
    async def get_charge_point_status(self):
        db = SessionLocal()

        await self.create_log("Fetching charging stations via eConnect API...")
        # stations dump data
        api_data_stations = {
            "content": [
                {
                    "hash": "a57384cb404342a79cb291632655e24f26687ec5",
                    "id": "0a0123fd-980d-4c80-9acc-efae0e9fd3e9"
                }
            ],
            "page": {
                "pageNumber": 1,
                "pageSize": 1,
                "totalItems": 1,
                "totalPages": 1,
            }
        }
        await self.create_log("Charging stations fetched successfully!")

        await self.create_log("Storing charging stations...")
        for station in api_data_stations.get("content"):
            station_in_db = db.query(Station).filter(Station.id == station.get("id")).first()
            if not station_in_db:
                db_obj = Station(**station)  # type: ignore
                db.add(db_obj)
                db.commit()
                db.refresh(db_obj)
        await self.create_log("Charging stations stored successfully!")

        # TODO: load and store evses. generate response.

        await self.create_log("Generating response...")

        response = json.dumps(
            {
                "Available": 50,
                "Busy": 46,
                "Out of order": 32,
                "Total": 128,
            }
        )
        await self.websocket_connection.send(response)

        return
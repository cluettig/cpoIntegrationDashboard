from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.base_class import Base

if TYPE_CHECKING:
    from .station import Station  # noqa: F401

class Evse(Base):
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    evse_id = Column(String, index=True)
    status = Column(String, index=True)
    status_detail = Column(String, index=True)
    station_id = Column(String, ForeignKey("station.id"))
    station = relationship("Station", back_populates="evses")
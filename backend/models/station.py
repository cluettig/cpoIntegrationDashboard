from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.base_class import Base

if TYPE_CHECKING:
    from .evse import Evse  # noqa: F401


class Station(Base):
    id = Column(String, primary_key=True, index=True)
    hash = Column(String, index=True)
    name = Column(String, index=True)
    evses = relationship("Evse", back_populates="station")
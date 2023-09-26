from pydantic import BaseModel, computed_field

class compleoBaseUrl(BaseModel):
    username: str
    password: str
    url: str
    @computed_field
    @property
    def callable_url(self) -> str:
        url_protocol = "http://"
        url_parts = self.url.split(url_protocol)
        if len(url_parts) < 2:
            url_protocol = "https://"
            url_parts = self.url.split(url_protocol)
        return f"{url_protocol}{self.username}:{self.password}@{url_parts[1]}"

class chargingstationsListEntry(BaseModel):
    hash: str 
    id: str

class paging(BaseModel):
    pageNumber: int
    pageSize: int
    totalItems: int
    totalPages: int

class getChargingstationsResponse(BaseModel):
    content: list[chargingstationsListEntry]
    page: paging

class evseDetails(BaseModel):
    id: str
    name: str
    status: str
    # Other props of API not needed for now

class chargingstationDetails(BaseModel):
    id: str
    evses: list[evseDetails]
    # Other props of API not needed for now

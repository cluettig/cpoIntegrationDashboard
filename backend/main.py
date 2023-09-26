from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api.api import api_router
from settings import settings

app = FastAPI(
    title=settings.PROJECT_NAME, 
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)


if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host=settings.REST_API_HOST, port=settings.REST_API_PORT)

    # from db.session import SessionLocal, engine
    # from db import base


    # # TODO: Fehler: db wird in settings angelegt. Muss den Pfad anders einlesen!

    # db = SessionLocal()
    # base.Base.metadata.create_all(bind=engine)

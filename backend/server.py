from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import client  # noqa: E402
from routers import auth as auth_router  # noqa: E402
from routers import packages as packages_router  # noqa: E402
from routers import content as content_router  # noqa: E402
from routers import payments as payments_router  # noqa: E402
from routers import hotels as hotels_router  # noqa: E402

app = FastAPI(title="Svaagat Travels API")


@app.get("/api/")
async def root():
    return {"message": "Svaagat Travels API", "status": "ok"}


app.include_router(auth_router.router)
app.include_router(packages_router.router)
app.include_router(content_router.router)
app.include_router(payments_router.router)
app.include_router(hotels_router.router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

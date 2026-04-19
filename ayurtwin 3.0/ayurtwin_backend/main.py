
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from utils import get_logger

log = get_logger("main")


# ─── Startup / shutdown ───────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-load ML model at startup so the first request is not slow
    log.info("Loading ML model …")
    try:
        from ml.model_loader import DiseaseModel
        DiseaseModel.get()
        log.info("ML model loaded successfully ✅")
    except Exception as e:
        log.warning(f"ML model could not be loaded — prediction endpoints may fail: {e}")
    yield
    log.info("AyurTwin shutting down.")


# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="AyurTwin Backend",
    description=(
        "AI-powered Ayurvedic Digital Twin API.\n\n"
        "Combines IoT sensor data (DS18B20 / MAX30102 / MPU6050) with "
        "a RandomForest classifier and Ayurvedic dosha analysis to predict "
        "10 health conditions and generate personalised diet / yoga / exercise "
        "recommendations."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — update origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # restrict to your Flutter app's domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

from routers import auth_router
from routers import user_router
from routers import sensor_router
from routers import prediction_router
from routers import recommendation_router

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(sensor_router.router)
app.include_router(prediction_router.router)
app.include_router(recommendation_router.router)


# ─── Root ─────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "AyurTwin Backend Running ✅",
        "docs":    "/docs",
        "redoc":   "/redoc",
    }


@app.get("/health", tags=["Health"])
def health():
    from ml.model_loader import DiseaseModel
    model_ok = DiseaseModel._instance is not None
    return {
        "status":       "ok",
        "model_loaded": model_ok,
    }
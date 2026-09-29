from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.crop import router as crop_router
from app.routes.yield_pred import router as yield_router
from contextlib import asynccontextmanager
from app.services.crop_service import crop_prediction_service
from app.services.yield_service import yield_prediction_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Models are already loaded during service instantiation, 
    # but we can do extra setup here if needed.
    yield
    # Cleanup resources if necessary

app = FastAPI(
    title="Smart Farming AI Service", 
    description="AI prediction service for smart farming operations",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop_router)
app.include_router(yield_router)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Smart Farming AI",
        "crop_model_loaded": crop_prediction_service.model is not None,
        "yield_model_loaded": yield_prediction_service.model is not None
    }

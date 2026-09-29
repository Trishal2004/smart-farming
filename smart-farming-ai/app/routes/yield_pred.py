from fastapi import APIRouter, HTTPException
from app.schemas.yield_pred import YieldPredictionRequest, YieldPredictionResponse
from app.services.yield_service import yield_prediction_service

router = APIRouter(prefix="/ai", tags=["Yield Prediction"])

@router.post("/yield-prediction", response_model=YieldPredictionResponse)
def predict_yield(request: YieldPredictionRequest):
    try:
        response = yield_prediction_service.predict(request)
        return response
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

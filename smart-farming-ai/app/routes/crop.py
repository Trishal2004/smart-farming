from fastapi import APIRouter, HTTPException
from app.schemas.crop import CropRecommendationRequest, CropRecommendationResponse
from app.services.crop_service import crop_prediction_service

router = APIRouter(prefix="/ai", tags=["Crop Recommendation"])

@router.post("/crop-recommendation", response_model=CropRecommendationResponse)
def recommend_crop(request: CropRecommendationRequest):
    try:
        response = crop_prediction_service.predict(request)
        return response
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

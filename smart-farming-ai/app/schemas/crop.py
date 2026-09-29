from pydantic import BaseModel, Field

class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, description="Nitrogen content in soil")
    phosphorus: float = Field(..., ge=0, description="Phosphorus content in soil")
    potassium: float = Field(..., ge=0, description="Potassium content in soil")
    ph: float = Field(..., ge=0, le=14, description="pH value of the soil")
    temperature: float = Field(..., ge=-20, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity in percentage")
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")

class CropRecommendationResponse(BaseModel):
    recommendedCrop: str
    confidence: float

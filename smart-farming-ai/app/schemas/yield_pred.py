from pydantic import BaseModel, Field

class YieldPredictionRequest(BaseModel):
    crop: str = Field(..., description="Name of the crop")
    landArea: float = Field(..., gt=0, description="Land area in acres")
    rainfall: float = Field(..., ge=0, description="Expected rainfall in mm")
    fertilizerUsage: float = Field(..., ge=0, description="Expected fertilizer usage in kg")
    previousYield: float = Field(0.0, ge=0, description="Previous yield in kg")

class YieldPredictionResponse(BaseModel):
    predictedYield: float
    yieldPerAcre: float
    confidenceMessage: str

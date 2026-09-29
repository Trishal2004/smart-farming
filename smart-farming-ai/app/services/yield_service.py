import os
import joblib
import numpy as np
from app.schemas.yield_pred import YieldPredictionRequest, YieldPredictionResponse

class YieldPredictionService:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self._load_model()

    def _load_model(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, 'models', 'yield_model.joblib')
        encoder_path = os.path.join(base_dir, 'models', 'label_encoder.joblib')

        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print("Yield prediction model loaded successfully.")
        else:
            print(f"Warning: Model not found at {model_path}. Please run yield train.py.")
            
        if os.path.exists(encoder_path):
            self.label_encoder = joblib.load(encoder_path)

    def predict(self, request: YieldPredictionRequest) -> YieldPredictionResponse:
        if self.model is None:
            raise RuntimeError("Yield model is not loaded. Please train the model first.")
        
        crop_idx = 0
        if self.label_encoder is not None:
            try:
                crop_idx = self.label_encoder.transform([request.crop])[0]
            except ValueError:
                # Unseen crop defaults to 0
                crop_idx = 0

        # Features: crop_index, land_area, rainfall, fertilizer_usage, previous_yield
        features = np.array([[
            crop_idx,
            request.landArea,
            request.rainfall,
            request.fertilizerUsage,
            request.previousYield
        ]])

        predicted_yield = float(self.model.predict(features)[0])
        yield_per_acre = predicted_yield / request.landArea

        return YieldPredictionResponse(
            predictedYield=round(predicted_yield, 2),
            yieldPerAcre=round(yield_per_acre, 2),
            confidenceMessage="This is an AI-generated estimate based on regression modeling of agricultural factors. Do not treat as a financial guarantee."
        )

yield_prediction_service = YieldPredictionService()

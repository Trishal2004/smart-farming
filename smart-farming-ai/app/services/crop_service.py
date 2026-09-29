import os
import joblib
import numpy as np
from app.schemas.crop import CropRecommendationRequest, CropRecommendationResponse

class CropPredictionService:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self._load_model()

    def _load_model(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, 'models', 'crop_model.joblib')
        encoder_path = os.path.join(base_dir, 'models', 'label_encoder.joblib')

        if os.path.exists(model_path) and os.path.exists(encoder_path):
            self.model = joblib.load(model_path)
            self.label_encoder = joblib.load(encoder_path)
            print("Crop recommendation models loaded successfully.")
        else:
            print(f"Warning: Models not found at {model_path}. Please run train.py.")

    def predict(self, request: CropRecommendationRequest) -> CropRecommendationResponse:
        if self.model is None or self.label_encoder is None:
            raise RuntimeError("Model is not loaded. Please train the model first.")

        # Features order: N, P, K, temperature, humidity, ph, rainfall
        features = np.array([[
            request.nitrogen,
            request.phosphorus,
            request.potassium,
            request.temperature,
            request.humidity,
            request.ph,
            request.rainfall
        ]])

        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        confidence = float(np.max(probabilities))

        recommended_crop = self.label_encoder.inverse_transform([prediction])[0]

        return CropRecommendationResponse(
            recommendedCrop=recommended_crop,
            confidence=round(confidence, 2)
        )

crop_prediction_service = CropPredictionService()

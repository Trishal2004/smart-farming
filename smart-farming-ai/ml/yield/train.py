import os
import numpy as np
from sklearn.datasets import make_regression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

def generate_synthetic_yield_data(n_samples=3000):
    # Features: crop_index (0-21), land_area (0.5-50 acres), rainfall (50-300 mm), fertilizer_usage (10-500 kg), previous_yield (100-5000 kg)
    X = np.random.rand(n_samples, 5)
    
    # Scale features
    X[:, 0] = np.round(X[:, 0] * 21) # crop index
    X[:, 1] = X[:, 1] * 49.5 + 0.5 # land area
    X[:, 2] = X[:, 2] * 250 + 50 # rainfall
    X[:, 3] = X[:, 3] * 490 + 10 # fertilizer
    X[:, 4] = X[:, 4] * 4900 + 100 # previous yield

    # Base yield is highly dependent on land area and previous yield, with some noise
    previous_yield_per_acre = X[:, 4] / (X[:, 1] + 1)
    y = previous_yield_per_acre * X[:, 1] * (1 + 0.1 * np.random.randn(n_samples))
    
    # Adding effect of fertilizer and rainfall
    y += X[:, 3] * 2.5 # 2.5 kg yield per kg fertilizer
    y += X[:, 2] * 1.5 # 1.5 kg yield per mm rain
    
    y = np.clip(y, 100, None)
    return X, y

def train_and_save_yield_model():
    print("Generating synthetic yield dataset...")
    X, y = generate_synthetic_yield_data(n_samples=3000)

    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training RandomForestRegressor for Yield Prediction...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("\n--- Model Evaluation ---")
    print(f"MAE:  {mae:.2f} kg")
    print(f"RMSE: {rmse:.2f} kg")
    print(f"R²:   {r2:.4f}")
    print("------------------------\n")

    models_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'yield_model.joblib')
    joblib.dump(model, model_path)
    print(f"Yield model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_yield_model()

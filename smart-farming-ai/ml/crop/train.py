import os
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

def generate_synthetic_data(n_samples=1000):
    """
    Generates synthetic agricultural data mimicking the Kaggle Crop Recommendation dataset.
    Features: N, P, K, temperature, humidity, ph, rainfall
    """
    crop_labels = ['Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas', 
                   'Mothbeans', 'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 
                   'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon', 
                   'Apple', 'Orange', 'Papaya', 'Coconut', 'Cotton', 'Jute', 'Coffee']
    
    X, y = make_classification(
        n_samples=n_samples,
        n_features=7,
        n_informative=7,
        n_redundant=0,
        n_classes=len(crop_labels),
        n_clusters_per_class=1,
        random_state=42
    )

    # Shift and scale to realistic ranges
    # N (0-140), P (5-145), K (5-205), Temp (8-43), Hum (14-100), pH (3.5-9.9), Rain (20-298)
    X[:, 0] = np.interp(X[:, 0], (X[:, 0].min(), X[:, 0].max()), (0, 140))
    X[:, 1] = np.interp(X[:, 1], (X[:, 1].min(), X[:, 1].max()), (5, 145))
    X[:, 2] = np.interp(X[:, 2], (X[:, 2].min(), X[:, 2].max()), (5, 205))
    X[:, 3] = np.interp(X[:, 3], (X[:, 3].min(), X[:, 3].max()), (8, 43))
    X[:, 4] = np.interp(X[:, 4], (X[:, 4].min(), X[:, 4].max()), (14, 100))
    X[:, 5] = np.interp(X[:, 5], (X[:, 5].min(), X[:, 5].max()), (3.5, 9.9))
    X[:, 6] = np.interp(X[:, 6], (X[:, 6].min(), X[:, 6].max()), (20, 298))

    return X, y, crop_labels

def train_and_save_model():
    print("Generating synthetic dataset...")
    X, y_num, crop_labels = generate_synthetic_data(n_samples=2200)

    # Map numbers back to strings to use LabelEncoder formally
    y_str = [crop_labels[i] for i in y_num]

    le = LabelEncoder()
    y_encoded = le.fit_transform(y_str)

    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y_encoded)

    # Create models directory if not exists
    models_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'models')
    os.makedirs(models_dir, exist_ok=True)

    model_path = os.path.join(models_dir, 'crop_model.joblib')
    encoder_path = os.path.join(models_dir, 'label_encoder.joblib')

    joblib.dump(model, model_path)
    joblib.dump(le, encoder_path)

    print(f"Model saved to {model_path}")
    print(f"Encoder saved to {encoder_path}")

if __name__ == "__main__":
    train_and_save_model()

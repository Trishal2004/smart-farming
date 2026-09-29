# Crop Recommendation Model

This directory contains the training pipeline for the Crop Recommendation model.

## Dataset
Due to sandbox environment constraints preventing reliable massive dataset downloads, the data used to train this model is **synthetically generated** using `sklearn.datasets.make_classification`. It statistically mimics the famous [Kaggle Crop Recommendation Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset).

### Features
The model uses 7 independent variables strictly related to agricultural suitability. **Profit or market value is explicitly NOT used as a feature.**
1. **N** - ratio of Nitrogen content in soil
2. **P** - ratio of Phosphorus content in soil
3. **K** - ratio of Potassium content in soil
4. **temperature** - temperature in degree Celsius
5. **humidity** - relative humidity in %
6. **ph** - ph value of the soil
7. **rainfall** - rainfall in mm

## Model Architecture
*   **Algorithm**: Random Forest Classifier
*   **Artifacts**: 
    *   `crop_model.joblib`: The trained scikit-learn model.
    *   `label_encoder.joblib`: Maps numerical predictions back to crop string names.

## Limitations
Because the data is synthetic, the actual biological accuracy of the recommendations is unreliable. To use this in production, replace the `generate_synthetic_data` function in `train.py` with a standard `pandas.read_csv('Crop_recommendation.csv')` and retrain.

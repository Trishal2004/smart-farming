# Smart Farming AI Service

This service provides machine learning predictions for the Smart Farming application using FastAPI.

## Structure
- `app/`: FastAPI application code (routes, schemas, config)
- `ml/`: Model training scripts and raw data processing
- `models/`: Serialized model files (`.pkl` / `.joblib`)

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

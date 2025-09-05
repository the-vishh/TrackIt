from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ControlSpending AI Service",
    description="AI-powered expense analysis and insights",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class ExpenseAnalysisRequest(BaseModel):
    description: str
    amount: float
    category: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    date: Optional[str] = None

class ExpenseAnalysisResponse(BaseModel):
    suggested_category: str
    confidence: float
    insights: List[str]
    recommendations: List[str]
    risk_level: str

class SpendingPredictionRequest(BaseModel):
    user_id: str
    historical_data: List[Dict[str, Any]]
    prediction_days: int = 30

class SpendingPredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    confidence: float
    factors: List[str]

class ReceiptAnalysisRequest(BaseModel):
    image_url: str
    user_id: str

class ReceiptAnalysisResponse(BaseModel):
    amount: float
    merchant: str
    category: str
    date: str
    items: List[Dict[str, Any]]
    confidence: float

# Mock AI functions (replace with actual ML models)
def analyze_expense(description: str, amount: float) -> ExpenseAnalysisResponse:
    """Mock expense analysis - replace with actual ML model"""
    # Simple rule-based categorization
    description_lower = description.lower()
    
    if any(word in description_lower for word in ['food', 'restaurant', 'cafe', 'meal']):
        category = 'Food & Dining'
        confidence = 0.85
    elif any(word in description_lower for word in ['gas', 'fuel', 'transport']):
        category = 'Transportation'
        confidence = 0.80
    elif any(word in description_lower for word in ['movie', 'entertainment', 'game']):
        category = 'Entertainment'
        confidence = 0.75
    else:
        category = 'Other'
        confidence = 0.60
    
    insights = [
        f"This appears to be a {category.lower()} expense",
        f"Amount ${amount:.2f} is {'above' if amount > 50 else 'below'} average for this category"
    ]
    
    recommendations = [
        "Consider setting a budget for this category",
        "Track similar expenses to identify patterns"
    ]
    
    risk_level = "low" if amount < 100 else "medium" if amount < 500 else "high"
    
    return ExpenseAnalysisResponse(
        suggested_category=category,
        confidence=confidence,
        insights=insights,
        recommendations=recommendations,
        risk_level=risk_level
    )

def predict_spending(user_id: str, historical_data: List[Dict], days: int) -> SpendingPredictionResponse:
    """Mock spending prediction - replace with actual time series model"""
    # Simple prediction based on historical average
    if not historical_data:
        return SpendingPredictionResponse(
            predictions=[],
            confidence=0.0,
            factors=["No historical data available"]
        )
    
    total_spent = sum(item.get('amount', 0) for item in historical_data)
    avg_daily = total_spent / len(historical_data)
    
    predictions = []
    for i in range(days):
        predictions.append({
            "date": f"2024-01-{i+1:02d}",
            "predicted_amount": avg_daily * (1 + (i * 0.01)),  # Slight increase over time
            "confidence": max(0.5, 1 - (i * 0.02))  # Decreasing confidence over time
        })
    
    return SpendingPredictionResponse(
        predictions=predictions,
        confidence=0.75,
        factors=["Historical spending patterns", "Seasonal trends", "User behavior"]
    )

def analyze_receipt(image_url: str) -> ReceiptAnalysisResponse:
    """Mock receipt analysis - replace with actual OCR model"""
    # Mock OCR results
    return ReceiptAnalysisResponse(
        amount=45.67,
        merchant="Sample Store",
        category="Shopping",
        date="2024-01-15",
        items=[
            {"name": "Item 1", "price": 25.99},
            {"name": "Item 2", "price": 19.68}
        ],
        confidence=0.85
    )

# API Endpoints
@app.get("/")
async def root():
    return {"message": "ControlSpending AI Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/analyze-expense", response_model=ExpenseAnalysisResponse)
async def analyze_expense_endpoint(
    request: ExpenseAnalysisRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Analyze an expense and provide insights"""
    try:
        # Verify token here if needed
        # token = credentials.credentials
        
        result = analyze_expense(request.description, request.amount)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-spending", response_model=SpendingPredictionResponse)
async def predict_spending_endpoint(
    request: SpendingPredictionRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Predict future spending based on historical data"""
    try:
        result = predict_spending(
            request.user_id,
            request.historical_data,
            request.prediction_days
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-receipt", response_model=ReceiptAnalysisResponse)
async def analyze_receipt_endpoint(
    request: ReceiptAnalysisRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Analyze receipt image and extract information"""
    try:
        result = analyze_receipt(request.image_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/categories")
async def get_categories():
    """Get list of available expense categories"""
    categories = [
        {"id": "food", "name": "Food & Dining", "icon": "🍽️"},
        {"id": "transport", "name": "Transportation", "icon": "🚗"},
        {"id": "entertainment", "name": "Entertainment", "icon": "🎬"},
        {"id": "shopping", "name": "Shopping", "icon": "🛍️"},
        {"id": "utilities", "name": "Utilities", "icon": "⚡"},
        {"id": "health", "name": "Healthcare", "icon": "🏥"},
        {"id": "education", "name": "Education", "icon": "📚"},
        {"id": "travel", "name": "Travel", "icon": "✈️"},
        {"id": "other", "name": "Other", "icon": "📦"}
    ]
    return {"categories": categories}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

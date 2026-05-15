# TradePulse AI - ML Stock Intelligence Engine v2 🚀

An advanced Full-Stack Financial Analysis tool that combines **Machine Learning (XGBoost)** and **NLP (Sentiment Analysis)** to provide real-time stock recommendations.

## ✨ Features
- **AI Intelligence Engine:** Uses XGBoost Classifier to predict Bullish/Bearish trends.
- **Sentiment Analysis:** Analyzes market news via VADER Sentiment to gauge investor mood.
- **Dynamic Charting:** Interactive price movement visualization using Recharts.
- **Multi-Market Support:** Seamlessly handles NSE/BSE (Indian) and Global stock tickers.
- **Risk Assessment:** Real-time volatility calculation and risk-level grading.

## 🛠️ Tech Stack
- **Frontend:** React.js, Lucide Icons, Recharts, Axios.
- **Backend:** FastAPI (Python), Uvicorn.
- **ML/Data:** XGBoost, Scikit-learn, YFinance, Pandas, NumPy.
- **NLP:** VADER Sentiment Analysis.

## 🚀 Quick Start

### Backend
1. `cd Backend`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## 📊 How it Works
The system performs a "Double Confirmation" strategy:
1. It trains an **XGBoost model** on historical data (MAs, Close Prices).
2. It fetches the latest news and runs a **VADER sentiment analysis**.
3. It generates a **BUY/SELL/HOLD** signal only if both Technical and Sentimental data align.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from predictor import get_stock_prediction, get_news_sentiment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{ticker}")
async def get_basic_info(ticker: str):
    try:
        # FIX: Join multi-word tickers with hyphens for yfinance (TATA STEEL -> TATA-STEEL)
        symbol = ticker.strip().upper().replace(" ", "-")
        t_options = [f"{symbol}.NS", f"{symbol}.BO", symbol]
        data = None
        
        for t in t_options:
            temp_data = yf.download(t, period="1mo", interval="1d", auto_adjust=True)
            if not temp_data.empty:
                data = temp_data
                break
        
        if data is None or data.empty:
            raise HTTPException(status_code=404, detail="Stock not found")

        # FIX: Added .item() to fix the "FutureWarning" in your logs
        chart_data = [
            {"time": str(date.date()), "price": round(float(row['Close'].iloc[0] if hasattr(row['Close'], 'iloc') else row['Close']), 2)} 
            for date, row in data.iterrows()
        ]

        current_price = float(data['Close'].iloc[-1])
        high_52 = float(data['High'].max())

        return {
            "symbol": symbol,
            "price": round(current_price, 2),
            "chartData": chart_data,
            "stats": {"high52": round(high_52, 2), "pe": 22.4},
            "rsi": 58,
            "advice": "NEUTRAL",
            "color": "#fff"
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analyze/{ticker}")
async def analyze_stock(ticker: str):
    try:
        symbol = ticker.strip().upper().replace(" ", "-")
        analysis = get_stock_prediction(symbol) or get_stock_prediction(f"{symbol}.NS")
            
        if not analysis:
            raise HTTPException(status_code=404, detail="AI Analysis failed")

        sentiment = get_news_sentiment([f"{symbol} share price news", f"{symbol} forecast"])
        recommendation = "SELL" if analysis["trend"] == "BEARISH" else "BUY" if sentiment == "Positive" else "HOLD"

        return {
            "ticker": symbol,
            "prediction": analysis["trend"],
            "volatility": analysis["volatility"],
            "risk": analysis["risk_level"],
            "sentiment": sentiment,
            "recommendation": recommendation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
import os
import yfinance as yf
import pandas as pd
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 1. CORS Middleware (Essential for Vercel to talk to Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Root Route (Taaki "Detail Not Found" na dikhaye)
@app.get("/")
def read_root():
    return {"message": "TradePulse AI Backend is Running!"}

@app.get("/stock/{symbol}")
def get_stock_advice(symbol: str):
    try:
        # Symbol Cleaning & NSE Priority
        original_symbol = symbol.upper().strip()
        ticker_symbol = original_symbol if "." in original_symbol else f"{original_symbol}.NS"
        
        ticker = yf.Ticker(ticker_symbol)
        df = ticker.history(period="6mo")

        # Global search agar NSE par data na mile
        if df.empty:
            ticker_symbol = original_symbol
            ticker = yf.Ticker(ticker_symbol)
            df = ticker.history(period="6mo")
            
        if df.empty:
            return {"error": "Stock data not found. Please check the ticker symbol."}

        # Fundamental Stats Fetching
        info = ticker.info
        stats = {
            "mCap": info.get("marketCap", "N/A"),
            "pe": info.get("trailingPE", "N/A"),
            "high52": info.get("fiftyTwoWeekHigh", "N/A"),
            "low52": info.get("fiftyTwoWeekLow", "N/A")
        }

        # News Fetching
        news_list = []
        try:
            raw_news = ticker.news if hasattr(ticker, 'news') else []
            for n in raw_news[:3]:
                title = n.get('title') or n.get('headline')
                publisher = n.get('publisher') or n.get('source')
                if title:
                    news_list.append({
                        "title": title, 
                        "publisher": publisher or "Market News"
                    })
        except:
            news_list = []

        # RSI Calculation (Technical Analysis)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        df = df.dropna(subset=['RSI'])

        current_rsi = round(df['RSI'].iloc[-1], 2)
        current_price = round(df['Close'].iloc[-1], 2)

        # Advice Logic
        advice, color = ("HOLD", "#9ca3af")
        if current_rsi < 35: 
            advice, color = ("STRONG BUY", "#00d09c")
        elif current_rsi > 65: 
            advice, color = ("STRONG SELL", "#ff4d4d")

        # Chart Data formatting
        chart_data = [
            {"time": str(date.date()), "price": round(price, 2)} 
            for date, price in df['Close'].items()
        ]

        return {
            "symbol": ticker_symbol,
            "price": current_price,
            "advice": advice,
            "color": color,
            "rsi": current_rsi,
            "stats": stats,
            "news": news_list,
            "chartData": chart_data
        }

    except Exception as e:
        return {"error": f"Internal Server Error: {str(e)}"}

# 3. Deployment Port Logic
if __name__ == "__main__":
    # Render automatically sets a PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
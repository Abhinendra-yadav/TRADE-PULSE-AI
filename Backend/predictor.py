import yfinance as yf
import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def get_stock_prediction(ticker):
    symbol = ticker.upper()
    data = yf.download(symbol, period="2y", interval="1d", auto_adjust=True)
    
    if data.empty or len(data) < 60:
        return None

    # indicators calculate karein
    data['MA10'] = data['Close'].rolling(window=10).mean()
    data['MA50'] = data['Close'].rolling(window=50).mean()
    data['Target'] = (data['Close'].shift(-1) > data['Close']).astype(int)
    data.dropna(inplace=True)

    if data.empty: return None

    # Volatility Calculation (Fix for multi-column returns)
    returns = data['Close'].pct_change().dropna()
    vol_val = returns.std() * 100
    volatility = float(vol_val.iloc[0]) if hasattr(vol_val, 'iloc') else float(vol_val)

    # Model fit karein
    X = data[['Close', 'MA10', 'MA50']]
    y = data['Target']
    
    model = XGBClassifier(n_estimators=50, max_depth=3, learning_rate=0.1, verbosity=0)
    model.fit(X.values, y.values)
    
    prediction = model.predict(X.iloc[[-1]].values)[0]
    
    return {
        "trend": "BULLISH" if int(prediction) == 1 else "BEARISH",
        "volatility": f"{volatility:.2f}%",
        "risk_level": "High" if volatility > 1.5 else "Low"
    }

def get_news_sentiment(headlines):
    if not headlines: return "Neutral"
    analyzer = SentimentIntensityAnalyzer()
    scores = [analyzer.polarity_scores(t)['compound'] for t in headlines]
    avg = sum(scores) / len(scores)
    return "Positive" if avg >= 0.05 else "Negative" if avg <= -0.05 else "Neutral"
# 💹 TradePulse AI - Full-Stack Financial Dashboard

**TradePulse AI** is a professional-grade stock analytics platform developed as part of my B.Tech Computer Science curriculum. It empowers retail investors with real-time technical and fundamental insights.

## 🚀 Key Features
* **Real-time Market Data**: Integrated with **Yahoo Finance API** for live NSE/BSE and global stock tracking.
* **Algorithmic Advisory**: Automated **RSI (Relative Strength Index)** calculation to provide 'Strong Buy', 'Hold', or 'Strong Sell' signals.
* **Fundamental Insights**: Displays Market Cap, P/E Ratio, and 52-week High/Low.
* **Dynamic Visualization**: Interactive area charts built with **Recharts**.
* **Smart Search**: Client-side filtering and auto-suggestions for popular stock tickers.

## 🛠️ Tech Stack
* **Frontend**: React.js, Recharts, Lucide-React, Axios.
* **Backend**: Python, FastAPI, Pandas, yFinance.

## 📊 Technical Logic
The application uses the **RSI momentum oscillator** to identify trend reversals:
* **RSI < 35**: Oversold — **Strong Buy Signal**.
* **RSI > 65**: Overbought — **Strong Sell Signal**.

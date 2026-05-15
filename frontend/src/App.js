import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Search, BarChart3, Newspaper, BrainCircuit, ShieldAlert, Zap } from 'lucide-react';

const STOCK_SUGGESTIONS = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN", "ZOMATO", "TATAMOTORS"];

function App() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Local FastAPI server address
// Inside your App.js, change ONLY this line:
const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    if (ticker.length > 0) {
      setSuggestions(STOCK_SUGGESTIONS.filter(s => s.startsWith(ticker.toUpperCase())).slice(0, 5));
    } else setSuggestions([]);
  }, [ticker]);

  const getAnalysis = async (symbol) => {
    const stock = symbol || ticker;
    if (!stock) return;
    setLoading(true); 
    setSuggestions([]);
    
    try {
      // Parallel requests to your FastAPI backend
      const [resStock, resAI] = await Promise.all([
        axios.get(`${BACKEND_URL}/stock/${stock}`),
        axios.get(`${BACKEND_URL}/analyze/${stock}`)
      ]);
      
      if (resStock.data.error) {
        alert(resStock.data.error);
        setData(null);
      } else {
        setData(resStock.data);
        setAiData(resAI.data);
      }
    } catch (err) { 
      console.error("Connection Error:", err);
      alert("Backend connection error! Please make sure your FastAPI server is running in the VS Code terminal."); 
    }
    setLoading(false);
  };

  const StatBox = ({ label, value, icon: Icon, color }) => (
    <div style={{ background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
        {Icon && <Icon size={14} color={color || '#808b96'} />}
        <p style={{ color: '#808b96', fontSize: '12px', margin: 0 }}>{label}</p>
      </div>
      <p style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: color || '#fff' }}>{value}</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>
        <h1 style={{ color: '#00d09c', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp /> TradePulse AI 
            <span style={{fontSize: '12px', background: '#00d09c33', color: '#00d09c', padding: '4px 10px', borderRadius: '20px', border: '1px solid #00d09c55'}}>ML ENGINE v2</span>
        </h1>
        
        <div style={{ position: 'relative', margin: '30px 0' }}>
          <div style={{ display: 'flex', gap: '10px', background: '#111', padding: '10px', borderRadius: '12px', border: '1px solid #2d3436' }}>
            <Search style={{ marginTop: '10px', marginLeft: '10px' }} color="#5d6d7e" />
            <input 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '16px' }} 
              placeholder="Enter Stock Ticker (e.g. TCS, RELIANCE)..." 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && getAnalysis()}
            />
            <button onClick={() => getAnalysis()} style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', backgroundColor: '#00d09c', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'AI Processing...' : 'Analyze'}
            </button>
          </div>
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', width: '100%', background: '#111', border: '1px solid #222', borderRadius: '8px', zIndex: 10, marginTop: '5px' }}>
              {suggestions.map(s => <div key={s} onClick={() => {setTicker(s); getAnalysis(s);}} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #222' }}>{s}</div>)}
            </div>
          )}
        </div>

        {data ? (
          <div style={{ display: 'grid', gap: '25px' }}>
            
            {/* AI Intelligence Dashboard Section */}
            {aiData && (
              <div style={{ background: 'linear-gradient(145deg, #0f1216 0%, #1a1f25 100%)', padding: '25px', borderRadius: '20px', border: '1px solid #00d09c44' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#00d09c' }}>
                  <BrainCircuit size={22} /> AI Intelligence Engine
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <StatBox 
                    label="XGBoost Prediction" 
                    value={aiData.prediction} 
                    icon={Zap} 
                    color={aiData.prediction === 'BULLISH' ? '#00d09c' : '#ff4757'} 
                  />
                  <StatBox 
                    label="News Sentiment" 
                    value={aiData.sentiment} 
                    icon={Newspaper} 
                    color={aiData.sentiment === 'Positive' ? '#00d09c' : aiData.sentiment === 'Negative' ? '#ff4757' : '#ffa502'}
                  />
                  <StatBox label="Annual Volatility" value={aiData.volatility} icon={TrendingUp} />
                  <StatBox 
                    label="Risk Assessment" 
                    value={aiData.risk} 
                    icon={ShieldAlert} 
                    color={aiData.risk === 'High' ? '#ff4757' : '#00d09c'} 
                  />
                </div>
                <div style={{ marginTop: '20px', padding: '15px', background: '#000', borderRadius: '12px', textAlign: 'center', border: '1px dashed #333' }}>
                  <span style={{color: '#808b96', fontSize: '14px'}}>System Recommendation: </span>
                  <span style={{ fontWeight: '900', color: aiData.recommendation === 'BUY' ? '#00d09c' : aiData.recommendation === 'SELL' ? '#ff4757' : '#ffa502', marginLeft: '10px', fontSize: '20px' }}>
                    {aiData.recommendation}
                  </span>
                </div>
              </div>
            )}

            {/* Price Chart */}
            <div style={{ background: '#0f1216', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h2 style={{margin: 0}}>{data.symbol} Market Performance</h2>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>₹{data.price}</p>
              </div>
              <div style={{ height: '250px', marginTop: '20px' }}>
                <ResponsiveContainer>
                  <AreaChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="price" stroke="#00d09c" fillOpacity={0.1} fill="#00d09c" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><BarChart3 size={20} color="#00d09c" /> Key Statistics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <StatBox label="P/E Ratio" value={data.stats.pe || "N/A"} />
                  <StatBox label="52W High" value={`₹${data.stats.high52}`} />
                </div>
              </div>

              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><Activity size={20} color="#00d09c" /> Market Status</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                   <StatBox label="RSI Index" value={data.rsi} color={data.rsi > 70 ? '#ff4757' : data.rsi < 30 ? '#00d09c' : '#fff'} />
                   <StatBox label="Signal" value={data.advice} color={data.color} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#5d6d7e' }}>
              <BrainCircuit size={60} style={{ marginBottom: '15px', opacity: 0.1 }} />
              <p style={{fontSize: '18px'}}>Enter a stock symbol to generate an AI Intelligence Report</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
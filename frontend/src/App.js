import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Search, BarChart3, Newspaper } from 'lucide-react';

const STOCK_SUGGESTIONS = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN", "ZOMATO", "TATAMOTORS"];

function App() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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
    
    console.log("Fetching data for:", stock); // Debugging line

    try {
      const res = await axios.get(`http://127.0.0.1:8000/stock/${stock}`);
      console.log("Response Received:", res.data); // Debugging line
      
      if (res.data.error) {
        alert(res.data.error);
        setData(null);
      } else {
        setData(res.data);
      }
    } catch (err) { 
      console.error("Axios Error:", err);
      alert("Backend se connect nahi ho pa raha! Check if server is running on port 8000."); 
    }
    setLoading(false);
  };

  const StatBox = ({ label, value }) => (
    <div style={{ background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
      <p style={{ color: '#808b96', fontSize: '12px', margin: '0 0 5px 0' }}>{label}</p>
      <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#00d09c', display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingUp /> TradePulse AI</h1>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', margin: '30px 0' }}>
          <div style={{ display: 'flex', gap: '10px', background: '#111', padding: '10px', borderRadius: '12px', border: '1px solid #2d3436' }}>
            <Search style={{ marginTop: '10px', marginLeft: '10px' }} color="#5d6d7e" />
            <input 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} 
              placeholder="Search Stock (e.g. TCS, RELIANCE)..." 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && getAnalysis()}
            />
            <button onClick={() => getAnalysis()} style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', backgroundColor: '#00d09c', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', width: '100%', background: '#111', border: '1px solid #222', borderRadius: '8px', zIndex: 10, marginTop: '5px' }}>
              {suggestions.map(s => <div key={s} onClick={() => {setTicker(s); getAnalysis(s);}} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #222' }}>{s}</div>)}
            </div>
          )}
        </div>

        {/* Display Data only if it exists */}
        {data ? (
          <div style={{ display: 'grid', gap: '30px' }}>
            {/* Header & Chart */}
            <div style={{ background: '#0f1216', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{margin: 0}}>{data.symbol}</h2>
                  <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>₹{data.price}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ background: data.color, color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {data.advice}
                  </div>
                  <p style={{color: '#808b96'}}>RSI: <span style={{color: '#fff'}}>{data.rsi}</span></p>
                </div>
              </div>
              <div style={{ height: '300px' }}>
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

            {/* Stats */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><BarChart3 size={20} color="#00d09c" /> Key Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                <StatBox label="Market Cap" value={data.stats.mCap !== "N/A" ? `₹${(data.stats.mCap / 10000000).toFixed(2)} Cr` : "N/A"} />
                <StatBox label="P/E Ratio" value={data.stats.pe || "N/A"} />
                <StatBox label="52W High" value={`₹${data.stats.high52}`} />
                <StatBox label="52W Low" value={`₹${data.stats.low52}`} />
              </div>
            </div>

            {/* News */}
            {data.news && data.news.length > 0 && (
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><Newspaper size={20} color="#00d09c" /> Latest Market News</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {data.news.map((n, i) => (
                    <div key={i} style={{ background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '500', lineHeight: '1.4' }}>{n.title}</p>
                      <span style={{ fontSize: '12px', color: '#5d6d7e' }}>Source: {n.publisher}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#5d6d7e' }}>
              <Activity size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
              <p>Enter a stock ticker to start analysis</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
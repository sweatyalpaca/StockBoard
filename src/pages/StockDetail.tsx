import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bell, Wallet, ChevronRight, Activity, Percent, Maximize2, Loader2 } from 'lucide-react';
import { mockStockDetail } from '../data/mockData';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, AreaChart, Area } from 'recharts';

export default function StockDetail() {
  const { id } = useParams();
  const [stock, setStock] = useState(mockStockDetail);
  const [chartView, setChartView] = useState('1D');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch quote
        const quoteRes = await fetch(`/api/quote/${id}`);
        if (quoteRes.ok) {
          const data = await quoteRes.json();
          setStock(prev => ({
            ...prev,
            price: data.regularMarketPrice || prev.price,
            changeAmount: data.regularMarketChange || prev.changeAmount,
            changePercentage: data.regularMarketChangePercent || prev.changePercentage,
            isUp: (data.regularMarketChangePercent || 0) >= 0,
            name: data.shortName || prev.name,
            stats: {
              ...prev.stats,
              open: data.regularMarketOpen?.toLocaleString() || prev.stats.open,
              high: data.regularMarketDayHigh?.toLocaleString() || prev.stats.high,
              low: data.regularMarketDayLow?.toLocaleString() || prev.stats.low,
              vol: data.regularMarketVolume ? (data.regularMarketVolume / 1000000).toFixed(1) + 'M' : prev.stats.vol,
              mktCap: data.marketCap ? (data.marketCap / 1000000000).toFixed(1) + 'B' : prev.stats.mktCap,
              peRatio: data.trailingPE?.toFixed(2) || prev.stats.peRatio,
              high52w: data.fiftyTwoWeekHigh?.toLocaleString() || prev.stats.high52w,
            }
          }));
        }

        // Fetch chart data depending on view
        let interval = '5m';
        let range = '1d';
        if (chartView === '1W') { interval = '15m'; range = '5d'; }
        else if (chartView === '1M') { interval = '1d'; range = '1mo'; }
        else if (chartView === '1Y') { interval = '1d'; range = '1y'; }
        else if (chartView === 'ALL') { interval = '1wk'; range = 'max'; }

        const chartRes = await fetch(`/api/chart/${id}?interval=${interval}&range=${range}`);
        if (chartRes.ok) {
           const cData = await chartRes.json();
           if (cData?.quotes && cData.quotes.length > 0) {
             const formattedChart = cData.quotes.map((q: any) => ({
               time: new Date(q.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               price: q.close
             })).filter((q: any) => q.price !== null);
             setChartData(formattedChart);
           }
        }
      } catch (error) {
        console.error("Error fetching detail data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id, chartView]);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">

        <div>
          <nav className="flex items-center gap-1 text-slate-500 text-xs font-semibold mb-2">
            <Link to="/" className="hover:text-emerald-500">Market</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{stock.market}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">{stock.name}</span>
          </nav>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-4">
            {stock.name}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {stock.price.toLocaleString()} <span className="text-xl text-slate-500">{stock.currency}</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${stock.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {stock.isUp ? '+' : ''}{stock.changePercentage}% Today
            </span>
            <span className="text-xs font-semibold text-slate-400">{stock.symbol}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-900 text-sm font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <Bell className="w-4 h-4" /> Set Alert
          </button>
          <button className="bg-emerald-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Wallet className="w-4 h-4" /> Trade Now
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Price Chart Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {['1D', '1W', '1M', '1Y', 'ALL'].map((timeStr) => (
                  <button 
                    key={timeStr}
                    onClick={() => setChartView(timeStr)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${chartView === timeStr ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {timeStr}
                  </button>
                ))}
              </div>
              <button className="text-slate-400 hover:text-emerald-500">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-[400px] w-full relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      labelStyle={{color: '#64748b', fontWeight: 600, fontSize: 12}}
                      itemStyle={{color: '#0f172a', fontWeight: 700}}
                    />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Market Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Open', value: stock.stats.open },
                { label: 'High', value: stock.stats.high },
                { label: 'Low', value: stock.stats.low },
                { label: 'Vol', value: stock.stats.vol },
                { label: 'Mkt Cap', value: stock.stats.mktCap },
                { label: 'P/E Ratio', value: stock.stats.peRatio },
                { label: 'Div Yield', value: stock.stats.divYield },
                { label: '52W High', value: stock.stats.high52w },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Order Book & Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Book */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Order Book</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Live</span>
            </div>
            
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="relative h-8 flex items-center justify-between px-3 overflow-hidden rounded bg-red-50 border-r-4 border-red-500">
                  <span className="text-slate-900 font-bold z-10 text-sm">75,600</span>
                  <span className="text-red-500 font-mono font-bold z-10 text-sm">24,150</span>
                </div>
                <div className="relative h-8 flex items-center justify-between px-3 overflow-hidden rounded bg-red-50 border-r-2 border-red-400">
                  <span className="text-slate-900 font-bold z-10 text-sm">75,500</span>
                  <span className="text-red-500 font-mono font-bold z-10 text-sm">18,200</span>
                </div>
              </div>
              
              <div className="py-2 border-y border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Spread</span>
                <span className="text-slate-900 font-mono font-bold text-sm">100 (0.13%)</span>
              </div>
              
              <div className="space-y-1">
                <div className="relative h-8 flex items-center justify-between px-3 overflow-hidden rounded bg-emerald-50 border-r-4 border-emerald-500">
                  <span className="text-slate-900 font-bold z-10 text-sm">75,400</span>
                  <span className="text-emerald-500 font-mono font-bold z-10 text-sm">32,450</span>
                </div>
                <div className="relative h-8 flex items-center justify-between px-3 overflow-hidden rounded bg-emerald-50 border-r-2 border-emerald-400">
                  <span className="text-slate-900 font-bold z-10 text-sm">75,300</span>
                  <span className="text-emerald-500 font-mono font-bold z-10 text-sm">12,900</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Latest Insights</h3>
            <div className="space-y-6">
              {[
                { label: 'CHIP MARKET', title: 'Samsung expands foundry capacity for AI chips', time: '2 hours ago' },
                { label: 'FINANCIALS', title: 'Quarterly profit forecasts beat analyst estimates', time: '5 hours ago' }
              ].map((news, i) => (
                <div key={i} className="group cursor-pointer flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-emerald-600 font-black mb-1">{news.label}</p>
                    <h4 className="font-bold text-slate-900 leading-tight group-hover:text-emerald-500 transition-colors text-sm">{news.title}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-2">{news.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-emerald-600 font-bold text-sm border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-colors">
              View More News
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid for Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        
        {/* Revenue & Profit Trends */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Revenue & Profit Trends</h3>
              <p className="text-slate-500">Annual performance metrics (Trillion KRW)</p>
            </div>
            <select className="bg-transparent text-emerald-600 text-sm font-bold focus:outline-none cursor-pointer">
              <option>Annual</option>
              <option>Quarterly</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full mt-4 flex items-end relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stock.annualPerformance} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" name="Revenue" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60}>
                   {stock.annualPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === stock.annualPerformance.length - 1 ? '#34d399' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex gap-6 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
              <span className="text-xs font-bold text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
              <span className="text-xs font-bold text-slate-600">Net Profit</span>
            </div>
          </div>
        </div>

        {/* Side Cards: ROE and PER */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          {/* ROE Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-2xl font-bold text-slate-900">ROE</h3>
                <Percent className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-slate-500">Return on Equity</p>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-slate-900">17.2</span>
                <span className="text-emerald-500 text-sm font-bold">High Yield</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[72%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* PER Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-2xl font-bold text-slate-900">PER</h3>
                <Activity className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-500">Price to Earnings Ratio</p>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-slate-900">12.8</span>
                <span className="text-slate-500 text-sm font-bold">Market Avg: 15.4</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Under</span>
                <div className="flex-1 mx-4 h-[2px] bg-slate-100 relative">
                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></div>
                </div>
                <span>Over</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Comparison Analysis</h3>
          <button className="text-emerald-600 text-sm font-bold hover:underline">View Peer Analysis</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 border-b border-slate-100">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 border-b border-slate-100">Market Cap</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 border-b border-slate-100">PER (x)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 border-b border-slate-100">ROE (%)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 border-b border-slate-100">Dividend Yield</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 border-b border-slate-100">Debt-to-Equity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stock.peerAnalysis.map((peer, i) => (
                <tr key={i} className={`transition-colors ${peer.isMain ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4 font-bold text-slate-900">{peer.name}</td>
                  <td className="px-6 py-4 text-slate-600">{peer.cap}</td>
                  <td className={`px-6 py-4 font-bold ${peer.isMain ? 'text-emerald-600' : 'text-slate-600'}`}>{peer.per}</td>
                  <td className="px-6 py-4 text-slate-600">{peer.roe}</td>
                  <td className="px-6 py-4 text-slate-600">{peer.div}</td>
                  <td className="px-6 py-4 text-slate-600">{peer.debt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

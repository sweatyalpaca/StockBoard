import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, Zap, Globe, PlusCircle, MinusCircle, Receipt, BellRing, Eye, Loader2 } from 'lucide-react';
import { mockPortfolio } from '../data/mockData';

export default function Dashboard() {
  const [holdings, setHoldings] = useState(mockPortfolio.holdings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const symbols = mockPortfolio.holdings.map(h => h.id).join(',');
        const response = await fetch(`/api/quotes?symbols=${symbols}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const updatedHoldings = mockPortfolio.holdings.map(holding => {
            const quote = data.find((q: any) => q.symbol === holding.id);
            if (quote) {
              return {
                ...holding,
                price: quote.regularMarketPrice || holding.price,
                change: quote.regularMarketChangePercent || holding.change,
                isUp: (quote.regularMarketChangePercent || 0) >= 0
              };
            }
            return holding;
          });
          setHoldings(updatedHoldings);
        }
      } catch (error) {
        console.error("Failed to fetch real-time quotes:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 10000); // 10 seconds refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 flex flex-col justify-center">
          <p className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-widest">Market Overview</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Global Markets are <span className="text-emerald-500">Bullish</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl">
            Technology leads the rally as semiconductor demand remains hit record highs. Your portfolio is up 4.2% today.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-sm">
              View Portfolio
            </button>
            <button className="border border-slate-200 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
              Daily Report
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Market Sentiment</h3>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
              <div className="w-[78%] h-full bg-emerald-500"></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Fear</span>
              <span className="text-xs font-bold text-emerald-600 uppercase">78 - Extreme Greed</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Zap className="text-emerald-500 w-5 h-5" fill="currentColor" />
                <span className="font-semibold text-slate-900">Volatility</span>
              </div>
              <span className="text-slate-900">{mockPortfolio.sentiment.volatility}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Globe className="text-emerald-500 w-5 h-5" />
                <span className="font-semibold text-slate-900">Global Trend</span>
              </div>
              <span className="text-slate-900">{mockPortfolio.sentiment.globalTrend}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stock List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {holdings.map((stock) => (
          <Link to={`/detail/${stock.id}`} key={stock.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
            {loading && (
               <div className="absolute top-2 right-2 flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse delay-75" />
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse delay-150" />
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse delay-300" />
               </div>
            )}
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                stock.symbol === 'NVDA' ? 'bg-slate-900' :
                stock.symbol === 'TSLA' ? 'bg-red-600' :
                stock.symbol === 'AMZN' ? 'bg-orange-500' : 'bg-blue-700'
              }`}>
                {stock.symbol.substring(0, 2)}
              </div>
              <span className={`font-semibold flex items-center gap-1 ${stock.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stock.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(stock.change)}%
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">{stock.name}</p>
              <p className="text-xl font-bold text-slate-900">{stock.symbol}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {stock.currency === 'KRW' ? '₩' : '$'}{stock.price.toLocaleString(undefined, { minimumFractionDigits: stock.currency === 'KRW' ? 0 : 2 })}
              </span>
              <span className="text-xs font-semibold text-slate-400">{stock.currency || 'USD'}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Insights */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Market Insights</h3>
            <button className="text-emerald-600 text-xs font-bold uppercase hover:underline">View All News</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 flex gap-6 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-24 h-24 rounded-xl bg-slate-200 flex-shrink-0" />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 font-bold rounded uppercase text-[10px] tracking-widest">
                      {i === 1 ? 'Technology' : 'Economy'}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-2">
                       {i === 1 ? 'Why Semiconductor stocks are expected to climb through Q4' : 'Federal Reserve maintains interest rates; markets react positively'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                    <span>{i === 1 ? '2 hours ago' : '5 hours ago'}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {i === 1 ? '1.2k' : '850'} reads
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-md">
            <h3 className="text-xl font-bold mb-4">Portfolio Value</h3>
            <div className="mb-6">
              <p className="text-emerald-100 text-xs font-bold uppercase">Total Balance</p>
              <p className="text-4xl font-black">${mockPortfolio.totalBalance.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2 text-emerald-200">
                <ArrowUpRight className="w-5 h-5" />
                <span className="font-bold">+{mockPortfolio.monthlyChangePercentage}% this month</span>
              </div>
            </div>
            <button className="w-full bg-white text-emerald-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Deposit Funds
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Buy Stock', icon: PlusCircle },
                { label: 'Sell Stock', icon: MinusCircle },
                { label: 'Transactions', icon: Receipt },
                { label: 'Alerts', icon: BellRing }
              ].map((action, idx) => {
                 const Icon = action.icon;
                 return (
                   <button key={idx} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 group">
                    <Icon className="text-emerald-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-600">{action.label}</span>
                   </button>
                 )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

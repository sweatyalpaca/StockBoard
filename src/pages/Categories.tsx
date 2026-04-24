import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Zap, Cpu, Leaf, Building2, TrendingUp, Loader2 } from 'lucide-react';
import { mockCategories } from '../data/mockData';

export default function Categories() {
  const [activeTab, setActiveTab] = useState('Domestic');
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const symbols = mockCategories.map(c => c.id).join(',');
        const response = await fetch(`/api/quotes?symbols=${symbols}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const updatedCategories = mockCategories.map(cat => {
            const quote = data.find((q: any) => q.symbol === cat.id);
            if (quote) {
              return {
                ...cat,
                price: quote.regularMarketPrice || cat.price,
                change: quote.regularMarketChangePercent || cat.change,
                isUp: (quote.regularMarketChangePercent || 0) >= 0
              };
            }
            return cat;
          });
          setCategories(updatedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch real-time category quotes:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block">Market Intelligence</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Categories</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['Domestic', 'International', 'ETF'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-white shadow-sm text-emerald-600' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Performance */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden group shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Market Performance</h3>
              <p className="text-slate-500">Aggregate trend analysis across domestic sectors.</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Live Updates</span>
          </div>
          
          <div className="h-64 flex items-end gap-2 mb-8">
            {/* Simple simulated bar chart */}
            {[40, 60, 30, 80, 50, 70, 95, 55, 35].map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-sm transition-all duration-500`}
                style={{ height: `${h}%`, backgroundColor: i === 6 ? '#10b981' : '#a7f3d0' }}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Volatility</p>
              <p className="text-2xl font-bold text-slate-900">12.4%</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Bullish</p>
              <p className="text-2xl font-bold text-emerald-600">68.2%</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Div</p>
              <p className="text-2xl font-bold text-slate-900">3.12%</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Market Cap</p>
              <p className="text-2xl font-bold text-slate-900">$1.4T</p>
            </div>
          </div>
        </div>

        {/* Focus Sector */}
        <div className="lg:col-span-4 bg-emerald-500 text-white p-8 rounded-2xl flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-4 text-emerald-100">
              <Zap className="w-5 h-5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">Technology Sector</span>
            </div>
            <h3 className="text-3xl font-bold leading-tight mb-4">Tech remains the primary growth engine this quarter.</h3>
          </div>
          <div className="bg-emerald-600/50 backdrop-blur-sm p-4 rounded-xl border border-emerald-400/30">
            <p className="text-xs font-bold text-emerald-100 mb-1">Quarterly Peak</p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold">+24.5%</p>
              <TrendingUp className="w-8 h-8 opacity-50" />
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-slate-900">Leading Asset Categories</h3>
            <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Asset Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Price (USD)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">24h Change</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 relative">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="p-0">
                         <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                           <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                         </div>
                      </td>
                    </tr>
                  )}
                  {categories.map((cat) => {
                    const Icon = cat.icon === 'cpu' ? Cpu : cat.icon === 'leaf' ? Leaf : Building2;
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                              cat.icon === 'cpu' ? 'bg-blue-600' : cat.icon === 'leaf' ? 'bg-orange-500' : 'bg-slate-700'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-slate-900">{cat.name}</p>
                              <p className="text-xs font-semibold text-slate-500">NYSE: {cat.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-lg font-bold text-slate-900">${cat.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold flex items-center gap-1 ${cat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                            {cat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(cat.change)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                            Details
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

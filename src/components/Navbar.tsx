import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Market', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-2">
        <TrendingUp className="text-emerald-500 w-6 h-6" />
        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">StockBoard</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 mr-4">
          {navLinks.map((link) => {
             const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
             return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-500'}`}
              >
                {link.name}
              </Link>
             )
          })}
        </div>
        
        <button className="p-2 hover:bg-slate-100 transition-colors rounded-full active:opacity-70">
          <Search className="w-5 h-5 text-slate-500" />
        </button>

        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold overflow-hidden cursor-pointer">
          <span className="text-xs">JW</span>
        </div>
      </div>
    </header>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutGrid, Wallet, Settings } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Market', path: '/', icon: Activity },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
    { name: 'Portfolio', path: '/portfolio', icon: Wallet },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-5 bg-white border-t border-slate-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex flex-col items-center justify-center transition-colors active:scale-95 duration-150 ${isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  );
}

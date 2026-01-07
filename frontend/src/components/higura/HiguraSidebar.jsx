import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import higuraLogo from '../../../higura_logo.png';

const nav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/transactions', label: 'Transactions', icon: Wallet },
  { to: '/app/products', label: 'Stocks', icon: BarChart3 },
  { to: '/app/clients', label: 'Customers', icon: Users },
  { to: '/app/rentals', label: 'Rentals', icon: ShoppingCart },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/settings/company', label: 'Settings', icon: Settings },
];

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? 'bg-green-50 text-green-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function HiguraSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
      <div className="h-16 px-4 flex items-center gap-2 border-b border-gray-200">
        <img src={higuraLogo} alt="Higura Decor" className="h-8 w-8 object-contain" />
        <div className="font-semibold text-gray-900">Higura Decor</div>
      </div>

      <div className="p-3 flex-1 overflow-auto">
        <nav className="space-y-1">
          {nav.map((n) => (
            <NavItem key={n.to} to={n.to} label={n.label} icon={n.icon} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

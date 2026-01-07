import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useHiguraAuth } from '../../context/HiguraAuthContext';

export default function HiguraTopbar() {
  const navigate = useNavigate();
  const { logout } = useHiguraAuth();

  const onLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch {
      // ignore
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
            B
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-gray-900">Higura User</div>
            <div className="text-xs text-gray-500">Higura Decor</div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="ml-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

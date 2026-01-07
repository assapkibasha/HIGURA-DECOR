import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function HiguraOverdueBanner() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get('/rentals', { params: { page: 1, limit: 1, overdue: true } });
        const total = res?.data?.data?.total;
        if (mounted) setCount(Number.isFinite(Number(total)) ? Number(total) : 0);
      } catch {
        if (mounted) setCount(0);
      }
    };

    load();
    const id = setInterval(load, 60_000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!count) return null;

  return (
    <div className="bg-red-50 border-b border-red-200">
      <button
        type="button"
        onClick={() => navigate('/app/rentals?tab=overdue')}
        className="w-full text-left px-6 py-2 text-sm text-red-700 hover:bg-red-100"
      >
        Overdue rentals: <span className="font-semibold">{count}</span> — click to view
      </button>
    </div>
  );
}

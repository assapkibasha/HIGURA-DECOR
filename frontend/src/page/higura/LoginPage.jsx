import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { API_URL } from '../../api/api';
import { useHiguraAuth } from '../../context/HiguraAuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useHiguraAuth();

  const from = location.state?.from || '/app/dashboard';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!API_URL) {
      setError('Missing VITE_API_URL');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/users/login', { identifier, password });
      const accessToken = res?.data?.accessToken;

      if (!accessToken) {
        throw new Error('Login failed: missing accessToken');
      }

      await login(accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Login failed';
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">Higura Decor</div>
          <div className="mt-1 text-sm text-gray-500">Sign in to continue</div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1">
            <div className="text-xs text-gray-500">Email or Username</div>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              autoComplete="username"
            />
          </label>

          <label className="block space-y-1">
            <div className="text-xs text-gray-500">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

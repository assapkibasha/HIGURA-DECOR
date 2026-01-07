import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return '';
  }
}

export default function ClientsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const canSubmit = useMemo(() => {
    const base = name.trim().length > 0 && phone.trim().length > 0;
    if (!base) return false;
    if (!nationalId.trim()) return true;
    return /^\d{16}$/.test(nationalId.trim());
  }, [name, phone, nationalId]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/customers', { params: { page: 1, limit: 50 } });
      const list = res?.data?.data?.items || [];
      setItems(list);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to load customers';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        nationalId: nationalId.trim() ? nationalId.trim() : undefined,
      };
      const res = await api.post('/customers', payload);
      const created = res?.data?.data;
      if (created?.id) {
        setItems((prev) => [created, ...prev]);
      } else {
        await load();
      }

      setIsAddOpen(false);
      setName('');
      setPhone('');
      setNationalId('');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create customer';
      setSaveError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-gray-900">Customers</div>
          <div className="text-sm text-gray-500">Manage your customer base</div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Add New Customer
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white border border-gray-200 p-6 text-sm text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 p-6 text-sm text-gray-500">No customers</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.id} className="rounded-xl bg-white border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.phoneE164}</div>
                  {c.nationalId && <div className="mt-1 text-xs text-gray-500">National ID: {c.nationalId}</div>}
                  <div className="mt-1 text-xs text-gray-400">Joined {formatDate(c.createdAt)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6">
            <div className="text-lg font-semibold text-gray-900">Add Customer</div>

            <form className="mt-4 space-y-4" onSubmit={onCreate}>
              <label className="block space-y-1">
                <div className="text-xs text-gray-500">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="block space-y-1">
                <div className="text-xs text-gray-500">Phone</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="block space-y-1">
                <div className="text-xs text-gray-500">National ID (16 digits)</div>
                <input
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              {saveError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!canSubmit || saving}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  type="submit"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

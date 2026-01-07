import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api';

function safeNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [dailyLateFee, setDailyLateFee] = useState('1000');
  const [reorderThreshold, setReorderThreshold] = useState('2');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      color.trim().length > 0 &&
      size.trim().length > 0 &&
      safeNumber(quantity, -1) >= 0
    );
  }, [name, color, size, quantity]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/stocks', { params: { page: 1, limit: 50 } });
      const list = res?.data?.data?.items || [];
      setItems(list);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to load stocks';
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
        color: color.trim(),
        size: size.trim(),
        quantity: safeNumber(quantity, 0),
        dailyLateFee: safeNumber(dailyLateFee, 1000),
        reorderThreshold: safeNumber(reorderThreshold, 2),
        imageUrls: [],
      };

      const res = await api.post('/stocks', payload);
      const created = res?.data?.data;
      if (created?.id) {
        setItems((prev) => [created, ...prev]);
      } else {
        await load();
      }

      setIsAddOpen(false);
      setName('');
      setColor('');
      setSize('');
      setQuantity('0');
      setDailyLateFee('1000');
      setReorderThreshold('2');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create stock';
      setSaveError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-gray-900">Stocks</div>
          <div className="text-sm text-gray-500">Manage inventory items</div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Add Stock
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Stock Items</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No stocks</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Color</th>
                  <th className="text-left font-medium px-4 py-3">Size</th>
                  <th className="text-left font-medium px-4 py-3">Qty</th>
                  <th className="text-left font-medium px-4 py-3">Reorder At</th>
                  <th className="text-left font-medium px-4 py-3">Daily Late Fee</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => {
                  const threshold = s.reorderThreshold ?? 2;
                  const isLow = s.quantity < 2 || s.quantity <= threshold;
                  return (
                  <tr key={s.id} className={`border-t ${isLow ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3">{s.color}</td>
                    <td className="px-4 py-3">{s.size}</td>
                    <td className={`px-4 py-3 ${isLow ? 'font-semibold text-red-700' : ''}`}>{s.quantity}</td>
                    <td className="px-4 py-3">{threshold}</td>
                    <td className="px-4 py-3">{s.dailyLateFee}</td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-gray-200 p-6">
            <div className="text-lg font-semibold text-gray-900">Add Stock</div>

            <form className="mt-4 space-y-4" onSubmit={onCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <div className="text-xs text-gray-500">Name</div>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="block space-y-1">
                  <div className="text-xs text-gray-500">Color</div>
                  <input value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="block space-y-1">
                  <div className="text-xs text-gray-500">Size</div>
                  <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="block space-y-1">
                  <div className="text-xs text-gray-500">Quantity</div>
                  <input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <div className="text-xs text-gray-500">Daily Late Fee</div>
                  <input value={dailyLateFee} onChange={(e) => setDailyLateFee(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <div className="text-xs text-gray-500">Reorder Threshold</div>
                  <input value={reorderThreshold} onChange={(e) => setReorderThreshold(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </label>
              </div>

              {saveError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50">
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

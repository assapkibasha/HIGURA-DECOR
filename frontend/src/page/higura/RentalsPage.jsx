import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/api';

function toDateInputValue(d) {
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
}

function nowDateInput() {
  return toDateInputValue(new Date());
}

function formatDateTime(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '';
  }
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return '';
  }
}

function safeInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function daysRemaining(deadlineDate) {
  const now = new Date();
  const d = new Date(deadlineDate);
  if (Number.isNaN(d.getTime())) return null;

  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startOfDeadline = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const diffMs = startOfDeadline.getTime() - startOfToday.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

export default function RentalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab = tabParam === 'overdue' || tabParam === 'returned' || tabParam === 'active' ? tabParam : 'active';

  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  // create form
  const [customerMode, setCustomerMode] = useState('existing'); // existing | new
  const [customerId, setCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerNationalId, setNewCustomerNationalId] = useState('');

  const [customerSearch, setCustomerSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');

  const [deadlineDate, setDeadlineDate] = useState(nowDateInput());
  const [paidAmount, setPaidAmount] = useState('0');
  const [items, setItems] = useState([{ stockId: '', qty: '1' }]);
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // return form
  const [paidOnReturn, setPaidOnReturn] = useState('0');
  const [returning, setReturning] = useState(false);
  const [returnError, setReturnError] = useState(null);

  const customerById = useMemo(() => {
    return new Map(customers.map((c) => [c.id, c]));
  }, [customers]);

  const stockById = useMemo(() => {
    return new Map(stocks.map((s) => [s.id, s]));
  }, [stocks]);

  const loadAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const [rentalsRes, customersRes, stocksRes] = await Promise.all([
        api.get('/rentals', {
          params:
            tab === 'active'
              ? { page: 1, limit: 50, status: 'rented' }
              : tab === 'overdue'
                ? { page: 1, limit: 50, overdue: true }
                : { page: 1, limit: 50, status: 'returned' },
        }),
        api.get('/customers', { params: { page: 1, limit: 200 } }),
        api.get('/stocks', { params: { page: 1, limit: 200 } }),
      ]);

      setRentals(rentalsRes?.data?.data?.items || []);
      setCustomers(customersRes?.data?.data?.items || []);
      setStocks(stocksRes?.data?.data?.items || []);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to load rentals';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [tab]);

  const setTab = (next) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('tab', next);
      return p;
    });
  };

  const canCreate = useMemo(() => {
    const hasCustomer =
      customerMode === 'existing'
        ? customerId.trim().length > 0
        : newCustomerName.trim().length > 0 && newCustomerPhone.trim().length > 0;

    const hasDeadline = deadlineDate.trim().length > 0;

    const hasItems = items.length > 0 && items.every((i) => i.stockId && safeInt(i.qty, 0) > 0);

    return hasCustomer && hasDeadline && hasItems;
  }, [customerMode, customerId, newCustomerName, newCustomerPhone, deadlineDate, items]);

  const openCreate = () => {
    setIsCreateOpen(true);
    setSaveError(null);
    setSaving(false);
    setCustomerMode('new');
    setCustomerId('');
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerNationalId('');
    setCustomerSearch('');
    setStockSearch('');
    setDeadlineDate(nowDateInput());
    setPaidAmount('0');
    setItems([{ stockId: '', qty: '1' }]);
    setNotes('');
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { stockId: '', qty: '1' }]);
  };

  const removeItemRow = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const onCreateRental = async (e) => {
    e.preventDefault();
    if (!canCreate) return;

    setSaving(true);
    setSaveError(null);

    try {
      let finalCustomerId = customerId;

      if (customerMode === 'new') {
        const res = await api.post('/customers', {
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          nationalId: newCustomerNationalId.trim() ? newCustomerNationalId.trim() : undefined,
        });
        const createdCustomer = res?.data?.data;
        if (!createdCustomer?.id) throw new Error('Failed to create customer');

        finalCustomerId = createdCustomer.id;
        setCustomers((prev) => [createdCustomer, ...prev]);
      }

      const payload = {
        customerId: finalCustomerId,
        deadlineDate: new Date(`${deadlineDate}T00:00:00.000Z`).toISOString(),
        paidAmount: safeInt(paidAmount, 0),
        items: items.map((i) => ({ stockId: i.stockId, qty: safeInt(i.qty, 1) })),
        notes: notes.trim() ? notes.trim() : undefined,
      };

      await api.post('/rentals', payload);

      setIsCreateOpen(false);
      await loadAll();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create rental';
      setSaveError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const openReturn = (rental) => {
    setSelectedRental(rental);
    setPaidOnReturn('0');
    setReturnError(null);
    setReturning(false);
    setIsReturnOpen(true);
  };

  const onReturnRental = async (e) => {
    e.preventDefault();
    if (!selectedRental?.id) return;

    setReturning(true);
    setReturnError(null);

    try {
      await api.patch(`/rentals/${selectedRental.id}/return`, {
        paidOnReturn: safeInt(paidOnReturn, 0),
      });
      setIsReturnOpen(false);
      setSelectedRental(null);
      await loadAll();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to return rental';
      setReturnError(String(msg));
    } finally {
      setReturning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-gray-900">Rentals</div>
          <div className="text-sm text-gray-500">Rent and return stock items</div>
        </div>

        <button onClick={openCreate} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
          New Rental
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab('active')}
          className={`rounded-lg px-3 py-2 text-sm border ${tab === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          Active
        </button>
        <button
          onClick={() => setTab('overdue')}
          className={`rounded-lg px-3 py-2 text-sm border ${tab === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          Overdue
        </button>
        <button
          onClick={() => setTab('returned')}
          className={`rounded-lg px-3 py-2 text-sm border ${tab === 'returned' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          Returned
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Rentals</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : rentals.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No rentals</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Customer</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">Deadline</th>
                  <th className="text-left font-medium px-4 py-3">Days</th>
                  <th className="text-left font-medium px-4 py-3">Paid</th>
                  <th className="text-left font-medium px-4 py-3">Items</th>
                  <th className="text-right font-medium px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => {
                  const c = customerById.get(r.customerId);
                  const dr = daysRemaining(r.deadlineDate);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{c?.name || r.customerId}</div>
                        <div className="text-xs text-gray-500">{c?.phoneE164 || ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            r.status === 'rented'
                              ? tab === 'overdue'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-yellow-50 text-yellow-700'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatDate(r.deadlineDate)}</td>
                      <td className={`px-4 py-3 ${typeof dr === 'number' && dr < 0 ? 'font-semibold text-red-700' : ''}`}
                      >
                        {typeof dr === 'number' ? dr : ''}
                      </td>
                      <td className="px-4 py-3">{r.paidAmount}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">
                          {(r.items || []).slice(0, 2).map((it) => {
                            const s = stockById.get(it.stockId);
                            return (
                              <div key={it.id}>
                                {s ? `${s.name} (${s.color}/${s.size})` : it.stockId} x{it.qty}
                              </div>
                            );
                          })}
                          {(r.items || []).length > 2 && <div>+{(r.items || []).length - 2} more</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status === 'rented' ? (
                          <button
                            onClick={() => openReturn(r)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            Return
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Returned {r.returnedOn ? formatDateTime(r.returnedOn) : ''}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-gray-200 p-6">
            <div className="text-lg font-semibold text-gray-900">New Rental</div>
            <div className="text-sm text-gray-500">Register customer while renting to save time</div>

            <form className="mt-4 space-y-4" onSubmit={onCreateRental}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerMode('new')}
                  className={`rounded-lg px-3 py-2 text-sm border ${customerMode === 'new' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                  New Customer
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode('existing')}
                  className={`rounded-lg px-3 py-2 text-sm border ${customerMode === 'existing' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                  Existing Customer
                </button>
              </div>

              {customerMode === 'new' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block space-y-1">
                    <div className="text-xs text-gray-500">Customer name</div>
                    <input
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block space-y-1">
                    <div className="text-xs text-gray-500">Customer phone</div>
                    <input
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block space-y-1 md:col-span-2">
                    <div className="text-xs text-gray-500">National ID (16 digits)</div>
                    <input
                      value={newCustomerNationalId}
                      onChange={(e) => setNewCustomerNationalId(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block space-y-1">
                    <div className="text-xs text-gray-500">Search customer</div>
                    <input
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block space-y-1">
                    <div className="text-xs text-gray-500">Select customer</div>
                    <select
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
                    >
                      <option value="">Select...</option>
                      {customers
                        .filter((c) => {
                          const q = customerSearch.trim().toLowerCase();
                          if (!q) return true;
                          return (
                            c.name?.toLowerCase().includes(q) ||
                            c.phoneE164?.toLowerCase().includes(q) ||
                            c.nationalId?.toLowerCase().includes(q)
                          );
                        })
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.phoneE164})
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block space-y-1">
                  <div className="text-xs text-gray-500">Deadline</div>
                  <input
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    type="date"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block space-y-1">
                  <div className="text-xs text-gray-500">Paid amount</div>
                  <input
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block space-y-1 md:col-span-1">
                  <div className="text-xs text-gray-500">Notes</div>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Items</div>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Add item
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                      <label className="block space-y-1 md:col-span-8">
                        <div className="text-xs text-gray-500">Stock</div>
                        <div className="mb-2">
                          <input
                            value={stockSearch}
                            onChange={(e) => setStockSearch(e.target.value)}
                            placeholder="Search stock..."
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          />
                        </div>
                        <select
                          value={it.stockId}
                          onChange={(e) => updateItem(idx, { stockId: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
                        >
                          <option value="">Select...</option>
                          {stocks
                            .filter((s) => {
                              const q = stockSearch.trim().toLowerCase();
                              if (!q) return true;
                              return (
                                s.name?.toLowerCase().includes(q) ||
                                s.color?.toLowerCase().includes(q) ||
                                s.size?.toLowerCase().includes(q)
                              );
                            })
                            .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.color}/{s.size}) - Qty {s.quantity}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block space-y-1 md:col-span-3">
                        <div className="text-xs text-gray-500">Qty</div>
                        <input
                          value={it.qty}
                          onChange={(e) => updateItem(idx, { qty: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <div className="md:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          disabled={items.length === 1}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {saveError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!canCreate || saving}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  type="submit"
                >
                  {saving ? 'Saving...' : 'Create Rental'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReturnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsReturnOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6">
            <div className="text-lg font-semibold text-gray-900">Return Rental</div>
            <div className="mt-1 text-sm text-gray-500">Add payment on return (optional)</div>

            <form className="mt-4 space-y-4" onSubmit={onReturnRental}>
              <label className="block space-y-1">
                <div className="text-xs text-gray-500">Paid on return</div>
                <input
                  value={paidOnReturn}
                  onChange={(e) => setPaidOnReturn(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              {returnError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{returnError}</div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReturnOpen(false)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={returning}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  type="submit"
                >
                  {returning ? 'Returning...' : 'Return'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

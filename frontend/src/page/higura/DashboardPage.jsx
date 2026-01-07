export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-gray-900">Dashboard</div>
        <div className="text-sm text-gray-500">Here’s what’s happening with your business.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="text-xs text-gray-500">Today’s Sales</div>
          <div className="mt-2 text-2xl font-semibold">RF 0</div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="text-xs text-gray-500">Expenses</div>
          <div className="mt-2 text-2xl font-semibold">RF 0</div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="text-xs text-gray-500">Profit</div>
          <div className="mt-2 text-2xl font-semibold">RF 0</div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="text-xs text-gray-500">Outstanding Debt</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">RF 0</div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-900">Sales Trend</div>
        <div className="mt-4 h-64 rounded-lg bg-gray-50 border border-dashed border-gray-200" />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-gray-900">Reports</div>
          <div className="text-sm text-gray-500">Cash inflows and outflows</div>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            Export XLSX
          </button>
          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            Export PDF
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <div className="text-center text-sm font-semibold text-gray-900">CASH FLOW STATEMENT</div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-xs font-semibold text-green-700">CASH INFLOWS</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Cash Sales</span><span className="text-green-700">+RF 0</span></div>
              <div className="flex justify-between"><span>Debt Collections</span><span className="text-green-700">+RF 0</span></div>
              <div className="flex justify-between"><span>Other Cash Income</span><span className="text-green-700">+RF 0</span></div>
              <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 flex justify-between font-semibold">
                <span>Total Inflows</span><span>RF 0</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-red-700">CASH OUTFLOWS</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Operating Expenses</span><span className="text-red-700">-RF 0</span></div>
              <div className="flex justify-between"><span>Purchases</span><span className="text-red-700">-RF 0</span></div>
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 flex justify-between font-semibold">
                <span>Total Outflows</span><span>RF 0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 px-3 py-2 flex justify-between font-semibold">
          <span>NET CASH FLOW</span><span className="text-blue-700">RF 0</span>
        </div>
      </div>
    </div>
  );
}

import { Search } from 'lucide-react';

export default function HiguraTopbar() {
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
        </div>
      </div>
    </header>
  );
}

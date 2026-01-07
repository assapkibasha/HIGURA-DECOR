export default function SettingsCompanyForm() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="text-sm font-semibold text-gray-900">Company Settings</div>
      <div className="text-sm text-gray-500">Business Profile</div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1">
          <div className="text-xs text-gray-500">Company Name</div>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1">
          <div className="text-xs text-gray-500">Email Address</div>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1">
          <div className="text-xs text-gray-500">Phone Number</div>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1">
          <div className="text-xs text-gray-500">Address</div>
          <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}

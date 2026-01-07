export default function SettingsUsersPage() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="text-sm font-semibold text-gray-900">Users</div>
      <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left font-medium px-4 py-3">Name</th>
              <th className="text-left font-medium px-4 py-3">Role</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">Admin</td>
              <td className="px-4 py-3">admin</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">active</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

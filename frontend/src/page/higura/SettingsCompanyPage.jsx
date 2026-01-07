import { NavLink, Outlet } from 'react-router-dom';

function SettingsNav() {
  const itemBase = 'block px-3 py-2 rounded-lg text-sm font-medium';

  return (
    <div className="w-full lg:w-64">
      <div className="rounded-xl bg-white border border-gray-200 p-2">
        <NavLink
          to="/app/settings/company"
          className={({ isActive }) =>
            `${itemBase} ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          Company
        </NavLink>
        <NavLink
          to="/app/settings/users"
          className={({ isActive }) =>
            `${itemBase} ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          Users
        </NavLink>
      </div>
    </div>
  );
}

export default function SettingsCompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-gray-900">Settings</div>
        <div className="text-sm text-gray-500">Manage your business profile and preferences</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsNav />

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

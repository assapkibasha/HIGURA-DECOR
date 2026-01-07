import { Outlet } from 'react-router-dom';
import HiguraOverdueBanner from '../components/higura/HiguraOverdueBanner';
import HiguraSidebar from '../components/higura/HiguraSidebar';
import HiguraTopbar from '../components/higura/HiguraTopbar';

export default function HiguraLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <HiguraSidebar />

        <div className="flex-1 min-w-0">
          <HiguraTopbar />
          <HiguraOverdueBanner />

          <main className="px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

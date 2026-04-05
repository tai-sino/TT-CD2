import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div>
      <Sidebar />
      <main className="ml-64 min-h-screen bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}

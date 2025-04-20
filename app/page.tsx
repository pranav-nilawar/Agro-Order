"use client";

import Order from './Order/page';
import TrackOrder from './TrackOrder/page';
import AdminDashboard from './protected/AdminDashboard/page';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './context/AuthContext'; 

function App() {
  const { role } = useAuth(); 

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8">
      {/* Protected Order and TrackOrder - require user to be authenticated */}
      <RequireAuth>
        <Order />
        <TrackOrder />
      </RequireAuth>

      <AdminDashboard />
    </div>
  );
}

export default App;




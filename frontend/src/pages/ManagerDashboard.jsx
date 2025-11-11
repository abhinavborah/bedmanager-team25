import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { Briefcase, BedDouble, Users, Activity } from 'lucide-react';

const ManagerDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Manager Dashboard</h1>
          </div>
          <p className="text-zinc-400">
            Welcome, <span className="text-cyan-400">{currentUser?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ward Overview Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <BedDouble className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ward Management</h3>
            <p className="text-zinc-400 text-sm">
              Manage wards and bed allocations
            </p>
          </div>

          {/* Staff Management Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Users className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Staff Overview</h3>
            <p className="text-zinc-400 text-sm">
              View and coordinate ward staff
            </p>
          </div>

          {/* Activity Monitor Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Activity Monitor</h3>
            <p className="text-zinc-400 text-sm">
              Real-time ward activity updates
            </p>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Manager Capabilities</h2>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Manage specific wards and bed allocations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Coordinate ward staff activities
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              View ward-specific analytics and reports
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Patient bed assignment oversight
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

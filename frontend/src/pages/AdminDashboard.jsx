import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { Crown, BarChart3, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-zinc-400">
            Welcome, <span className="text-cyan-400">{currentUser?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <BarChart3 className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hospital Overview</h3>
            <p className="text-zinc-400 text-sm">
              View hospital-wide statistics and analytics
            </p>
          </div>

          {/* User Management Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-zinc-400 text-sm">
              Manage staff, roles, and permissions
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Settings className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">System Settings</h3>
            <p className="text-zinc-400 text-sm">
              Configure hospital and system settings
            </p>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Admin Capabilities</h2>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Full access to all hospital data and analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              User and role management across all wards
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              System configuration and settings
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Reports and audit logs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

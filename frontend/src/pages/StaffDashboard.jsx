import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { Stethoscope, BedDouble, ClipboardList, Bell } from 'lucide-react';

const StaffDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold">Staff Dashboard</h1>
          </div>
          <p className="text-zinc-400">
            Welcome, <span className="text-cyan-400">{currentUser?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bed Management Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <BedDouble className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Bed Management</h3>
            <p className="text-zinc-400 text-sm">
              Update bed status and patient info
            </p>
          </div>

          {/* Task List Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <ClipboardList className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Task List</h3>
            <p className="text-zinc-400 text-sm">
              View assigned tasks and updates
            </p>
          </div>

          {/* Notifications Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Bell className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Notifications</h3>
            <p className="text-zinc-400 text-sm">
              Important alerts and messages
            </p>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Staff Capabilities</h2>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Update individual bed status and availability
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Manage patient bed assignments
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              View assigned ward information
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Receive and respond to task notifications
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { PlusCircle, BarChart2, Grid, Users, Settings } from 'lucide-react';
import CreatePollForm from '../components/admin/CreatePollForm';
import PollManagement from '../components/admin/PollManagement';
import Card, { CardContent } from '../components/ui/Card';
import { usePolls } from '../context/PollContext';

// Dashboard overview component
const DashboardOverview: React.FC = () => {
  const { polls } = usePolls();
  
  // Calculate statistics
  const activePolls = polls.filter(poll => poll.status === 'active').length;
  const completedPolls = polls.filter(poll => poll.status === 'completed').length;
  const totalBets = polls.reduce((sum, poll) => 
    sum + poll.options.reduce((acc, opt) => acc + opt.bettorCount, 0), 0);
  const totalBetAmount = polls.reduce((sum, poll) => sum + poll.totalBetAmount, 0);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
              <Grid size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Polls</p>
              <p className="text-2xl font-bold">{polls.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
              <BarChart2 size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Polls</p>
              <p className="text-2xl font-bold">{activePolls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Bets</p>
              <p className="text-2xl font-bold">{totalBets}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4">
              <Settings size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold">${totalBetAmount}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Quick overview of recent activities would appear here.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link 
                to="/admin/create-poll" 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <PlusCircle size={18} className="mr-2 text-purple-600" />
                <span>Create New Poll</span>
              </Link>
              <Link 
                to="/admin/manage-polls" 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <BarChart2 size={18} className="mr-2 text-blue-600" />
                <span>Manage Existing Polls</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-lg">Navigation</h2>
              </div>
              
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/admin"
                      className={`flex items-center px-3 py-2 rounded-md ${
                        location.pathname === '/admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <BarChart2 size={18} className="mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/create-poll"
                      className={`flex items-center px-3 py-2 rounded-md ${
                        location.pathname === '/admin/create-poll'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <PlusCircle size={18} className="mr-2" />
                      Create Poll
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/manage-polls"
                      className={`flex items-center px-3 py-2 rounded-md ${
                        location.pathname === '/admin/manage-polls'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Grid size={18} className="mr-2" />
                      Manage Polls
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="create-poll" element={<CreatePollForm />} />
                <Route path="manage-polls" element={<PollManagement />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

import React from 'react';
import { TrendingUp, Users, Flame, PieChart } from 'lucide-react';
import Card from './ui/Card';
import { useToken } from '../context/TokenContext';

const TokenMetrics: React.FC = () => {
  const { tokenPrice, marketCap, holders, burnedTokens } = useToken();
  
  return (
    <div>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        Coming Soon!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
              <div className="flex items-center">
                <p className="text-xl font-bold">Coming Soon!</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <PieChart className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
              <p className="text-xl font-bold">Coming Soon!</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
              <Users className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">HOLDERS</p>
              <p className="text-xl font-bold">250,000</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
              <Flame className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Burned</p>
              <p className="text-xl font-bold">1.5B MEMEX</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TokenMetrics;

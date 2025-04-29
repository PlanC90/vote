import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, TrendingUp, Trophy } from 'lucide-react';
import { usePolls } from '../context/PollContext';
import { useAuth } from '../context/AuthContext';
import PollCard from '../components/polls/PollCard';
import TokenMetrics from '../components/TokenMetrics';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { polls } = usePolls();
  const { user } = useAuth();
  
  const activePolls = polls
    .filter(poll => poll.status === 'active')
    .sort((a, b) => b.totalBetAmount - a.totalBetAmount)
    .slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative w-full bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8 py-12">
            {/* Hero Image */}
            <div className="w-full lg:w-1/2">
              <img 
                src="https://r.resimlink.com/5mtpsrSQK.png"
                alt="Hero Banner"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="bg-gray-900/80 p-4 rounded-lg backdrop-blur">
                <h3 className="text-white text-xl font-semibold mb-2">Predict & Vote</h3>
                <p className="text-gray-300">
                  Participate in community decisions by staking MEMEX tokens on your predictions
                </p>
              </div>

              <div className="bg-gray-900/80 p-4 rounded-lg backdrop-blur">
                <h3 className="text-white text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-gray-300">
                  Get rewarded with MEMEX tokens for making accurate predictions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Metrics */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <TokenMetrics />
        </div>
      </section>
      
      {/* Featured Markets */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Markets
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Explore our most popular prediction markets
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/polls')}
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              View All Markets
            </Button>
          </div>
          
          {activePolls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePolls.map(poll => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Vote size={64} className="mx-auto text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">No Active Markets</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                New prediction markets are coming soon. Stay tuned!
              </p>
              <Button
                variant="primary"
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
                onClick={() => navigate('/register')}
              >
                Get Notified
              </Button>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

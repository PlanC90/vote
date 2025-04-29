import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import { usePolls } from '../context/PollContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import BetForm from '../components/polls/BetForm';
import { getTimeRemaining, formatDate } from '../utils/date';

const PollDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPoll } = usePolls();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [poll, setPoll] = useState(id ? getPoll(id) : undefined);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  // Effect to start a timer for countdown
  useEffect(() => {
    if (!poll) return;
    
    // Update time remaining immediately
    const updateTimeRemaining = () => {
      const time = getTimeRemaining(new Date(poll.endDate));
      setTimeRemaining({
        days: time.days,
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
      });
    };
    
    // Initial update
    updateTimeRemaining();
    
    // Set up interval to update every second
    const intervalId = setInterval(updateTimeRemaining, 1000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [poll]);
  
  // Refresh poll data on form submission
  const handleBetSuccess = () => {
    if (id) {
      setPoll(getPoll(id));
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'secondary';
      case 'canceled':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/polls')}
            className="mb-6"
          >
            Back to Polls
          </Button>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Poll Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The poll you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/polls')}
            >
              Browse All Polls
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate total bettors
  const totalBettors = poll.options.reduce((acc, option) => acc + option.bettorCount, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/polls')}
          className="mb-6"
        >
          Back to Polls
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poll Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant={getStatusColor(poll.status)}>{poll.status}</Badge>
                  <Badge variant="primary">{poll.category}</Badge>
                </div>
                <CardTitle className="text-2xl">{poll.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {poll.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>End Date: {formatDate(new Date(poll.endDate))}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users size={16} />
                    <span>Total Bettors: {totalBettors}</span>
                  </div>
                </div>
                
                {/* Show countdown if active */}
                {poll.status === 'active' && timeRemaining && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock size={18} className="mr-2 text-purple-500" />
                      Time Remaining
                    </h3>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <div className="text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {timeRemaining.days}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                      </div>
                      
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <div className="text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {timeRemaining.hours}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
                      </div>
                      
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <div className="text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {timeRemaining.minutes}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
                      </div>
                      
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <div className="text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {timeRemaining.seconds}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Seconds</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Options with current statistics */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium mb-2">Poll Options</h3>
                  
                  {poll.options.map((option) => {
                    // Calculate percentage of total bets
                    const percentage = poll.totalBetAmount > 0
                      ? Math.round((option.betAmount / poll.totalBetAmount) * 100)
                      : 0;
                      
                    // Check if this is the winning option for completed polls
                    const isWinner = poll.status === 'completed' && poll.correctOptionId === option.id;
                    
                    return (
                      <div 
                        key={option.id} 
                        className={`
                          p-4 rounded-lg border relative overflow-hidden
                          ${isWinner 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : 'border-gray-200 dark:border-gray-700'}
                        `}
                      >
                        {/* Background progress bar */}
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-purple-100 dark:bg-purple-900/20 z-0" 
                          style={{ width: `${percentage}%` }}
                        />
                        
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {option.text}
                              {isWinner && (
                                <span className="ml-2 text-green-600 dark:text-green-400">
                                  (Winner)
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {option.bettorCount} {option.bettorCount === 1 ? 'bettor' : 'bettors'} • ${option.betAmount}
                            </div>
                          </div>
                          <div className="text-lg font-bold">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Final result for completed polls */}
                {poll.status === 'completed' && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                    <h3 className="text-lg font-medium mb-2">Poll Result</h3>
                    
                    <div className="text-gray-600 dark:text-gray-400">
                      <p>
                        The correct option was: <span className="font-medium text-green-600 dark:text-green-400">
                          {poll.options.find(o => o.id === poll.correctOptionId)?.text}
                        </span>
                      </p>
                      <p className="mt-1">
                        Winnings have been distributed to users who bet on the correct option.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Bet Form */}
          <div>
            {poll.status === 'active' ? (
              <BetForm poll={poll} onSuccess={handleBetSuccess} />
            ) : (
              <Card>
                <CardContent className="p-5">
                  <div className="text-center py-8">
                    <AlertTriangle size={32} className="mx-auto text-amber-500 mb-2" />
                    <h3 className="text-lg font-medium mb-2">
                      {poll.status === 'completed' 
                        ? 'Poll has ended' 
                        : 'Poll is unavailable'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {poll.status === 'completed'
                        ? 'This poll has been concluded and is no longer accepting bets.'
                        : 'This poll is currently unavailable for betting.'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/polls')}
                    >
                      Browse Other Polls
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Show user's current bet if they already placed one */}
            {user && poll.options.some(option => option.bettorCount > 0) && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-lg font-medium mb-3">Your Bets</h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View your current bets and track your potential winnings.
                </p>
                
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/profile')}
                >
                  View My Betting History
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetailPage;

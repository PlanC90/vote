import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { usePolls } from '../../context/PollContext';
import { useAuth } from '../../context/AuthContext';
import { Poll, PollOption } from '../../types';

interface BetFormProps {
  poll: Poll;
  onSuccess?: () => void;
}

const BetForm: React.FC<BetFormProps> = ({ poll, onSuccess }) => {
  const { user } = useAuth();
  const { placeBet } = usePolls();
  
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to place a bet');
      return;
    }
    
    if (!selectedOption) {
      setError('Please select an option to bet on');
      return;
    }
    
    if (betAmount <= 0) {
      setError('Bet amount must be greater than 0');
      return;
    }
    
    if (betAmount > (user?.balance || 0)) {
      setError('Insufficient MEMEX balance');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await placeBet(poll.id, selectedOption, betAmount);
      setSuccess('Your bet has been placed successfully!');
      
      // Clear form
      setSelectedOption('');
      setBetAmount(10);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculatePotentialReturn = () => {
    if (!selectedOption || betAmount <= 0) return 0;
    
    const option = poll.options.find(opt => opt.id === selectedOption);
    if (!option) return 0;
    
    const totalBet = poll.totalBetAmount + betAmount;
    const optionTotal = option.betAmount + betAmount;
    
    return (totalBet / optionTotal) * betAmount;
  };
  
  const potentialReturn = calculatePotentialReturn();
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4">Place Your Bet</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select an option to bet on
          </label>
          <div className="space-y-2">
            {poll.options.map((option: PollOption) => (
              <div 
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`
                  p-3 rounded-md border cursor-pointer transition-all
                  ${selectedOption === option.id 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}
                `}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{option.text}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Current pool: {option.betAmount} MEMEX (from {option.bettorCount} bettors)
                    </div>
                  </div>
                  <div className="ml-2">
                    <div 
                      className={`
                        w-5 h-5 rounded-full border-2
                        ${selectedOption === option.id 
                          ? 'border-purple-500 bg-purple-500' 
                          : 'border-gray-300 dark:border-gray-600'}
                      `}
                    >
                      {selectedOption === option.id && (
                        <span className="flex h-full items-center justify-center text-white">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <Input
            type="number"
            min={1}
            max={user?.balance || 0}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            leftAddon="MEMEX"
            label="Bet Amount"
            fullWidth
          />
          
          {selectedOption && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Balance: {user?.balance?.toFixed(2) || 0} MEMEX → Potential return: {potentialReturn.toFixed(2)} MEMEX
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isSubmitting} 
          disabled={!selectedOption || betAmount <= 0 || isSubmitting || !user}
          fullWidth
        >
          Place Bet
        </Button>
        
        {!user && (
          <p className="mt-2 text-sm text-red-600">
            You need to login to place a bet
          </p>
        )}
      </form>
    </div>
  );
};

export default BetForm;

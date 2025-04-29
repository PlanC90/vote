import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Poll, PollOption, Bet } from '../types';
import { useAuth } from './AuthContext';

interface PollContextType {
  polls: Poll[];
  userBets: Bet[];
  createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'updatedAt' | 'totalBetAmount'>) => void;
  placeBet: (pollId: string, optionId: string, amount: number) => Promise<void>;
  concludePoll: (pollId: string, correctOptionId: string) => void;
  getPoll: (id: string) => Poll | undefined;
  getUserBets: (userId: string) => Bet[];
}

const PollContext = createContext<PollContextType | undefined>(undefined);

const POLL_CREATION_COST = 5_000_000; // 5 million MEMEX

const INITIAL_POLLS: Poll[] = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100,000 by the end of 2025?',
    description: 'Place your bets on whether Bitcoin will reach this milestone price by December 31, 2025.',
    options: [
      { id: '1a', text: 'Yes', betAmount: 500, bettorCount: 12 },
      { id: '1b', text: 'No', betAmount: 300, bettorCount: 8 },
    ],
    createdBy: '1',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    totalBetAmount: 800,
    category: 'Cryptocurrency',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  // ... other initial polls
];

const INITIAL_BETS: Bet[] = [
  {
    id: 'b1',
    userId: '2',
    pollId: '1',
    optionId: '1a',
    amount: 50,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  // ... other initial bets
];

interface PollProviderProps {
  children: ReactNode;
}

export const PollProvider = ({ children }: PollProviderProps) => {
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [userBets, setUserBets] = useState<Bet[]>(INITIAL_BETS);
  const { user } = useAuth();

  const createPoll = (pollData: Omit<Poll, 'id' | 'createdAt' | 'updatedAt' | 'totalBetAmount'>) => {
    if (!user) throw new Error('User must be logged in to create a poll');
    
    if (user.balance < POLL_CREATION_COST) {
      throw new Error(`Insufficient balance. You need ${POLL_CREATION_COST.toLocaleString()} MEMEX to create a poll`);
    }

    const newPoll: Poll = {
      ...pollData,
      id: Math.random().toString(36).substr(2, 9),
      totalBetAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPolls(prevPolls => [...prevPolls, newPoll]);

    // Deduct creation cost from user's balance
    const updatedUser = {
      ...user,
      balance: user.balance - POLL_CREATION_COST
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const placeBet = async (pollId: string, optionId: string, amount: number) => {
    if (!user) throw new Error('User must be logged in to place a bet');
    if (amount <= 0) throw new Error('Bet amount must be greater than 0');
    
    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const newBet: Bet = {
      id: `bet_${Math.random().toString(36).substring(2, 11)}`,
      userId: user.id,
      pollId,
      optionId,
      amount,
      createdAt: new Date(),
      status: 'active',
    };
    
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === optionId) {
              return {
                ...option,
                betAmount: option.betAmount + amount,
                bettorCount: option.bettorCount + 1,
              };
            }
            return option;
          });
          
          return {
            ...poll,
            options: updatedOptions,
            totalBetAmount: poll.totalBetAmount + amount,
            updatedAt: new Date(),
          };
        }
        return poll;
      })
    );
    
    setUserBets(prevBets => [...prevBets, newBet]);
    
    const updatedUser = { ...user, balance: user.balance - amount };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return Promise.resolve();
  };

  const concludePoll = (pollId: string, correctOptionId: string) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            status: 'completed',
            correctOptionId,
            updatedAt: new Date(),
          };
        }
        return poll;
      })
    );
    
    const targetPoll = polls.find(p => p.id === pollId);
    if (!targetPoll) return;
    
    const totalBetAmount = targetPoll.totalBetAmount;
    const winningOptionBetAmount = targetPoll.options.find(o => o.id === correctOptionId)?.betAmount || 0;
    
    setUserBets(prevBets => 
      prevBets.map(bet => {
        if (bet.pollId === pollId) {
          if (bet.optionId === correctOptionId) {
            const payout = bet.amount + (bet.amount / winningOptionBetAmount) * (totalBetAmount - winningOptionBetAmount);
            return { ...bet, status: 'won', payout };
          } else {
            return { ...bet, status: 'lost', payout: 0 };
          }
        }
        return bet;
      })
    );
  };

  const getPoll = (id: string) => {
    return polls.find(poll => poll.id === id);
  };

  const getUserBets = (userId: string) => {
    return userBets.filter(bet => bet.userId === userId);
  };

  return (
    <PollContext.Provider
      value={{
        polls,
        userBets,
        createPoll,
        placeBet,
        concludePoll,
        getPoll,
        getUserBets,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

export const usePolls = () => {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePolls must be used within a PollProvider');
  }
  return context;
};

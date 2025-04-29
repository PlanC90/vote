export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  balance: number;
  walletAddress: string;
  avatar?: string;
  createdAt: Date;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdBy: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'canceled';
  correctOptionId?: string;
  totalBetAmount: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  rewardDistributed?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  betAmount: number;
  bettorCount: number;
}

export interface Bet {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  amount: number;
  createdAt: Date;
  status: 'active' | 'won' | 'lost';
  payout?: number;
  payoutProcessed?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  linkTo?: string;
}

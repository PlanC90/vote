import React, { useState } from 'react';
import { User, Wallet, History, Award, Copy, ExternalLink, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePolls } from '../context/PollContext';
import TokenDeposit from '../components/TokenDeposit';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import { formatDate, formatDistanceToNow } from '../utils/date';

const ProfilePage = () => {
  const { user, updateWalletAddress } = useAuth();
  const { polls, userBets } = usePolls();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState(user?.walletAddress || '');
  const [walletError, setWalletError] = useState<string | null>(null);

  if (!user) return null;

  // Get user's bets with poll details
  const myBets = userBets
    .filter(bet => bet.userId === user.id)
    .map(bet => {
      const poll = polls.find(p => p.id === bet.pollId);
      const option = poll?.options.find(o => o.id === bet.optionId);
      return {
        ...bet,
        pollTitle: poll?.title || 'Unknown Poll',
        optionText: option?.text || 'Unknown Option',
        pollStatus: poll?.status || 'unknown',
      };
    });

  // Calculate statistics
  const totalBets = myBets.length;
  const wonBets = myBets.filter(bet => bet.status === 'won').length;
  const activeBets = myBets.filter(bet => bet.status === 'active').length;
  const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;

  // Calculate total winnings and losses
  const totalWinnings = myBets
    .filter(bet => bet.status === 'won')
    .reduce((sum, bet) => sum + (bet.payout || 0), 0);

  const totalLosses = myBets
    .filter(bet => bet.status === 'lost')
    .reduce((sum, bet) => sum + bet.amount, 0);

  // Get polls created by user
  const createdPolls = polls.filter(poll => poll.createdBy === user.id);

  const handleWalletUpdate = async () => {
    try {
      await updateWalletAddress(newWalletAddress);
      setIsEditingWallet(false);
      setWalletError(null);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Failed to update wallet address');
    }
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(user.walletAddress);
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* User Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <User size={40} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">{user.username}</h2> {/* Added text-gray-100 */}
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  <Badge
                    variant={user.role === 'admin' ? 'primary' : 'secondary'}
                    className="mt-2"
                  >
                    {user.role === 'admin' ? 'Administrator' : 'Member'}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      MEMEX Wallet Address
                    </label>
                    {isEditingWallet ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newWalletAddress}
                            onChange={(e) => setNewWalletAddress(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                            placeholder="Enter wallet address"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleWalletUpdate}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingWallet(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                        {walletError && (
                          <p className="text-sm text-red-600">{walletError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <code className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm flex-1">
                          {user.walletAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyWalletAddress}
                          title="Copy address"
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingWallet(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(new Date(user.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <Wallet className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                    <p className="text-xl font-bold">{user.balance.toLocaleString()} MEMEX</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <History className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Bets</p>
                    <p className="text-xl font-bold">{totalBets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <Award className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                    <p className="text-xl font-bold">{winRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <Award className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
                    <p className={`text-xl font-bold ${
                      totalWinnings - totalLosses > 0
                        ? 'text-green-600'
                        : totalWinnings - totalLosses < 0
                          ? 'text-red-600'
                          : ''
                    }`}>
                      {(totalWinnings - totalLosses).toLocaleString()} MEMEX
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-100">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setIsDepositModalOpen(true)}
                    leftIcon={<Wallet size={16} />}
                  >
                    Add MEMEX Tokens
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => window.location.href = '/polls'}
                    leftIcon={<History size={16} />}
                  >
                    Browse Prediction Markets
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-100">Active Bets</h3>
                {activeBets > 0 ? (
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      You have {activeBets} active predictions
                    </p>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => document.getElementById('active-bets-tab')?.click()}
                      rightIcon={<ChevronRight size={16} />}
                    >
                      View Active Bets
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any active predictions
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'active-bets',
      label: 'Active Bets',
      content: (
        <div className="space-y-4">
          {myBets.filter(bet => bet.status === 'active').map(bet => (
            <Card key={bet.id} hoverable>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium mb-1">{bet.pollTitle}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Your prediction: <span className="font-medium">{bet.optionText}</span>
                    </p>
                    <div className="text-sm text-gray-500">
                      Placed {formatDistanceToNow(new Date(bet.createdAt))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="warning" size="md" className="mb-2">
                      Active
                    </Badge>
                    <div className="text-xl font-bold">
                      {bet.amount.toLocaleString()} MEMEX
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {myBets.filter(bet => bet.status === 'active').length === 0 && (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <History size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Active Bets</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any active predictions at the moment
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/polls'}
              >
                Browse Markets
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'betting-history',
      label: 'Betting History',
      content: (
        <div className="space-y-4">
          {myBets.filter(bet => bet.status !== 'active').map(bet => (
            <Card key={bet.id} hoverable>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium mb-1">{bet.pollTitle}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Your prediction: <span className="font-medium">{bet.optionText}</span>
                    </p>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(bet.createdAt))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant={bet.status === 'won' ? 'success' : 'danger'}
                      size="md"
                      className="mb-2"
                    >
                      {bet.status === 'won' ? 'Won' : 'Lost'}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Bet amount: {bet.amount.toLocaleString()} MEMEX
                    </div>
                    {bet.status === 'won' && bet.payout && (
                      <div className="text-lg font-bold text-green-600">
                        +{bet.payout.toLocaleString()} MEMEX
                      </div>
                    )}
                    {bet.status === 'lost' && (
                      <div className="text-lg font-bold text-red-600">
                        -{bet.amount.toLocaleString()} MEMEX
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {myBets.filter(bet => bet.status !== 'active').length === 0 && (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <History size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Betting History</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't completed any predictions yet
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/polls'}
              >
                Start Betting
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'created-polls',
      label: 'Created Polls',
      content: (
        <div className="space-y-4">
          {createdPolls.map(poll => (
            <Card key={poll.id} hoverable>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium mb-1">{poll.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {poll.options.length} options • {poll.options.reduce((sum, opt) => sum + opt.bettorCount, 0)} bettors
                    </p>
                    <div className="text-sm text-gray-500">
                      Created {formatDistanceToNow(new Date(poll.createdAt))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant={
                        poll.status === 'active'
                          ? 'success'
                          : poll.status === 'completed'
                            ? 'secondary'
                            : 'danger'
                      }
                      size="md"
                      className="mb-2"
                    >
                      {poll.status}
                    </Badge>
                    <div className="text-lg font-bold">
                      {poll.totalBetAmount.toLocaleString()} MEMEX
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {createdPolls.length === 0 && (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <History size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Created Polls</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't created any prediction markets yet
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/polls'}
              >
                Create Poll
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tabs tabs={tabs} />
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <TokenDeposit onClose={() => setIsDepositModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

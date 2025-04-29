import React, { useState } from 'react';
import { Trash2, CheckCircle, AlignLeft, Users, Calendar } from 'lucide-react';
import { usePolls } from '../../context/PollContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { Poll } from '../../types';

const PollManagement: React.FC = () => {
  const { polls, concludePoll } = usePolls();
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConcludeModalOpen, setIsConcludeModalOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  
  const handleDelete = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsDeleteModalOpen(true);
  };
  
  const handleConclude = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsConcludeModalOpen(true);
  };
  
  const confirmDelete = () => {
    // This would call an API to delete the poll in a real app
    console.log('Delete poll:', selectedPoll?.id);
    setIsDeleteModalOpen(false);
  };
  
  const confirmConclude = () => {
    if (selectedPoll && selectedOptionId) {
      concludePoll(selectedPoll.id, selectedOptionId);
      setIsConcludeModalOpen(false);
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
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Manage Polls</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Bets
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {polls.map((poll) => (
              <tr key={poll.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{poll.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <AlignLeft size={14} className="mr-1" /> 
                    {poll.options.length} options
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="primary">{poll.category}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(poll.status)}>{poll.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {new Date(poll.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">${poll.totalBetAmount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <Users size={14} className="mr-1" />
                      {poll.options.reduce((sum, opt) => sum + opt.bettorCount, 0)} users
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {poll.status === 'active' && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<CheckCircle size={14} />}
                        onClick={() => handleConclude(poll)}
                      >
                        Conclude
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => handleDelete(poll)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                  
                  {poll.status === 'completed' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Completed
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Poll"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete the poll: <strong>{selectedPoll?.title}</strong>?</p>
          <p className="text-sm text-red-600">This action cannot be undone. All bets will be refunded.</p>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Conclude Poll Modal */}
      <Modal
        isOpen={isConcludeModalOpen}
        onClose={() => setIsConcludeModalOpen(false)}
        title="Conclude Poll"
        size="md"
      >
        <div className="space-y-4">
          <p>
            Select the correct option for poll: <strong>{selectedPoll?.title}</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will mark the poll as completed and distribute winnings to users who bet on the correct option.
          </p>
          
          <div className="space-y-2 mt-4">
            {selectedPoll?.options.map((option) => (
              <div 
                key={option.id} 
                onClick={() => setSelectedOptionId(option.id)}
                className={`
                  p-3 rounded-md border cursor-pointer
                  ${selectedOptionId === option.id 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700'}
                `}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{option.text}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${option.betAmount} from {option.bettorCount} bettors
                    </div>
                  </div>
                  <div 
                    className={`
                      w-5 h-5 rounded-full border-2
                      ${selectedOptionId === option.id 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-300 dark:border-gray-600'}
                    `}
                  >
                    {selectedOptionId === option.id && (
                      <span className="flex h-full items-center justify-center text-white">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsConcludeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmConclude}
              disabled={!selectedOptionId}
            >
              Conclude Poll
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PollManagement;

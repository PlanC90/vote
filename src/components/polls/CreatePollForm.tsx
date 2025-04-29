import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { usePolls } from '../../context/PollContext';
import { useAuth } from '../../context/AuthContext';

interface CreatePollFormProps {
  onSuccess?: () => void;
}

const POLL_CREATION_COST = 5_000_000; // 5 million MEMEX

const CreatePollForm: React.FC<CreatePollFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { createPoll } = usePolls();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cryptocurrency');
  const [endDate, setEndDate] = useState('');
  const [options, setOptions] = useState([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addOption = () => {
    setOptions([
      ...options, 
      { id: Math.random().toString(36).substr(2, 9), text: '' }
    ]);
  };
  
  const removeOption = (idToRemove: string) => {
    if (options.length <= 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    
    setOptions(options.filter(option => option.id !== idToRemove));
  };
  
  const updateOptionText = (id: string, text: string) => {
    setOptions(
      options.map(option => 
        option.id === id ? { ...option, text } : option
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a poll');
      return;
    }

    if (user.balance < POLL_CREATION_COST) {
      setError(`You need ${POLL_CREATION_COST.toLocaleString()} MEMEX tokens to create a poll`);
      return;
    }
    
    if (!title) {
      setError('Title is required');
      return;
    }
    
    if (!description) {
      setError('Description is required');
      return;
    }
    
    if (!endDate) {
      setError('End date is required');
      return;
    }
    
    const selectedEndDate = new Date(endDate);
    if (selectedEndDate <= new Date()) {
      setError('End date must be in the future');
      return;
    }
    
    if (options.some(option => !option.text)) {
      setError('All options must have text');
      return;
    }
    
    const optionTexts = options.map(option => option.text);
    if (new Set(optionTexts).size !== optionTexts.length) {
      setError('Options must be unique');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formattedOptions = options.map(option => ({
        ...option,
        betAmount: 0,
        bettorCount: 0,
      }));
      
      createPoll({
        title,
        description,
        options: formattedOptions,
        createdBy: user.id,
        startDate: new Date(),
        endDate: new Date(endDate),
        status: 'active',
        category,
      });
      
      setTitle('');
      setDescription('');
      setCategory('Cryptocurrency');
      setEndDate('');
      setOptions([
        { id: '1', text: '' },
        { id: '2', text: '' },
      ]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categories = [
    'Cryptocurrency',
    'Blockchain',
    'NFT',
    'DeFi',
    'Regulation',
    'Technology',
    'Market',
    'Gaming',
    'Sports',
    'Politics',
    'Entertainment',
    'Other',
  ];
  
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You must be logged in to create a poll
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/login'}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (user.balance < POLL_CREATION_COST) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You need {POLL_CREATION_COST.toLocaleString()} MEMEX tokens to create a poll.
          Your current balance: {user.balance.toLocaleString()} MEMEX
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/profile'}
        >
          Get More MEMEX
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-800 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <Input
            label="Poll Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Will Bitcoin reach $100k by the end of 2025?"
            fullWidth
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context about this poll..."
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="End Date"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            leftAddon={<Calendar size={16} />}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Poll Options
            </label>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOptionText(option.id, e.target.value)}
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    disabled={options.length <= 2}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              leftIcon={<Plus size={16} />}
              onClick={addOption}
            >
              Add Option
            </Button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p>Creating a poll costs {POLL_CREATION_COST.toLocaleString()} MEMEX tokens</p>
            <p>Your current balance: {user.balance.toLocaleString()} MEMEX</p>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              fullWidth
            >
              Create Poll
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePollForm;

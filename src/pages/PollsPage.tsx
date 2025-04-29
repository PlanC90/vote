import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Plus } from 'lucide-react';
import { usePolls } from '../context/PollContext';
import { useAuth } from '../context/AuthContext';
import PollCard from '../components/polls/PollCard';
import CreatePollForm from '../components/polls/CreatePollForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Poll } from '../types';

const PollsPage: React.FC = () => {
  const { polls } = usePolls();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>(polls);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Get unique categories from polls
  const categories = Array.from(new Set(polls.map(poll => poll.category)));
  
  // Apply filters when dependencies change
  useEffect(() => {
    let results = polls;
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(poll => 
        poll.title.toLowerCase().includes(lowercasedTerm) || 
        poll.description.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (selectedCategory) {
      results = results.filter(poll => poll.category === selectedCategory);
    }
    
    if (selectedStatus) {
      results = results.filter(poll => poll.status === selectedStatus);
    }
    
    results = [...results].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setFilteredPolls(results);
  }, [polls, searchTerm, selectedCategory, selectedStatus]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const handleCreatePollSuccess = () => {
    setShowCreateModal(false);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Polls
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
              Explore active and past polls across various cryptocurrency and blockchain topics. 
              Place your bets on outcomes and win rewards based on your predictions.
            </p>
          </div>

          {user && (
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Poll
            </Button>
          )}
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                fullWidth
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftAddon={<Search size={18} />}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                leftIcon={<SlidersHorizontal size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              
              {(searchTerm || selectedCategory || selectedStatus) && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Expanded filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Applied filters */}
          {(selectedCategory || selectedStatus) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <Badge variant="primary" size="md" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 text-xs"
                  >
                    ✕
                  </button>
                </Badge>
              )}
              
              {selectedStatus && (
                <Badge 
                  variant={
                    selectedStatus === 'active' 
                      ? 'success' 
                      : selectedStatus === 'completed' 
                        ? 'secondary' 
                        : 'danger'
                  } 
                  size="md" 
                  className="flex items-center gap-1"
                >
                  Status: {selectedStatus}
                  <button 
                    onClick={() => setSelectedStatus('')}
                    className="ml-1 text-xs"
                  >
                    ✕
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Poll grid */}
        {filteredPolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Filter size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No polls found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory || selectedStatus
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no polls available at the moment. Check back later."}
            </p>
            {(searchTerm || selectedCategory || selectedStatus) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Poll Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Poll"
        size="lg"
      >
        <CreatePollForm onSuccess={handleCreatePollSuccess} />
      </Modal>
    </div>
  );
};

export default PollsPage;

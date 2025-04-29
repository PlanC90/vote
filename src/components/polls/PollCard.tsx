import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Poll } from '../../types';
import { formatDistanceToNow } from '../../utils/date';

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const totalBettors = poll.options.reduce((acc, option) => acc + option.bettorCount, 0);
  const timeAgo = formatDistanceToNow(new Date(poll.createdAt));
  
  const endDate = new Date(poll.endDate).toLocaleDateString();
  
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
    <Card 
      hoverable 
      className="h-full transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={getStatusColor(poll.status)}>{poll.status}</Badge>
          <Badge variant="primary">{poll.category}</Badge>
        </div>
        <CardTitle className="text-xl">{poll.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {poll.description.length > 100 
            ? `${poll.description.substring(0, 100)}...` 
            : poll.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>Ends: {endDate}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{totalBettors} bettors</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <TrendingUp size={16} className="mr-1" />
              <span>Total: {poll.totalBetAmount} MEMEX</span>
            </div>
            <div>{timeAgo}</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900 pt-3">
        <Button 
          variant="primary"
          fullWidth
          onClick={() => navigate(`/polls/${poll.id}`)}
          className={`transform transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
        >
          View Poll
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollCard;

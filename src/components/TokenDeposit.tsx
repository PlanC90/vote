import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/TokenContext';
import Button from './ui/Button';

interface TokenDepositProps {
  onClose: () => void;
}

export const TokenDeposit: React.FC<TokenDepositProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { generateDepositAddress, verifyDeposit } = useToken();
  const [depositAddress, setDepositAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      generateDepositAddress(user.id).then((address) => {
        setDepositAddress(address);
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
  };

  const handleVerifyDeposit = async () => {
    if (!lastTxHash) return;
    
    setIsVerifying(true);
    try {
      const success = await verifyDeposit(lastTxHash);
      if (success) {
        // Refresh user balance or show success message
        onClose();
      }
    } catch (error) {
      console.error('Failed to verify deposit:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Add MEMEX to Your Account</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Send MEMEX tokens to your unique deposit address:
      </p>

      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin h-5 w-5 text-gray-500" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm break-all">{depositAddress}</code>
              <button
                onClick={handleCopyAddress}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="Copy address"
              >
                <Copy size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Only send MEMEX tokens from Omni XEP Wallet
            </p>
          </>
        )}
      </div>

      <div className="space-y-4">
        <Button
          variant="primary"
          fullWidth
          leftIcon={<ExternalLink size={16} />}
          onClick={() => window.open('https://omni.xep.fund/', '_blank')}
        >
          Open Omni XEP Wallet
        </Button>

        <Button
          variant="ghost"
          fullWidth
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default TokenDeposit;

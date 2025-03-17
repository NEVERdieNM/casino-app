import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withdraw } from '../../store/slices/walletSlice';

const WithdrawForm = () => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await dispatch(withdraw(parseFloat(amount))).unwrap();
      setAmount('');
    } catch (error) {
      console.error('Withdraw error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePresetAmounts = () => {
    if (balance <= 0) return [];
    
    const presets = [];
    const percentages = [0.25, 0.5, 0.75, 1]; // 25%, 50%, 75%, 100%
    
    percentages.forEach(percentage => {
      const amount = Math.floor(balance * percentage);
      if (amount > 0 && !presets.includes(amount)) {
        presets.push(amount);
      }
    });
    
    return presets;
  };

  const presetAmounts = calculatePresetAmounts();

  return (
    <div className="bg-casino-primary rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Withdraw Funds</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
              Amount (USD)
            </label>
            <span className="text-sm text-gray-400">
              Available: ${balance.toFixed(2)}
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={balance}
              step="0.01"
              className="form-input pl-8"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>
        
        {presetAmounts.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-400 mb-2">Quick Select</div>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors text-sm"
                  onClick={() => setAmount(preset.toString())}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center"
          disabled={isProcessing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            'Withdraw Now'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This is a demo application. No real money is involved.</p>
      </div>
    </div>
  );
};

export default WithdrawForm;
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deposit } from '../../store/slices/walletSlice';

const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await dispatch(deposit(parseFloat(amount))).unwrap();
      setAmount('');
    } catch (error) {
      console.error('Deposit error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="bg-casino-primary rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Make a Deposit</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            Amount (USD)
          </label>
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
              step="0.01"
              className="form-input pl-8"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Quick Select</div>
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors"
                onClick={() => setAmount(preset.toString())}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center"
          disabled={isProcessing || !amount || parseFloat(amount) <= 0}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            'Deposit Now'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This is a demo application. No real money is involved.</p>
      </div>
    </div>
  );
};

export default DepositForm;
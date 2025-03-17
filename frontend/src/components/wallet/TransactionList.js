import React from 'react';
import { format } from 'date-fns';

const TransactionList = ({ transactions }) => {
  const getTypeStyle = (type) => {
    switch (type) {
      case 'deposit':
        return 'text-casino-success';
      case 'withdrawal':
        return 'text-casino-danger';
      case 'bet':
        return 'text-casino-danger';
      case 'win':
        return 'text-casino-success';
      default:
        return 'text-white';
    }
  };

  const formatAmount = (amount, type) => {
    return type === 'deposit' || type === 'win' 
      ? `+${amount.toFixed(2)}` 
      : `-${amount.toFixed(2)}`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-casino-success" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'withdrawal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-casino-danger" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        );
      case 'bet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-casino-danger" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      case 'win':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-casino-success" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No transactions found
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white capitalize">
                        {transaction.type}
                      </div>
                      {transaction.gameId && (
                        <div className="text-xs text-gray-400">
                          Game: {transaction.gameId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getTypeStyle(transaction.type)}`}>
                    {formatAmount(transaction.amount, transaction.type)} {transaction.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${transaction.status === 'completed' ? 'bg-green-900 text-green-200' : 
                      transaction.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 
                      'bg-red-900 text-red-200'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;
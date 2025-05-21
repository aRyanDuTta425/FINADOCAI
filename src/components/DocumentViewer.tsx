import React, { useState } from 'react';
import { Document, Transaction } from '../types';

interface DocumentViewerProps {
  document: Document;
  transactions: Transaction[];
  onUpdateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
}

export default function DocumentViewer({ document, transactions, onUpdateTransaction }: DocumentViewerProps) {
  // Convert string dates to Date objects if needed
  const documentWithDates = {
    ...document,
    createdAt: document.createdAt instanceof Date ? document.createdAt : new Date(document.createdAt)
  };

  const transactionsWithDates = transactions.map(tx => ({
    ...tx,
    date: tx.date instanceof Date ? tx.date : new Date(tx.date),
    createdAt: tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt || Date.now()),
    updatedAt: tx.updatedAt instanceof Date ? tx.updatedAt : new Date(tx.updatedAt || Date.now())
  }));

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Document Details
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {documentWithDates.fileName}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              File Type
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {documentWithDates.fileType || 'Unknown'}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Status
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                documentWithDates.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800' 
                  : documentWithDates.status === 'ERROR'
                  ? 'bg-red-100 text-red-800'
                  : documentWithDates.status === 'PROCESSING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {documentWithDates.status ? documentWithDates.status.charAt(0).toUpperCase() + documentWithDates.status.slice(1) : 'Unknown'}
              </span>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Uploaded At
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {documentWithDates.createdAt.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Extracted Transactions
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {transactionsWithDates.length} transactions found in this document
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactionsWithDates.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} onUpdate={onUpdateTransaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionRow({ 
  transaction,
  onUpdate
}: {
  transaction: Transaction;
  onUpdate: (id: string, data: Partial<Transaction>) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  
  const handleSave = async () => {
    await onUpdate(transaction.id, { 
      description,
      amount,
      verified: true
    });
    setIsEditing(false);
  };
  
  // Default confidence to 0.5 if it's undefined
  const confidenceValue = transaction.confidence ?? 0.5;
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {transaction.date.toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        ) : (
          transaction.description
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        ) : (
          `₹${transaction.amount.toFixed(2)}`
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {transaction.category?.name || 'Uncategorized'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                confidenceValue > 0.8 
                  ? 'bg-green-600' 
                  : confidenceValue > 0.5 
                  ? 'bg-yellow-400' 
                  : 'bg-red-500'
              }`} 
              style={{ width: `${confidenceValue * 100}%` }}
            ></div>
          </div>
          <span className="ml-2">{Math.round(confidenceValue * 100)}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
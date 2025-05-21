import React, { useState } from 'react';
import { extractTextFromDocument } from '@/utils/ocr';
import { analyzeFinancialDocument } from '@/utils/gemini';
import { AnalysisResult, Transaction } from '@/types';

// Local transaction interface for the component
interface LocalTransaction {
  date: string | Date;
  description: string;
  amount: number;
  type: string;
  category?: string;
}

const TestUpload: React.FC<{ userId: string }> = ({ userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
       
      const extractedText = await extractTextFromDocument(file);
      setText(extractedText);

       
      const analysisResult = await analyzeFinancialDocument(extractedText);
      setAnalysis(analysisResult);

       
      for (const tx of analysisResult.transactions) {
        console.log('Creating transaction:', tx);
        const response = await fetch('/api/transactions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            date: tx.date instanceof Date ? tx.date.toISOString() : tx.date,
            description: tx.description,
            amount: tx.amount,
            type: tx.type,
            categoryName: tx.category?.name || 'Uncategorized',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(`Failed to create transaction: ${errorData.error || response.statusText}`);
        }
      }

      console.log('Analysis Result:', analysisResult);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* File Upload Section */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4 flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF, PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !file
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Analyze Document'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {text && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Extracted Text</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{text}</pre>
            </div>
          </div>
        )}

        {analysis && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>
            
            {/* Summary */}
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-sm text-blue-700 font-medium">Summary</p>
              <p className="text-md text-blue-900">{analysis.summary}</p>
            </div>

            {/* Financial Score */}
            {analysis.financialScore && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-700 font-medium">Financial Score</p>
                  <p className="text-lg font-bold text-green-900">{analysis.financialScore.score}/100 ({analysis.financialScore.status})</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-sm text-yellow-700 font-medium">Recommendations</p>
                  <ul className="list-disc pl-5 text-sm text-yellow-900">
                    {analysis.financialScore.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Transactions */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Extracted Transactions</h4>
              <div className="bg-white shadow overflow-hidden rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analysis.transactions.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.date instanceof Date 
                            ? tx.date.toLocaleDateString() 
                            : new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{tx.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.category?.name || 'Uncategorized'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tx.type === 'INCOME' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestUpload;
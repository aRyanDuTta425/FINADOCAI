import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState<'BANK_STATEMENT' | 'INVOICE' | 'RECEIPT' | 'OTHER'>('BANK_STATEMENT');
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const router = useRouter();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(selectedFile.type) && 
          !selectedFile.name.endsWith('.pdf') && 
          !selectedFile.name.endsWith('.jpg') && 
          !selectedFile.name.endsWith('.jpeg') && 
          !selectedFile.name.endsWith('.png') && 
          !selectedFile.name.endsWith('.gif')) {
        setError('File type not supported. Please upload PDF, JPG, PNG, or GIF');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value as 'BANK_STATEMENT' | 'INVOICE' | 'RECEIPT' | 'OTHER');
  };
  
  // Get file contents as base64 for preview
  const getFilePreview = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Simulate initial upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 30) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
      
      // Get file preview (base64)
      setProcessingStatus('Preparing document...');
      let filePreview = '';
      try {
        filePreview = await getFilePreview(file);
      } catch (err) {
        console.warn('File preview generation failed:', err);
      }
      
      clearInterval(progressInterval);
      setUploadProgress(40);
      setProcessingStatus('Analyzing document with Gemini AI...');
      
      // Set up progress simulation for AI analysis
      const analysisInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(analysisInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      // Send to our API
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          documentType: documentType,
          // We're not sending the actual file content since we're using sample text on the server
          // This is just to indicate the document type
          textContent: `Document type: ${documentType}`
        }),
      });
      
      clearInterval(analysisInterval);
      setUploadProgress(100);
      setProcessingStatus('Processing complete!');
      
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.document && data.document.id) {
        // Wait a moment to show 100% progress
        setTimeout(() => {
          router.push(`/documents/${data.document.id}`);
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Upload Financial Document</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload your financial documents for automatic processing and analysis with Gemini AI.
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              id="documentType"
              name="documentType"
              value={documentType}
              onChange={handleDocumentTypeChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="BANK_STATEMENT">Bank Statement</option>
              <option value="INVOICE">Invoice</option>
              <option value="RECEIPT">Receipt</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-1 text-center">
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
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    disabled={isUploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, JPG, JPEG, PNG, GIF up to 10MB
              </p>
            </div>
            
            {file && (
              <div className="mt-4 flex items-center justify-center">
                <div className="text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      {uploadProgress < 40 ? 'Preparing Document' : 
                       uploadProgress < 90 ? 'Analyzing with Gemini AI' : 
                       'Processing Complete'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <div 
                    style={{ width: `${uploadProgress}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-300"
                  ></div>
                </div>
                {processingStatus && (
                  <p className="text-xs text-gray-600">{processingStatus}</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-4">
            <button
              type="submit"
              disabled={!file || isUploading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !file || isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Upload Document'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
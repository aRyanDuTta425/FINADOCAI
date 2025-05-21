'use client';

import React from 'react';
import Link from 'next/link';
import { Typewriter } from 'react-simple-typewriter';
import { FaFileAlt, FaChartLine, FaSearchDollar } from 'react-icons/fa';

export default function Home() {
  const features = [
    {
      icon: <FaFileAlt className="text-indigo-600 text-3xl mb-3" />,
      title: 'Document Processing',
      desc: 'Upload and process various financial documents including invoices, bank statements, and receipts.',
    },
    {
      icon: <FaSearchDollar className="text-indigo-600 text-3xl mb-3" />,
      title: 'Transaction Analysis',
      desc: 'Automatically extract and categorize transactions from your documents.',
    },
    {
      icon: <FaChartLine className="text-indigo-600 text-3xl mb-3" />,
      title: 'Financial Insights',
      desc: 'Get detailed insights and visualizations of your financial data.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-purple-300 opacity-20 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl md:text-6xl">
          <Typewriter
            words={['Welcome to FinDoc AI', 'Smarter Finance with AI', 'Upload. Analyze. Understand.']}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-700">
          Upload your financial documents and let AI help you analyze and manage your finances.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/documents"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl shadow-md transition"
          >
            Upload Documents
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 border border-indigo-600 text-indigo-700 font-medium rounded-xl bg-white hover:bg-indigo-50 shadow-md transition"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-24 max-w-6xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all p-6 text-center"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// import React from 'react';
// import Link from 'next/link';

// export default function Home() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
//           Welcome to FinDoc AI
//         </h1>
//         <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//           Upload your financial documents and let AI help you analyze and manage your finances.
//         </p>
//         <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//           <div className="rounded-md shadow">
//             <Link
//               href="/documents"
//               className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
//             >
//               Upload Documents
//             </Link>
//           </div>
//           <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
//             <Link
//               href="/dashboard"
//               className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
//             >
//               View Dashboard
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mt-16">
//         <h2 className="text-2xl font-bold text-gray-900 mb-8">Features</h2>
//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <h3 className="text-lg font-medium text-gray-900">Document Processing</h3>
//               <p className="mt-2 text-sm text-gray-500">
//                 Upload and process various financial documents including invoices, bank statements, and receipts.
//               </p>
//             </div>
//           </div>
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <h3 className="text-lg font-medium text-gray-900">Transaction Analysis</h3>
//               <p className="mt-2 text-sm text-gray-500">
//                 Automatically extract and categorize transactions from your documents.
//               </p>
//             </div>
//           </div>
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <h3 className="text-lg font-medium text-gray-900">Financial Insights</h3>
//               <p className="mt-2 text-sm text-gray-500">
//                 Get detailed insights and visualizations of your financial data.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 
import { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import { Document, Transaction } from '@/types';
import DocumentViewer from '@/components/DocumentViewer';
import Layout from '@/components/Layout';

interface DocumentPageProps {
  document: Document;
  transactions: Transaction[];
  isMock?: boolean;
}

export default function DocumentPage({ document, transactions, isMock }: DocumentPageProps) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isMock && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This is a demo document with mock data. In a production environment, this would display real document data.
                </p>
              </div>
            </div>
          </div>
        )}
        <DocumentViewer
          document={document}
          transactions={transactions}
          onUpdateTransaction={async (id, updates) => {
            // TODO: Implement transaction update
            console.log('Updating transaction:', id, updates);
          }}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    // Check if this is a mock document ID
    if (id.startsWith('mock-')) {
      // Create mock document data
      const mockDocument = {
        id: id,
        fileName: 'Sample Document.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 1024, // 1MB
        status: 'COMPLETED',
        userId: 'demo-user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create mock transactions
      const mockTransactions = [
        {
          id: 'tx-1',
          date: new Date(),
          description: 'Grocery Shopping',
          amount: 2500,
          type: 'EXPENSE',
          category: { id: 'cat-1', name: 'Groceries' },
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'tx-2',
          date: new Date(),
          description: 'Salary Deposit',
          amount: 50000,
          type: 'INCOME',
          category: { id: 'cat-2', name: 'Salary' },
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'tx-3',
          date: new Date(),
          description: 'Electricity Bill',
          amount: 1200,
          type: 'EXPENSE',
          category: { id: 'cat-3', name: 'Utilities' },
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Convert all Date objects to serializable format using JSON.parse(JSON.stringify())
      const serializedData = JSON.parse(JSON.stringify({
        document: mockDocument,
        transactions: mockTransactions,
        isMock: true
      }));

      return {
        props: serializedData
      };
    }

    // If not a mock ID, try to fetch from database
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        transactions: {
          include: {
            category: true
          }
        }
      }
    });

    if (!document) {
      return {
        notFound: true
      };
    }

    // Convert the document and all nested objects to a serializable format
    // This handles all Date objects by converting them to strings
    const serializedData = JSON.parse(JSON.stringify({
      document: document,
      transactions: document.transactions,
      isMock: false
    }));

    // Return serialized data
    return {
      props: serializedData
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    return {
      notFound: true
    };
  }
};
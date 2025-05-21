export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Document {
  id: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  userId?: string;
  createdAt: Date;
  updatedAt?: Date;
  documentType?: string;
  processingStatus?: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  verified?: boolean;
  confidence?: number;
  transactionType?: string;
  documentId?: string | null;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionsByCategory: Array<{
    categoryName: string;
    amount: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  recentTransactions: Transaction[];
} 

export interface AnalysisResult {
  transactions: Transaction[];
  summary?: string;
  financialScore?: {
    score: number;
    status: string;
    recommendations: string[];
  };
}
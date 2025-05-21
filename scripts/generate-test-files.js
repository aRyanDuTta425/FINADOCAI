/**
 * Test File Generator for Financial Document Analysis
 * 
 * This script generates sample test files for testing the document analysis functionality.
 * It creates various types of financial documents with different patterns and formats.
 * 
 * Usage: node generate-test-files.js [options]
 * Options:
 *   --count=<number>     Number of files to generate (default: 10)
 *   --dir=<directory>    Output directory for test files (default: ./test-files)
 *   --type=<type>        Document type (mixed, bank, invoice, receipt) (default: mixed)
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--count <number>', 'Number of files to generate', '10')
  .option('--dir <directory>', 'Output directory for test files', './test-files')
  .option('--type <type>', 'Document type (mixed, bank, invoice, receipt)', 'mixed')
  .parse(process.argv);

const options = program.opts();
const count = parseInt(options.count);
const outputDir = options.dir;
const docType = options.type.toLowerCase();

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sample data for document generation
const companies = ['ABC Corp', 'XYZ Ltd', 'Global Enterprises', 'Tech Solutions', 'Finance Inc'];
const banks = ['Royal Bank', 'National Bank', 'City Trust', 'Global Finance', 'Union Bank'];
const items = [
  'Office Supplies', 'Software Subscription', 'Hardware Purchase', 'Consulting Services',
  'Internet Services', 'Phone Bill', 'Electricity', 'Water Bill', 'Rent', 'Insurance',
  'Marketing Services', 'Legal Services', 'Travel Expenses', 'Training', 'Maintenance'
];
const descriptions = [
  'Monthly payment', 'Quarterly fee', 'Annual subscription', 'One-time purchase',
  'Service charge', 'Maintenance fee', 'Processing fee', 'Late payment', 'Discount applied',
  'Tax refund', 'Interest earned', 'Dividend payment', 'Salary deposit', 'Bonus payment'
];

// Generate a random date within the last year
function randomDate() {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
  return new Date(randomTime);
}

// Format date as MM/DD/YYYY
function formatDate(date) {
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Generate a random amount between min and max
function randomAmount(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Pick a random item from an array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate a bank statement
function generateBankStatement(id) {
  const bank = randomItem(banks);
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const statementDate = randomDate();
  const startDate = new Date(statementDate);
  startDate.setMonth(startDate.getMonth() - 1);
  
  let content = `
${bank.toUpperCase()}
Account Statement
Period: ${formatDate(startDate)} - ${formatDate(statementDate)}
Account Number: ${accountNumber}

TRANSACTIONS:
Date        Description                     Amount      Balance
`;

  let balance = parseFloat(randomAmount(1000, 5000));
  const transactions = [];
  
  // Generate 5-15 transactions
  const transactionCount = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < transactionCount; i++) {
    const txDate = new Date(startDate.getTime() + Math.random() * (statementDate.getTime() - startDate.getTime()));
    const isIncome = Math.random() > 0.6; // 40% chance of income
    const amount = parseFloat(randomAmount(isIncome ? 500 : 10, isIncome ? 5000 : 500));
    const description = isIncome ? 
      `${randomItem(['SALARY', 'DEPOSIT', 'TRANSFER', 'REFUND'])}` : 
      `${randomItem(['PAYMENT', 'PURCHASE', 'WITHDRAWAL', 'BILL'])} ${randomItem(items)}`;
    
    if (isIncome) {
      balance += amount;
      transactions.push(`${formatDate(txDate)}  ${description.padEnd(30)} +$${amount.toFixed(2).padStart(10)}  $${balance.toFixed(2)}`);
    } else {
      balance -= amount;
      transactions.push(`${formatDate(txDate)}  ${description.padEnd(30)} -$${amount.toFixed(2).padStart(10)}  $${balance.toFixed(2)}`);
    }
  }
  
  // Sort transactions by date
  transactions.sort();
  content += transactions.join('\n');
  
  // Add summary
  const totalIncome = transactions
    .filter(tx => tx.includes('+$'))
    .reduce((sum, tx) => sum + parseFloat(tx.match(/\+\$(\d+\.\d{2})/)[1]), 0);
  
  const totalExpense = transactions
    .filter(tx => tx.includes('-$'))
    .reduce((sum, tx) => sum + parseFloat(tx.match(/\-\$(\d+\.\d{2})/)[1]), 0);
  
  content += `

SUMMARY:
Opening Balance: $${(balance - totalIncome + totalExpense).toFixed(2)}
Total Deposits: $${totalIncome.toFixed(2)}
Total Withdrawals: $${totalExpense.toFixed(2)}
Closing Balance: $${balance.toFixed(2)}
`;

  return content;
}

// Generate an invoice
function generateInvoice(id) {
  const company = randomItem(companies);
  const invoiceDate = randomDate();
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30);
  const invoiceNumber = `INV-${invoiceDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  let content = `
INVOICE
Invoice #: ${invoiceNumber}
Date: ${formatDate(invoiceDate)}
Due Date: ${formatDate(dueDate)}

FROM:
${company}
123 Business St.
Toronto, ON M5V 2N4
Phone: (416) 555-${Math.floor(1000 + Math.random() * 9000)}
Email: billing@${company.toLowerCase().replace(/\s+/g, '')}.com

TO:
${randomItem(companies)}
456 Corporate Ave.
Toronto, ON M4B 1B3

ITEMS:
`;

  // Generate 1-5 items
  const itemCount = Math.floor(Math.random() * 5) + 1;
  let subtotal = 0;
  
  for (let i = 0; i < itemCount; i++) {
    const item = randomItem(items);
    const quantity = Math.floor(Math.random() * 20) + 1;
    const rate = parseFloat(randomAmount(50, 200));
    const amount = quantity * rate;
    subtotal += amount;
    
    content += `${i+1}. ${item} - ${quantity} ${quantity > 1 ? 'units' : 'unit'} @ $${rate.toFixed(2)}/unit = $${amount.toFixed(2)}\n`;
  }
  
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  
  content += `
Subtotal: $${subtotal.toFixed(2)}
HST (13%): $${tax.toFixed(2)}
Total Due: $${total.toFixed(2)}

Payment Terms: Net 30
Please make payment to ${company}
Thank you for your business!
`;

  return content;
}

// Generate a receipt
function generateReceipt(id) {
  const company = randomItem(companies);
  const receiptDate = randomDate();
  const storeNumber = Math.floor(1000 + Math.random() * 9000);
  
  let content = `
${company.toUpperCase()}
Store #${storeNumber}
123 Retail Drive
Toronto, ON M1M 1M1
Tel: (416) 555-${Math.floor(1000 + Math.random() * 9000)}

RECEIPT
Date: ${formatDate(receiptDate)}
Time: ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}
Cashier: ${randomItem(['Emma', 'John', 'Sarah', 'Michael', 'David'])}

ITEMS:
`;

  // Generate 3-10 items
  const itemCount = Math.floor(Math.random() * 7) + 3;
  let subtotal = 0;
  
  for (let i = 0; i < itemCount; i++) {
    const item = randomItem(items);
    const amount = parseFloat(randomAmount(1, 50));
    subtotal += amount;
    
    content += `${item.padEnd(25)} $${amount.toFixed(2)}\n`;
  }
  
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  
  content += `
Subtotal:               $${subtotal.toFixed(2)}
HST (13%):              $${tax.toFixed(2)}
Total:                  $${total.toFixed(2)}

Payment Method: ${randomItem(['Visa', 'Mastercard', 'Debit', 'Cash', 'Amex'])}
Card #: XXXX-XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}
Amount: $${total.toFixed(2)}

Thank you for shopping at ${company}!
`;

  return content;
}

// Generate files based on options
console.log(`Generating ${count} test files in ${outputDir}...`);

for (let i = 0; i < count; i++) {
  let fileContent;
  let fileType;
  
  if (docType === 'mixed') {
    // Random document type
    const types = ['bank', 'invoice', 'receipt'];
    fileType = randomItem(types);
  } else {
    fileType = docType;
  }
  
  // Generate content based on type
  switch (fileType) {
    case 'bank':
      fileContent = generateBankStatement(i);
      break;
    case 'invoice':
      fileContent = generateInvoice(i);
      break;
    case 'receipt':
      fileContent = generateReceipt(i);
      break;
    default:
      fileContent = generateBankStatement(i);
  }
  
  // Write to file
  const fileName = `test-${fileType}-${i+1}.txt`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, fileContent);
  console.log(`  Created ${fileName}`);
}

console.log('Done!');

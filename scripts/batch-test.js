/**
 * Batch Testing Script for Financial Document Analysis
 * 
 * This script allows you to test the document analysis functionality with multiple files.
 * It processes files from a specified directory and outputs the analysis results.
 * 
 * Usage: node batch-test.js [options]
 * Options:
 *   --dir=<directory>    Directory containing test files (default: ./test-files)
 *   --output=<file>      Output file for results (default: ./test-results.json)
 *   --type=<type>        Document type (BANK_STATEMENT, INVOICE, RECEIPT, OTHER)
 *   --verbose            Show detailed output
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--dir <directory>', 'Directory containing test files', './test-files')
  .option('--output <file>', 'Output file for results', './test-results.json')
  .option('--type <type>', 'Document type (BANK_STATEMENT, INVOICE, RECEIPT, OTHER)', 'BANK_STATEMENT')
  .option('--verbose', 'Show detailed output')
  .parse(process.argv);

const options = program.opts();

// Create test directory if it doesn't exist
if (!fs.existsSync(options.dir)) {
  fs.mkdirSync(options.dir, { recursive: true });
  console.log(`Created test directory: ${options.dir}`);
}

// Get list of files in the directory
const files = fs.readdirSync(options.dir)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.txt', '.pdf', '.jpg', '.jpeg', '.png'].includes(ext);
  });

if (files.length === 0) {
  console.log(`No files found in ${options.dir}. Please add files to test.`);
  process.exit(1);
}

console.log(`Found ${files.length} files to process`);

// Process files
async function processFiles() {
  const results = [];
  const apiUrl = 'http://localhost:3001/api/documents/upload';
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(options.dir, file);
    
    console.log(`Processing file ${i+1}/${files.length}: ${file}`);
    
    try {
      // Read file content
      let textContent;
      const ext = path.extname(file).toLowerCase();
      
      if (ext === '.txt') {
        // For text files, read directly
        textContent = fs.readFileSync(filePath, 'utf8');
      } else {
        // For non-text files, we'd need OCR, but for testing we'll use a placeholder
        textContent = `This is a placeholder for file ${file} which would normally be processed with OCR`;
      }
      
      // Call the API
      const response = await axios.post(apiUrl, {
        fileName: file,
        documentType: options.type,
        textContent: textContent
      });
      
      // Add to results
      results.push({
        fileName: file,
        status: 'success',
        documentId: response.data.document.id,
        transactionCount: response.data.document.transactions.length,
        summary: response.data.analysis.summary
      });
      
      if (options.verbose) {
        console.log(`  Success: ${response.data.document.transactions.length} transactions extracted`);
      }
    } catch (error) {
      console.error(`  Error processing ${file}:`, error.message);
      results.push({
        fileName: file,
        status: 'error',
        error: error.message
      });
    }
  }
  
  // Save results
  fs.writeFileSync(options.output, JSON.stringify(results, null, 2));
  console.log(`\nProcessing complete. Results saved to ${options.output}`);
  
  // Print summary
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  const totalTransactions = results.reduce((sum, r) => sum + (r.transactionCount || 0), 0);
  
  console.log('\nSummary:');
  console.log(`  Total files processed: ${files.length}`);
  console.log(`  Successful: ${successful}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total transactions extracted: ${totalTransactions}`);
}

processFiles().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

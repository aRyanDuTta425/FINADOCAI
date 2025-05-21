# Financial Document Analysis Testing Tools

This directory contains scripts for testing the financial document analysis functionality with multiple files.

## Prerequisites

Before using these scripts, make sure you have the required dependencies installed:

```bash
npm install commander axios
```

## Scripts Overview

### 1. Generate Test Files

The `generate-test-files.js` script creates sample financial documents for testing purposes.

```bash
node generate-test-files.js [options]
```

Options:
- `--count=<number>`: Number of files to generate (default: 10)
- `--dir=<directory>`: Output directory for test files (default: ./test-files)
- `--type=<type>`: Document type (mixed, bank, invoice, receipt) (default: mixed)

Example:
```bash
# Generate 20 mixed document types
node generate-test-files.js --count=20

# Generate 10 bank statements
node generate-test-files.js --count=10 --type=bank

# Generate 5 invoices in a custom directory
node generate-test-files.js --count=5 --type=invoice --dir=./my-test-files
```

### 2. Batch Testing

The `batch-test.js` script processes multiple files and tests the document analysis functionality.

```bash
node batch-test.js [options]
```

Options:
- `--dir=<directory>`: Directory containing test files (default: ./test-files)
- `--output=<file>`: Output file for results (default: ./test-results.json)
- `--type=<type>`: Document type (BANK_STATEMENT, INVOICE, RECEIPT, OTHER) (default: BANK_STATEMENT)
- `--verbose`: Show detailed output

Example:
```bash
# Process all files in the test-files directory
node batch-test.js

# Process files with verbose output
node batch-test.js --verbose

# Process files in a custom directory and save results to a specific file
node batch-test.js --dir=./my-test-files --output=./my-results.json

# Specify document type
node batch-test.js --type=INVOICE
```

## Typical Workflow

1. Generate test files:
   ```bash
   node generate-test-files.js --count=100
   ```

2. Start the application server:
   ```bash
   npm run dev
   ```

3. Run the batch test:
   ```bash
   node batch-test.js --verbose
   ```

4. Review the results in the output file (default: ./test-results.json)

## Tips for Large-Scale Testing

- Start with a small number of files to ensure everything is working correctly
- Use the `--verbose` flag to see detailed progress
- For very large tests, consider running in batches (e.g., 100 files at a time)
- Check the server logs for any errors or performance issues
- Monitor system resources during testing (CPU, memory, etc.)

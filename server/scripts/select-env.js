#!/usr/bin/env node

import { createInterface } from 'readline';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're in the right directory
const serverPath = join(__dirname, '..', 'server.js');
if (!existsSync(serverPath)) {
  console.error('Error: server.js not found. Make sure you\'re running this from the server directory.');
  process.exit(1);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Handle Ctrl+C gracefully during menu selection
rl.on('SIGINT', () => {
  console.log('\n\nGoodbye!');
  rl.close();
  process.exit(0);
});

const environments = {
  '1': 'LOCAL',
  '2': 'DEV', 
  '3': 'PROD',
  '4': 'EXIT'
};

function displayMenu() {
  console.log('\n' + '='.repeat(50));
  console.log('           ENVIRONMENT SELECTION');
  console.log('='.repeat(50));
  console.log('  1. LOCAL     - Local development environment');
  console.log('  2. DEV       - Development server environment');
  console.log('  3. PROD      - Production server environment');
  console.log('  4. EXIT      - Exit without starting server');
  console.log('='.repeat(50));
  console.log('');
}

function promptEnvironment() {
  return new Promise((resolve) => {
    const askQuestion = () => {
      displayMenu();
      rl.question('Enter your choice (1-4): ', (answer) => {
        const env = environments[answer.trim()];
        if (env) {
          if (env === 'EXIT') {
            console.log('\nGoodbye!');
            rl.close();
            process.exit(0);
          }
          resolve(env);
        } else {
          console.log('\n[ERROR] Invalid choice. Please select 1, 2, 3, or 4.\n');
          askQuestion(); // Use regular function call instead of recursive Promise
        }
      });
    };
    askQuestion();
  });
}

async function startServer() {
  let serverProcess = null;
  
  // Setup signal handlers once
  const cleanup = async (signal) => {    
    // Close readline interface
    if (rl && !rl.closed) {
      rl.close();
    }

    // Kill server process
    if (serverProcess && !serverProcess.killed) {
      console.log('\nStopping server process...');
      serverProcess.kill(signal || 'SIGTERM');
      
      // Wait a bit for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Cleanup complete');
    console.log(`\n${'-'.repeat(30)}`);
    console.log('  SHUTTING DOWN SERVER...');
    console.log('-'.repeat(30));
    process.exit(0);
  };
  
  process.on('SIGINT', () => cleanup('SIGINT'));
  process.on('SIGTERM', () => cleanup('SIGTERM'));
  
  try {
    const selectedEnv = await promptEnvironment();
    rl.close();
    
    console.log('\n' + '-'.repeat(50));
    console.log(`  STARTING SERVER IN ${selectedEnv} ENVIRONMENT`);
    console.log('-'.repeat(50));
    
    // Validate environment selection
    if (!['LOCAL', 'DEV', 'PROD'].includes(selectedEnv)) {
      throw new Error(`Invalid environment: ${selectedEnv}`);
    }
    
    // Start the server with nodemon
    serverProcess = spawn('npx', ['nodemon', 'server.js'], {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        SELECTED_ENV: selectedEnv,
      }
    });
    
    serverProcess.on('error', (error) => {
      console.error('\n[ERROR] Failed to start server process:', error.message);
      if (error.code === 'ENOENT') {
        console.error('Make sure nodemon is installed: npm install -g nodemon');
      }
      process.exit(1);
    });
    
    serverProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`\n[ERROR] Server process exited with code ${code}`);
      }
      process.exit(code);
    });
    
  } catch (error) {
    console.log('\n' + '!'.repeat(40));
    console.log('  ERROR STARTING SERVER');
    console.log('!'.repeat(40));
    console.error('  ', error.message || error);
    
    if (rl && !rl.closed) {
      rl.close();
    }
    
    process.exit(1);
  }
}

startServer();

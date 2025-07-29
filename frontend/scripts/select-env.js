#!/usr/bin/env node

import { createInterface } from 'readline';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detect if running on Windows
const isWindows = platform() === 'win32';

// Check if we're in the right directory
const packageJsonPath = join(__dirname, '..', 'package.json');
if (!existsSync(packageJsonPath)) {
  console.error('Error: package.json not found. Make sure you\'re running this from the frontend directory.');
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
  console.log('           FRONTEND ENVIRONMENT SELECTION');
  console.log('='.repeat(50));
  console.log('  1. LOCAL     - Local development environment');
  console.log('  2. DEV       - Development server environment');
  console.log('  3. PROD      - Production environment');
  console.log('  4. EXIT      - Exit without starting dev server');
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

async function startDev() {
  let devProcess = null;
  
  // Setup signal handlers with Windows compatibility
  const cleanup = async (signal) => {
    console.log(`\n${'-'.repeat(30)}`);
    console.log('  SHUTTING DOWN DEV SERVER...');
    console.log('-'.repeat(30));
    
    if (rl && !rl.closed) {
      rl.close();
    }
    
    if (devProcess && !devProcess.killed) {
      if (isWindows) {
        // On Windows, use taskkill to forcefully terminate the process tree
        try {
          spawn('taskkill', ['/pid', devProcess.pid, '/T', '/F'], { stdio: 'ignore' });
        } catch (error) {
          // Fallback to regular kill
          devProcess.kill('SIGTERM');
        }
      } else {
        devProcess.kill(signal || 'SIGTERM');
      }
      
      // Wait a bit for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    process.exit(0);
  };
  
  // Windows doesn't support SIGTERM properly, so we handle exit events differently
  if (isWindows) {
    process.on('SIGINT', () => cleanup('SIGINT'));
    process.on('exit', () => cleanup());
    process.on('beforeExit', () => cleanup());
  } else {
    process.on('SIGINT', () => cleanup('SIGINT'));
    process.on('SIGTERM', () => cleanup('SIGTERM'));
  }
  
  try {
    const selectedEnv = await promptEnvironment();
    rl.close();
    
    console.log('\n' + '-'.repeat(50));
    console.log(`  STARTING DEV SERVER IN ${selectedEnv} ENVIRONMENT`);
    console.log('-'.repeat(50));
    
    // Validate environment selection
    if (!['LOCAL', 'DEV', 'PROD'].includes(selectedEnv)) {
      throw new Error(`Invalid environment: ${selectedEnv}`);
    }
    
    // Always use the local vite binary for both platforms
    const vitePath = join(__dirname, '..', 'node_modules', '.bin', isWindows ? 'vite.cmd' : 'vite');
    let options = {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_SELECTED_ENV: selectedEnv,
      },
      ...(isWindows ? { detached: false, shell: true } : {})
    };
    devProcess = spawn(vitePath, [], options);
    
    devProcess.on('error', (error) => {
      console.error('\n[ERROR] Failed to start dev server process:', error.message);
      if (error.code === 'ENOENT') {
        console.error('Make sure vite is installed: npm install');
      }
      process.exit(1);
    });
    
    devProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`\n[ERROR] Dev server process exited with code ${code}`);
      }
      process.exit(code);
    });
    
  } catch (error) {
    console.log('\n' + '!'.repeat(40));
    console.log('  ERROR STARTING DEV SERVER');
    console.log('!'.repeat(40));
    console.error('  ', error.message || error);
    
    if (rl && !rl.closed) {
      rl.close();
    }
    
    process.exit(1);
  }
}

startDev();
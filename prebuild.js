#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicLibPath = path.join(__dirname, 'node_modules', '@music-library', 'core');
const distPath = path.join(musicLibPath, 'dist');

console.log('Checking @music-library/core...');

if (fs.existsSync(musicLibPath)) {
  console.log('✓ @music-library/core found');
  
  if (!fs.existsSync(distPath)) {
    console.log('Building @music-library/core...');
    try {
      execSync('npm run build', { cwd: musicLibPath, stdio: 'inherit' });
      console.log('✓ @music-library/core built successfully');
    } catch (err) {
      console.error('✗ Failed to build @music-library/core:', err.message);
      process.exit(1);
    }
  } else {
    console.log('✓ @music-library/core dist already exists');
  }
} else {
  console.log('✗ @music-library/core not found');
  process.exit(1);
}


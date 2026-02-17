#!/usr/bin/env node

/**
 * Teardown Neon Test Database Branch
 * 
 * This script deletes the Neon test database branch and cleans up .env.test
 * 
 * Usage: pnpm test:db:teardown
 */

import { execSync } from 'child_process';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const BRANCH_NAME = 'test';
const ENV_TEST_FILE = '.env.test';

async function teardownTestBranch() {
  console.log('🧹 Tearing down Neon test database branch...\n');

  try {
    // Check if branch exists
    console.log('📋 Checking for test branch...');
    let branchExists = false;
    
    try {
      const branches = execSync('neonctl branches list --output json', {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const branchList = JSON.parse(branches);
      branchExists = branchList.some((b) => b.name === BRANCH_NAME);
    } catch (error) {
      console.log('⚠️  Could not check existing branches');
    }

    if (branchExists) {
      console.log(`🗑️  Deleting test branch '${BRANCH_NAME}'...`);
      
      execSync(`neonctl branches delete ${BRANCH_NAME} --force`, {
        encoding: 'utf-8',
        stdio: 'inherit'
      });
      
      console.log('✅ Test branch deleted successfully');
    } else {
      console.log(`ℹ️  Test branch '${BRANCH_NAME}' does not exist (already deleted)`);
    }

    // Remove .env.test file
    const envTestPath = join(process.cwd(), ENV_TEST_FILE);
    if (existsSync(envTestPath)) {
      console.log(`🗑️  Removing ${ENV_TEST_FILE}...`);
      unlinkSync(envTestPath);
      console.log('✅ .env.test removed');
    }

    console.log('\n✅ Test database teardown complete!\n');
    
  } catch (error) {
    console.error('\n❌ Error tearing down test database:');
    console.error(error.message);
    console.error('\n💡 You may need to manually delete the branch:');
    console.error(`   neonctl branches delete ${BRANCH_NAME} --force\n`);
    process.exit(1);
  }
}

teardownTestBranch();

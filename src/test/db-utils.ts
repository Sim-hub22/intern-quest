/**
 * Test Database Utilities
 * 
 * This module provides utilities for managing Neon database branches for testing.
 * 
 * Usage:
 * 1. Create a test branch before running tests: `pnpm test:db:setup`
 * 2. Run tests with the test branch: `pnpm test`
 * 3. Clean up test branch after tests: `pnpm test:db:teardown`
 * 
 * The test branch DATABASE_URL is stored in .env.test
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { user } from "@/server/db/schema/auth";

/**
 * Get test database URL from environment
 */
export function getTestDatabaseUrl(): string {
  const testDbUrl = process.env.TEST_DATABASE_URL;
  
  if (!testDbUrl) {
    throw new Error(
      "TEST_DATABASE_URL is not defined. " +
      "Please run 'pnpm test:db:setup' to create a Neon test branch."
    );
  }
  
  return testDbUrl;
}

/**
 * Create a test database connection
 */
export function createTestDb() {
  const testDbUrl = getTestDatabaseUrl();
  const sql = neon(testDbUrl);
  return drizzle({ client: sql });
}

/**
 * Truncate all tables in the test database (for cleanup between tests)
 * 
 * IMPORTANT: This only works with the test database branch, not production!
 */
export async function truncateAllTables() {
  const testDb = createTestDb();
  
  // Get all table names from the public schema
  const tables = await testDb.execute(sql`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  `);
  
  // Truncate each table (cascade to handle foreign keys)
  for (const table of tables.rows) {
    const tableName = table.tablename as string;
    await testDb.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE`));
  }
}

/**
 * Seed test database with minimal data for tests
 */
export async function seedTestDatabase() {
  const testDb = createTestDb();
  
  // Seed test users that match the IDs used in tests
  await testDb.insert(user).values([
    {
      id: "recruiter-1",
      email: "recruiter-1@example.com",
      name: "Test Recruiter 1",
      role: "recruiter",
      emailVerified: true,
      banned: false,
    },
    {
      id: "recruiter-2",
      email: "recruiter-2@example.com",
      name: "Test Recruiter 2",
      role: "recruiter",
      emailVerified: true,
      banned: false,
    },
    {
      id: "recruiter-123",
      email: "recruiter-123@example.com",
      name: "Test Recruiter 123",
      role: "recruiter",
      emailVerified: true,
      banned: false,
    },
    {
      id: "my-recruiter-id",
      email: "my-recruiter-id@example.com",
      name: "My Test Recruiter",
      role: "recruiter",
      emailVerified: true,
      banned: false,
    },
    {
      id: "candidate-1",
      email: "candidate-1@example.com",
      name: "Test Candidate 1",
      role: "candidate",
      emailVerified: true,
      banned: false,
    },
    {
      id: "candidate-2",
      email: "candidate-2@example.com",
      name: "Test Candidate 2",
      role: "candidate",
      emailVerified: true,
      banned: false,
    },
    {
      id: "candidate-3",
      email: "candidate-3@example.com",
      name: "Test Candidate 3",
      role: "candidate",
      emailVerified: true,
      banned: false,
    },
  ]);
}

/**
 * Reset test database to a clean state
 * Call this in beforeEach() or afterEach() hooks
 */
export async function resetTestDatabase() {
  await truncateAllTables();
  await seedTestDatabase();
}

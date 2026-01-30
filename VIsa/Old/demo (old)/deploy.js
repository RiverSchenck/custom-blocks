#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, renameSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const supabaseDir = join(process.cwd(), 'supabase');
// Move to system temp directory to ensure it's completely outside the project
const supabaseBackup = join(tmpdir(), `supabase-backup-${Date.now()}`);

try {
    // Temporarily move supabase directory out of the way
    if (existsSync(supabaseDir)) {
        console.log('Temporarily moving supabase directory...');
        mkdirSync(tmpdir(), { recursive: true });
        renameSync(supabaseDir, supabaseBackup);
    }

    // Run the deployment
    console.log('Running Frontify deployment...');
    execSync('frontify-cli deploy --entryPath src/index.ts', {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
} catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
} finally {
    // Restore supabase directory
    if (existsSync(supabaseBackup)) {
        console.log('Restoring supabase directory...');
        renameSync(supabaseBackup, supabaseDir);
    }
}

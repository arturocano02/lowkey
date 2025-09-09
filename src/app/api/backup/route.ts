import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface EmailData {
  email: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

const EMAILS_FILE = join(process.cwd(), 'data', 'emails.json');
const BACKUP_DIR = join(process.cwd(), 'data', 'backups');

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Load emails from file
async function loadEmails(): Promise<EmailData[]> {
  try {
    const data = await readFile(EMAILS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// GET - List all backups
export async function GET() {
  try {
    await ensureBackupDir();
    
    // This would require reading the directory, but for simplicity,
    // we'll just return the current email count
    const emails = await loadEmails();
    
    return NextResponse.json({
      success: true,
      message: 'Backup system active',
      currentEmails: emails.length,
      lastBackup: emails.length > 0 ? 'Automatic backups every 10 emails' : 'No emails yet'
    });
  } catch (error) {
    console.error('Error checking backups:', error);
    return NextResponse.json({ error: 'Failed to check backups' }, { status: 500 });
  }
}

// POST - Create manual backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Simple password check for backup access
    if (password !== 'lowkey2025') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await ensureBackupDir();
    const emails = await loadEmails();
    
    if (emails.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No emails to backup',
        count: 0 
      });
    }

    // Create timestamped backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = join(BACKUP_DIR, `manual-backup-${timestamp}.json`);
    
    await writeFile(backupFile, JSON.stringify(emails, null, 2));
    
    console.log('📁 Manual backup created:', backupFile);
    
    return NextResponse.json({
      success: true,
      message: 'Backup created successfully',
      backupFile: `manual-backup-${timestamp}.json`,
      emailsBackedUp: emails.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

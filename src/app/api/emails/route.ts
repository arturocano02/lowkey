import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface EmailData {
  email: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

// File-based storage that persists across restarts
const EMAILS_FILE = join(process.cwd(), 'data', 'emails.json');
const BACKUP_DIR = join(process.cwd(), 'data', 'backups');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await mkdir(join(process.cwd(), 'data'), { recursive: true });
    await mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    // Directories already exist
  }
}

// Create backup of emails
async function createBackup(emails: EmailData[]) {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const backupFile = join(BACKUP_DIR, `emails-backup-${timestamp}.json`);
    await writeFile(backupFile, JSON.stringify(emails, null, 2));
    console.log('📁 Backup created:', backupFile);
  } catch (error) {
    console.error('Backup failed:', error);
  }
}

// Load emails from file
async function loadEmails(): Promise<EmailData[]> {
  try {
    await ensureDirectories();
    const data = await readFile(EMAILS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Save emails to file
async function saveEmails(emails: EmailData[]) {
  try {
    await ensureDirectories();
    await writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2));
    
    // Create backup every 10 emails
    if (emails.length % 10 === 0) {
      await createBackup(emails);
    }
  } catch (error) {
    console.error('Save failed:', error);
    throw error;
  }
}

// GET - Retrieve all emails
export async function GET() {
  try {
    const emails = await loadEmails();
    return NextResponse.json({ emails, count: emails.length });
  } catch (error) {
    console.error('Error reading emails:', error);
    return NextResponse.json({ error: 'Failed to read emails' }, { status: 500 });
  }
}

// POST - Add new email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userAgent } = body;

    if (!email || !userAgent) {
      return NextResponse.json({ error: 'Email and userAgent are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Load existing emails
    const emails = await loadEmails();

    // Check for duplicates
    const existingEmail = emails.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Add new email
    const newEmail: EmailData = {
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
      userAgent,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    emails.push(newEmail);
    await saveEmails(emails);

    console.log('📧 New email added:', email);
    return NextResponse.json({ 
      success: true, 
      message: 'Email added successfully',
      count: emails.length 
    });

  } catch (error) {
    console.error('Error adding email:', error);
    return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
  }
}

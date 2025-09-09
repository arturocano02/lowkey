import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

const EMAILS_FILE = join(process.cwd(), 'data', 'emails.json');

interface EmailData {
  email: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await mkdir(join(process.cwd(), 'data'), { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// GET - Retrieve all emails
export async function GET() {
  try {
    await ensureDataDir();
    
    try {
      const data = await readFile(EMAILS_FILE, 'utf-8');
      const emails = JSON.parse(data);
      return NextResponse.json({ emails, count: emails.length });
    } catch (error) {
      // File doesn't exist yet
      return NextResponse.json({ emails: [], count: 0 });
    }
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

    await ensureDataDir();

    // Read existing emails
    let emails: EmailData[] = [];
    try {
      const data = await readFile(EMAILS_FILE, 'utf-8');
      emails = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }

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

    // Write back to file
    await writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2));

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

import { NextRequest, NextResponse } from 'next/server';

interface EmailData {
  email: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

// In-memory storage for demo purposes
// In production, you'd use a database like Vercel KV, Supabase, or MongoDB
const emailsStorage: EmailData[] = [];

// GET - Retrieve all emails
export async function GET() {
  try {
    return NextResponse.json({ emails: emailsStorage, count: emailsStorage.length });
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

    // Check for duplicates
    const existingEmail = emailsStorage.find(e => e.email.toLowerCase() === email.toLowerCase());
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

    emailsStorage.push(newEmail);

    console.log('📧 New email added:', email);
    return NextResponse.json({ 
      success: true, 
      message: 'Email added successfully',
      count: emailsStorage.length 
    });

  } catch (error) {
    console.error('Error adding email:', error);
    return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Simple password authentication
// In production, you'd want to use proper authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lowkey2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, message: 'Authentication successful' });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase, EmailData } from '@/lib/supabase';

// GET - Retrieve all emails
export async function GET() {
  try {
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to read emails' }, { status: 500 });
    }

    return NextResponse.json({ emails: emails || [], count: emails?.length || 0 });
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

    // Check for duplicates first
    const { data: existingEmail } = await supabase
      .from('emails')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Add new email to Supabase
    const { data: newEmail, error: insertError } = await supabase
      .from('emails')
      .insert({
        email: email.toLowerCase(),
        timestamp: new Date().toISOString(),
        user_agent: userAgent,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
    }

    // Get total count
    const { count } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true });

    console.log('📧 New email added to Supabase:', email);
    return NextResponse.json({ 
      success: true, 
      message: 'Email added successfully',
      count: count || 0
    });

  } catch (error) {
    console.error('Error adding email:', error);
    return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
  }
}

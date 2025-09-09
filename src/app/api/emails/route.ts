import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with proper error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder-key') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
  }
}

interface EmailData {
  id?: number;
  email: string;
  timestamp: string;
  user_agent: string;
  ip_address?: string;
  created_at?: string;
}

// GET - Retrieve all emails
export async function GET() {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('❌ Supabase not configured');
      return NextResponse.json({ 
        error: 'Database not configured',
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlValid: supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co',
          keyValid: supabaseKey && supabaseKey !== 'placeholder-key'
        }
      }, { status: 500 });
    }

    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: 'Failed to read emails', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({ emails: emails || [], count: emails?.length || 0 });
  } catch (error) {
    console.error('Error reading emails:', error);
    return NextResponse.json({ 
      error: 'Failed to read emails',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Add new email
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('❌ Supabase not configured');
      return NextResponse.json({ 
        error: 'Database not configured',
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlValid: supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co',
          keyValid: supabaseKey && supabaseKey !== 'placeholder-key'
        }
      }, { status: 500 });
    }

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
    const { data: existingEmail, error: checkError } = await supabase
      .from('emails')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking duplicates:', checkError);
      return NextResponse.json({ 
        error: 'Failed to check for duplicates',
        details: checkError.message
      }, { status: 500 });
    }

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
      return NextResponse.json({ 
        error: 'Failed to add email',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      }, { status: 500 });
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
    return NextResponse.json({ 
      error: 'Failed to add email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
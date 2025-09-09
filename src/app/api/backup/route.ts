import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Get backup info
export async function GET() {
  try {
    const { count } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      message: 'Supabase database active',
      currentEmails: count || 0,
      database: 'Supabase (persistent)',
      backupInfo: 'All emails are automatically backed up in Supabase database'
    });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json({ error: 'Failed to check database' }, { status: 500 });
  }
}

// POST - Export all emails as CSV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Simple password check for export access
    if (password !== 'lowkey2025') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Get all emails from Supabase
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }
    
    if (!emails || emails.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No emails to export',
        count: 0 
      });
    }

    // Create CSV content
    const csvContent = [
      'Email,Timestamp,User Agent,IP Address,Created At',
      ...emails.map(email => 
        `"${email.email}","${email.timestamp}","${email.user_agent}","${email.ip_address || 'unknown'}","${email.created_at}"`
      )
    ].join('\n');
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    return NextResponse.json({
      success: true,
      message: 'CSV export ready',
      csvContent: csvContent,
      filename: `lowkey-emails-${timestamp}.csv`,
      emailsExported: emails.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating export:', error);
    return NextResponse.json({ error: 'Failed to create export' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlValid: supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co',
    keyValid: supabaseKey && supabaseKey !== 'placeholder-key',
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseKey?.length || 0,
    urlStart: supabaseUrl?.substring(0, 20) || 'none',
    keyStart: supabaseKey?.substring(0, 20) || 'none'
  });
}

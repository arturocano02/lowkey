-- Create emails table for Lowkey landing page
CREATE TABLE emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  timestamp TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_emails_email ON emails(email);
CREATE INDEX idx_emails_created_at ON emails(created_at);

-- Enable Row Level Security (RLS) for security
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access for inserts (email collection)
CREATE POLICY "Allow public email collection" ON emails
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public access for reads (dashboard access)
CREATE POLICY "Allow public email reading" ON emails
  FOR SELECT USING (true);

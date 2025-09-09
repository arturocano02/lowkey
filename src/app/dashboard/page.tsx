'use client';

import { useState, useEffect } from 'react';

interface EmailData {
  email: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
}

interface EmailsResponse {
  emails: EmailData[];
  count: number;
}

export default function DashboardPage() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('lowkey-admin-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
      fetchEmails();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('lowkey-admin-auth', 'authenticated');
        setIsAuthenticated(true);
        fetchEmails();
      } else {
        setAuthError(data.error || 'Invalid password');
      }
    } catch (error) {
      setAuthError('Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lowkey-admin-auth');
    setIsAuthenticated(false);
    setPassword('');
    setEmails([]);
  };

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/emails');
      const data: EmailsResponse = await response.json();
      
      if (response.ok) {
        setEmails(data.emails);
        setError(null);
      } else {
        setError('Failed to fetch emails');
      }
    } catch (err) {
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      'Email,Timestamp,Device,IP',
      ...emails.map(email => 
        `"${email.email}","${email.timestamp}","${email.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}","${email.ip || 'unknown'}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lowkey-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const createBackup = async () => {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'lowkey2025' })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Backup created successfully!\nFile: ${data.backupFile}\nEmails backed up: ${data.emailsBackedUp}`);
      } else {
        alert('Backup failed: ' + data.error);
      }
    } catch (error) {
      alert('Backup failed: ' + error);
    }
  };

  const getDeviceType = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return '📱 Mobile';
    if (userAgent.includes('Tablet')) return '📱 Tablet';
    return '💻 Desktop';
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Lowkey Admin</h1>
              <p className="text-gray-400">Enter password to access dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              {authError && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isAuthLoading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading emails...</p>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Lowkey Email Dashboard</h1>
              <p className="text-gray-400">Total emails collected: {emails.length}</p>
              <p className="text-green-400 text-sm">✅ Persistent storage active - emails won&apos;t disappear on restart</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={fetchEmails}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={createBackup}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                disabled={emails.length === 0}
              >
                Create Backup
              </button>
              <button
                onClick={exportCSV}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                disabled={emails.length === 0}
              >
                Export CSV ({emails.length})
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {emails.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold mb-2">No emails collected yet</h3>
            <p className="text-gray-400">Emails will appear here once people start signing up on your landing page.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-400">{emails.length}</div>
                <div className="text-gray-400">Total Emails</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-400">
                  {emails.filter(e => e.userAgent.includes('Mobile')).length}
                </div>
                <div className="text-gray-400">Mobile Users</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-purple-400">
                  {emails.filter(e => !e.userAgent.includes('Mobile')).length}
                </div>
                <div className="text-gray-400">Desktop Users</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-2xl font-bold text-yellow-400">
                  {new Set(emails.map(e => e.ip)).size}
                </div>
                <div className="text-gray-400">Unique IPs</div>
              </div>
            </div>

            {/* Emails Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Email Collection</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Browser
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {emails.map((email, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {email.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(email.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {getDeviceType(email.userAgent)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {getBrowserInfo(email.userAgent)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                          {email.ip || 'unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Dashboard updates automatically. Refresh to see new emails.</p>
        </div>
      </div>
    </div>
  );
}
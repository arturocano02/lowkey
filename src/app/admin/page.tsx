'use client';

import { useState, useEffect } from 'react';

interface EmailData {
  email: string;
  timestamp: string;
  userAgent: string;
}

export default function AdminPage() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedEmails = localStorage.getItem('lowkey-emails');
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
  }, []);

  const exportEmails = () => {
    const csvContent = [
      'Email,Timestamp,User Agent',
      ...emails.map(email => `"${email.email}","${email.timestamp}","${email.userAgent}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lowkey-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearEmails = () => {
    if (confirm('Are you sure you want to clear all emails?')) {
      localStorage.removeItem('lowkey-emails');
      setEmails([]);
    }
  };

  if (!isClient) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lowkey Email Collection</h1>
        
        <div className="mb-6 flex gap-4">
          <button
            onClick={exportEmails}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            disabled={emails.length === 0}
          >
            Export CSV ({emails.length} emails)
          </button>
          <button
            onClick={clearEmails}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            disabled={emails.length === 0}
          >
            Clear All
          </button>
        </div>

        {emails.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            No emails collected yet. Visit the main page and submit some emails to see them here.
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
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
                        <div className="max-w-xs truncate" title={email.userAgent}>
                          {email.userAgent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

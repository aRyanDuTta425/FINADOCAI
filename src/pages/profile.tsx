import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  accountType?: string;
  profilePictureUrl?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

if (loading) return <div className="text-center py-10">Loading...</div>;
if (!user) return <div className="text-center py-10 text-red-500">Not logged in.</div>;

return (
  <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">🧑‍💼 Basic User Info</h1>
    <div className="flex flex-col items-center mb-6">
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden">
        {user.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">👤</span>
        )}
      </div>
      <div className="text-lg font-semibold">{user.name || 'No Name Set'}</div>
    </div>
    <div className="space-y-4">
      <div>
        <span className="font-medium">Email ID (verified):</span>
        <span className="ml-2">{user.email}</span>
      </div>
      <div>
        <span className="font-medium">Phone Number (optional):</span>
        <span className="ml-2 text-gray-500">{user.phone || 'Not set'}</span>
      </div>
      <div>
        <span className="font-medium">Account Type:</span>
        <span className="ml-2 text-gray-500">{user.accountType || 'Personal'}</span>
      </div>
    </div>
  </div>
);
}

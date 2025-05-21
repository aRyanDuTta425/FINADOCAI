import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();
  
  useEffect(() => {
    // Clear local storage token
    localStorage.removeItem('token');
    
    // Call the logout API to clear the HTTP-only cookie
    fetch('/api/auth/logout', {
      method: 'POST',
    }).then(() => {
      router.push('/login');
    });
  }, [router]);
  
  return <p className="text-center mt-10">Logging out...</p>;
}

Logout.getLayout = function PageLayout(page: React.ReactNode) {
  return <>{page}</>; // This disables layout for logout
};

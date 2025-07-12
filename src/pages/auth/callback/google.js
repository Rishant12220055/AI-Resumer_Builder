import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const GoogleCallback = () => {
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const { code, error: authError } = router.query;

        if (authError) {
          setError('Authentication failed. Please try again.');
          setStatus('Failed');
          return;
        }

        if (!code) {
          setStatus('No authorization code received');
          return;
        }

        setStatus('Exchanging code for token...');

        // In a real application, you would:
        // 1. Send the authorization code to your backend
        // 2. Backend exchanges code for access token with Google
        // 3. Backend gets user info from Google
        // 4. Backend creates/updates user in your database
        // 5. Backend returns user session

        // For demo purposes, simulate the process
        setTimeout(() => {
          const mockUser = {
            email: 'user@gmail.com',
            name: 'Google User',
            provider: 'google',
            picture: 'https://via.placeholder.com/40'
          };

          localStorage.setItem('user', JSON.stringify(mockUser));
          setStatus('Success! Redirecting...');
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }, 2000);

      } catch (error) {
        console.error('Google callback error:', error);
        setError('Authentication failed. Please try again.');
        setStatus('Failed');
      }
    };

    if (router.isReady) {
      handleGoogleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Google Authentication - AI Resume Builder</title>
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {error ? (
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Failed</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
              </div>
            ) : (
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Processing Google Authentication</h3>
                <p className="mt-1 text-sm text-gray-500">{status}</p>
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback; 
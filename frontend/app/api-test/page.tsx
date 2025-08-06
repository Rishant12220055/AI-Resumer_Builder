'use client';

import React, { useState, useEffect } from 'react';

interface TestResult {
  success: boolean;
  data?: any;
  status?: number;
  error?: string;
}

interface TestResults {
  [key: string]: TestResult;
}

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://ai-resumer-builder-backend.vercel.app/api';

  const runTests = async () => {
    setLoading(true);
    const results: TestResults = {};

    // Test 1: Basic Health Check
    try {
      const response = await fetch('https://ai-resumer-builder-backend.vercel.app/health');
      const data = await response.json();
      results.healthCheck = { success: true, data, status: response.status };
    } catch (error) {
      results.healthCheck = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Test 2: MongoDB Health Check
    try {
      const response = await fetch('https://ai-resumer-builder-backend.vercel.app/mongo-health');
      const data = await response.json();
      results.mongoHealth = { success: true, data, status: response.status };
    } catch (error) {
      results.mongoHealth = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Test 3: CORS Test
    try {
      const response = await fetch('https://ai-resumer-builder-backend.vercel.app/cors-test');
      const data = await response.json();
      results.corsTest = { success: true, data, status: response.status };
    } catch (error) {
      results.corsTest = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Test 4: Auth API Test
    try {
      const response = await fetch(`${API_BASE_URL}/auth/test`);
      const data = await response.json();
      results.authTest = { success: true, data, status: response.status };
    } catch (error) {
      results.authTest = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Test 5: Auth POST Test (should fail but show CORS working)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      const data = await response.json();
      results.authPostTest = { success: true, data, status: response.status };
    } catch (error) {
      results.authPostTest = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const renderResult = (key: string, result: TestResult) => (
    <div key={key} className="mb-4 p-4 border rounded">
      <h3 className="font-bold text-lg mb-2">{key}</h3>
      <div className={`p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className="font-semibold">
          Status: {result.success ? '✅ Success' : '❌ Failed'}
        </p>
        {result.status && <p>HTTP Status: {result.status}</p>}
        {result.data && (
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">Response Data</summary>
            <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
        {result.error && (
          <div className="mt-2">
            <p className="font-medium text-red-600">Error:</p>
            <p className="text-sm">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>
      
      <div className="mb-6">
        <p><strong>Frontend URL:</strong> https://ai-resumer-builder.vercel.app</p>
        <p><strong>Backend URL:</strong> https://ai-resumer-builder-backend.vercel.app</p>
        <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
      </div>

      <button 
        onClick={runTests} 
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Tests Again'}
      </button>

      <div>
        {Object.entries(testResults).map(([key, result]) => renderResult(key, result))}
      </div>

      {!loading && Object.keys(testResults).length === 0 && (
        <p>No test results yet. Click "Run Tests Again" to start.</p>
      )}
    </div>
  );
};

export default ApiTestPage;

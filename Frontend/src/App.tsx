import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = useState<'dashboard' | 'applications'>('dashboard');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="flex">
          <div className="w-64 bg-white h-screen border-r p-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-8">LoanTrend</h1>
            <nav className="space-y-2">
              <button onClick={() => setPage('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg ${page === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                📊 Dashboard
              </button>
              <button onClick={() => setPage('applications')} className={`w-full text-left px-4 py-3 rounded-lg ${page === 'applications' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                📋 Applications
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {page === 'dashboard' && <Dashboard />}
            {page === 'applications' && <Applications />}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
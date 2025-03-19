import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, History, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { history } = useSelector((state: RootState) => state.conversion);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
          Welcome back, {user?.email}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Transform your accent with our AI-powered conversion tool
        </p>
      </header>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Start a New Conversion</h2>
          <div className="mt-3 text-sm text-gray-500">
            Record or upload your audio to convert it to a different accent
          </div>
          <div className="mt-5">
            <Link
              to="/convert"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Converting
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Conversions</h2>
          {history.length > 0 ? (
            <div className="mt-4 space-y-4">
              {history.slice(0, 5).map((conversion) => (
                <div
                  key={conversion.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <History className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Conversion #{conversion.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(conversion.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      conversion.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : conversion.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {conversion.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No conversions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
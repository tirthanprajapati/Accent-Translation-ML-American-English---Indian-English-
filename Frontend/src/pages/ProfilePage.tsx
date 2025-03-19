import React from 'react';
import { useSelector } from 'react-redux';
import { History } from 'lucide-react';
import type { RootState } from '../store';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { history } = useSelector((state: RootState) => state.conversion);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
      </header>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Account ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Conversion History</h2>
        </div>
        <div className="border-t border-gray-200">
          {history.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {history.map((conversion) => (
                <li key={conversion.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
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
                    <div className="flex items-center space-x-4">
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
                      {conversion.status === 'completed' && (
                        <a
                          href={conversion.convertedAudio}
                          download
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-5 sm:px-6 text-sm text-gray-500">No conversion history</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
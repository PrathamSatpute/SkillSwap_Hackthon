import React, { useState } from 'react';
import { User, MapPin, Star, MessageSquare, Eye } from 'lucide-react';
import { User as UserType } from '../../types';
import { useApp } from '../../contexts/AppContext';
import SwapRequestModal from '../Swaps/SwapRequestModal';

interface UserCardProps {
  user: UserType;
  onViewProfile: (user: UserType) => void;
}

export default function UserCard({ user, onViewProfile }: UserCardProps) {
  const { state } = useApp();
  const { currentUser } = state;
  const [showSwapModal, setShowSwapModal] = useState(false);

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                {user.location && (
                  <div className="flex items-center space-x-1 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewProfile(user)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="View Profile"
                >
                  <Eye className="w-5 h-5" />
                </button>
                
                {!isOwnProfile && (
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    title="Request Swap"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 mt-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600">
                {user.rating.toFixed(1)} ({user.totalRatings} reviews)
              </span>
            </div>

            <div className="mt-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Wants to Learn:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{user.skillsWanted.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSwapModal && (
        <SwapRequestModal
          targetUser={user}
          onClose={() => setShowSwapModal(false)}
        />
      )}
    </>
  );
}
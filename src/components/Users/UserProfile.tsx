import React from 'react';
import { User, MapPin, Star, X, Calendar, Award } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserProfileProps {
  user: UserType;
  onClose: () => void;
}

export default function UserProfile({ user, onClose }: UserProfileProps) {
  const joinedDate = new Date(user.joinDate).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-6">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-12 h-12 text-gray-600" />
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              
              {user.location && (
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}

              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">
                    {user.rating.toFixed(1)} ({user.totalRatings} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Joined {joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Skills Offered</h4>
              </div>
              
              {user.skillsOffered.length > 0 ? (
                <div className="space-y-3">
                  {user.skillsOffered.map((skill) => (
                    <div key={skill.id} className="p-4 bg-white rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{skill.name}</h5>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                      <span className="text-xs text-blue-600 font-medium">{skill.category}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h4 className="text-lg font-semibold text-gray-900">Wants to Learn</h4>
              </div>
              
              {user.skillsWanted.length > 0 ? (
                <div className="space-y-3">
                  {user.skillsWanted.map((skill) => (
                    <div key={skill.id} className="p-4 bg-white rounded-lg border border-purple-100">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{skill.name}</h5>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                      <span className="text-xs text-purple-600 font-medium">{skill.category}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>
          </div>

          {user.availability.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Availability</h4>
              <div className="flex flex-wrap gap-2">
                {user.availability.map((time) => (
                  <span
                    key={time}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { User, MapPin, Star, Edit3, Eye, EyeOff, Calendar, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import ProfileEdit from './ProfileEdit';

export default function ProfileView() {
  const { state } = useApp();
  const { currentUser } = state;
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) return null;

  if (isEditing) {
    return <ProfileEdit onCancel={() => setIsEditing(false)} />;
  }

  const joinedDate = new Date(currentUser.joinDate).toLocaleDateString();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="flex items-start space-x-6">
          {currentUser.profilePhoto ? (
            <img
              src={currentUser.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <User className="w-12 h-12 text-gray-600" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{currentUser.name}</h2>
            
            {currentUser.location && (
              <div className="flex items-center space-x-1 text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{currentUser.location}</span>
              </div>
            )}

            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  {currentUser.rating.toFixed(1)} ({currentUser.totalRatings} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Joined {joinedDate}</span>
              </div>

              <div className="flex items-center space-x-1">
                {currentUser.isPublic ? (
                  <Eye className="w-4 h-4 text-green-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-600">
                  {currentUser.isPublic ? 'Public Profile' : 'Private Profile'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Skills I Offer</h3>
          </div>
          
          {currentUser.skillsOffered.length > 0 ? (
            <div className="space-y-3">
              {currentUser.skillsOffered.map((skill) => (
                <div key={skill.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                  <span className="text-xs text-blue-600 font-medium">{skill.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills added yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Skills I Want to Learn</h3>
          </div>
          
          {currentUser.skillsWanted.length > 0 ? (
            <div className="space-y-3">
              {currentUser.skillsWanted.map((skill) => (
                <div key={skill.id} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                  <span className="text-xs text-purple-600 font-medium">{skill.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills added yet</p>
          )}
        </div>
      </div>

      {currentUser.availability.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.availability.map((time) => (
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
  );
}
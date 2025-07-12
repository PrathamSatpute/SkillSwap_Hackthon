import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import UserCard from '../Users/UserCard';
import UserProfile from '../Users/UserProfile';
import { User } from '../../types';

export default function BrowseSkills() {
  const { state, searchUsers } = useApp();
  const { users, currentUser, searchTerm, selectedCategory } = state;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const skillCategories = [
    'All', 'Programming', 'Design', 'Marketing', 'Business', 'Language',
    'Music', 'Photography', 'Writing', 'Cooking', 'Fitness'
  ];

  const availabilityOptions = [
    'All', 'Weekdays Morning', 'Weekdays Afternoon', 'Weekdays Evening',
    'Weekends Morning', 'Weekends Afternoon', 'Weekends Evening'
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Don't show current user or inactive users
      if (user.id === currentUser?.id || !user.isActive || !user.isPublic) {
        return false;
      }

      // Search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(term);
        const matchesSkillsOffered = user.skillsOffered.some(skill => 
          skill.name.toLowerCase().includes(term) || 
          skill.description.toLowerCase().includes(term) ||
          skill.category.toLowerCase().includes(term)
        );
        const matchesSkillsWanted = user.skillsWanted.some(skill => 
          skill.name.toLowerCase().includes(term) || 
          skill.description.toLowerCase().includes(term) ||
          skill.category.toLowerCase().includes(term)
        );
        
        if (!matchesName && !matchesSkillsOffered && !matchesSkillsWanted) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && selectedCategory !== 'All') {
        const hasMatchingSkill = user.skillsOffered.some(skill => 
          skill.category === selectedCategory
        ) || user.skillsWanted.some(skill => 
          skill.category === selectedCategory
        );
        
        if (!hasMatchingSkill) {
          return false;
        }
      }

      // Location filter
      if (locationFilter) {
        if (!user.location || !user.location.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
      }

      // Availability filter
      if (availabilityFilter && availabilityFilter !== 'All') {
        if (!user.availability.includes(availabilityFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [users, currentUser, searchTerm, selectedCategory, locationFilter, availabilityFilter]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        searchUsers(localSearchTerm, selectedCategory);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [localSearchTerm, selectedCategory, searchUsers, searchTerm]);

  const handleSearch = useCallback((term: string) => {
    setLocalSearchTerm(term);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    searchUsers(searchTerm, category);
  }, [searchUsers, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Skills</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills or users..."
              value={localSearchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {skillCategories.map(category => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availabilityOptions.map(option => (
              <option key={option} value={option}>
                {option === 'All' ? 'Any availability' : option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </span>
          {(searchTerm || selectedCategory || locationFilter || availabilityFilter !== 'All') && (
            <button
              onClick={() => {
                handleSearch('');
                handleCategoryChange('');
                setLocationFilter('');
                setAvailabilityFilter('All');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse different skill categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onViewProfile={setSelectedUser}
            />
          ))}
        </div>
      )}

      {selectedUser && (
        <UserProfile
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
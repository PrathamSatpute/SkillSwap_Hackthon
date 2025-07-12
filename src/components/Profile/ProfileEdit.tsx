import React, { useState } from 'react';
import { Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Skill } from '../../types';

interface ProfileEditProps {
  onCancel: () => void;
}

export default function ProfileEdit({ onCancel }: ProfileEditProps) {
  const { state, updateProfile } = useApp();
  const { currentUser } = state;

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    location: currentUser?.location || '',
    profilePhoto: currentUser?.profilePhoto || '',
    isPublic: currentUser?.isPublic ?? true,
  });

  const [skillsOffered, setSkillsOffered] = useState<Skill[]>(currentUser?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState<Skill[]>(currentUser?.skillsWanted || []);
  const [availability, setAvailability] = useState<string[]>(currentUser?.availability || []);

  const skillCategories = [
    'Programming', 'Design', 'Marketing', 'Business', 'Language',
    'Music', 'Photography', 'Writing', 'Cooking', 'Fitness'
  ];

  const availabilityOptions = [
    'Weekdays Morning', 'Weekdays Afternoon', 'Weekdays Evening',
    'Weekends Morning', 'Weekends Afternoon', 'Weekends Evening'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, profilePhoto: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = (type: 'offered' | 'wanted') => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: '',
      description: '',
      level: 'Beginner',
      category: '',
    };

    if (type === 'offered') {
      setSkillsOffered([...skillsOffered, newSkill]);
    } else {
      setSkillsWanted([...skillsWanted, newSkill]);
    }
  };

  const updateSkill = (type: 'offered' | 'wanted', skillId: string, updates: Partial<Skill>) => {
    const updateSkills = (skills: Skill[]) =>
      skills.map(skill => skill.id === skillId ? { ...skill, ...updates } : skill);

    if (type === 'offered') {
      setSkillsOffered(updateSkills(skillsOffered));
    } else {
      setSkillsWanted(updateSkills(skillsWanted));
    }
  };

  const removeSkill = (type: 'offered' | 'wanted', skillId: string) => {
    if (type === 'offered') {
      setSkillsOffered(skillsOffered.filter(s => s.id !== skillId));
    } else {
      setSkillsWanted(skillsWanted.filter(s => s.id !== skillId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty skills
    const validSkillsOffered = skillsOffered.filter(skill => skill.name && skill.description && skill.category);
    const validSkillsWanted = skillsWanted.filter(skill => skill.name && skill.description && skill.category);

    updateProfile({
      ...formData,
      skillsOffered: validSkillsOffered,
      skillsWanted: validSkillsWanted,
      availability,
    });

    onCancel();
  };

  const SkillEditForm = ({ 
    title, 
    skills, 
    type 
  }: { 
    title: string; 
    skills: Skill[]; 
    type: 'offered' | 'wanted';
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => addSkill(type)}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {skills.map((skill) => (
        <div key={skill.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => updateSkill(type, skill.id, { name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={skill.category}
                onChange={(e) => updateSkill(type, skill.id, { category: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {skillCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeSkill(type, skill.id)}
              className="ml-2 p-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <textarea
            placeholder="Describe the skill"
            value={skill.description}
            onChange={(e) => updateSkill(type, skill.id, { description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />

          <select
            value={skill.level}
            onChange={(e) => updateSkill(type, skill.id, { level: e.target.value as Skill['level'] })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="profilePhoto"
              />
              <label
                htmlFor="profilePhoto"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </label>
              {formData.profilePhoto && (
                <img
                  src={formData.profilePhoto}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Make my profile public and searchable
              </span>
            </label>
          </div>

          <SkillEditForm 
            title="Skills I Offer" 
            skills={skillsOffered} 
            type="offered" 
          />

          <SkillEditForm 
            title="Skills I Want to Learn" 
            skills={skillsWanted} 
            type="wanted" 
          />

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Availability</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availabilityOptions.map(option => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={availability.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAvailability([...availability, option]);
                      } else {
                        setAvailability(availability.filter(a => a !== option));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
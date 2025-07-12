import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { User, Skill } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface SwapRequestModalProps {
  targetUser: User;
  onClose: () => void;
}

export default function SwapRequestModal({ targetUser, onClose }: SwapRequestModalProps) {
  const { state, createSwapRequest } = useApp();
  const { currentUser } = state;
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOfferedSkill || !selectedRequestedSkill || !currentUser) {
      return;
    }

    createSwapRequest({
      fromUserId: currentUser.id,
      toUserId: targetUser.id,
      offeredSkillId: selectedOfferedSkill,
      requestedSkillId: selectedRequestedSkill,
      message,
      status: 'pending',
    });

    onClose();
  };

  if (!currentUser) return null;

  const availableOfferedSkills = currentUser.skillsOffered.filter(skill =>
    targetUser.skillsWanted.some(wanted => 
      wanted.category === skill.category || wanted.name.toLowerCase().includes(skill.name.toLowerCase())
    )
  );

  const availableRequestedSkills = targetUser.skillsOffered.filter(skill =>
    currentUser.skillsWanted.some(wanted => 
      wanted.category === skill.category || wanted.name.toLowerCase().includes(skill.name.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Swapping with: {targetUser.name}</h3>
            <p className="text-sm text-gray-600">
              Choose one of your skills to offer in exchange for one of their skills.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Want to Offer
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a skill to offer</option>
              {currentUser.skillsOffered.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.level})
                </option>
              ))}
            </select>
            {availableOfferedSkills.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                ✓ You have {availableOfferedSkills.length} skill(s) that match their interests
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Want to Learn
            </label>
            <select
              value={selectedRequestedSkill}
              onChange={(e) => setSelectedRequestedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a skill to learn</option>
              {targetUser.skillsOffered.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.level})
                </option>
              ))}
            </select>
            {availableRequestedSkills.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                ✓ They offer {availableRequestedSkills.length} skill(s) you want to learn
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedOfferedSkill || !selectedRequestedSkill}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
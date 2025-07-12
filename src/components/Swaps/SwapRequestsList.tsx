import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Trash2, Star, MessageSquare } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { SwapRequest } from '../../types';
import RatingModal from './RatingModal';

export default function SwapRequestsList() {
  const { state, updateSwapRequest, deleteSwapRequest, getUserById } = useApp();
  const { currentUser } = state;
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [showRatingModal, setShowRatingModal] = useState<SwapRequest | null>(null);

  if (!currentUser) return null;

  const userSwapRequests = state.swapRequests.filter(
    request => request.fromUserId === currentUser.id || request.toUserId === currentUser.id
  );

  const filteredRequests = userSwapRequests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const getStatusColor = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, 'accepted');
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, 'rejected');
  };

  const handleComplete = (requestId: string) => {
    updateSwapRequest(requestId, 'completed');
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
  };

  const canRate = (request: SwapRequest) => {
    return request.status === 'completed' && 
           !state.ratings.some(rating => 
             rating.swapRequestId === request.id && 
             rating.fromUserId === currentUser.id
           );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Swap Requests</h1>
          
          <div className="flex space-x-2">
            {(['all', 'pending', 'accepted', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't made or received any swap requests yet."
                : `No ${filter} swap requests found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const isIncoming = request.toUserId === currentUser.id;
              const otherUser = getUserById(isIncoming ? request.fromUserId : request.toUserId);
              const offeredSkill = currentUser.skillsOffered.find(s => s.id === request.offeredSkillId) ||
                                 otherUser?.skillsOffered.find(s => s.id === request.offeredSkillId);
              const requestedSkill = currentUser.skillsOffered.find(s => s.id === request.requestedSkillId) ||
                                   otherUser?.skillsOffered.find(s => s.id === request.requestedSkillId);

              return (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          {isIncoming ? 'Incoming' : 'Outgoing'} Request
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900">
                        {isIncoming ? `${otherUser?.name} wants to swap skills` : `Request to ${otherUser?.name}`}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(request.createdDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      {request.status === 'pending' && isIncoming && (
                        <>
                          <button
                            onClick={() => handleAccept(request.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => handleComplete(request.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Mark Complete
                        </button>
                      )}

                      {canRate(request) && (
                        <button
                          onClick={() => setShowRatingModal(request)}
                          className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                        >
                          <Star className="w-4 h-4" />
                          <span>Rate</span>
                        </button>
                      )}

                      {(request.status === 'pending' && !isIncoming) && (
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">
                        {isIncoming ? 'They Offer' : 'You Offer'}
                      </h4>
                      <p className="text-sm text-blue-800">
                        {offeredSkill?.name} ({offeredSkill?.level})
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-1">
                        {isIncoming ? 'They Want' : 'You Want'}
                      </h4>
                      <p className="text-sm text-purple-800">
                        {requestedSkill?.name} ({requestedSkill?.level})
                      </p>
                    </div>
                  </div>

                  {request.message && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Message</h4>
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showRatingModal && (
        <RatingModal
          swapRequest={showRatingModal}
          onClose={() => setShowRatingModal(null)}
        />
      )}
    </div>
  );
}
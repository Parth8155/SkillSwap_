import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Star, Calendar, MessageCircle, Filter, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { swapAPI, skillsAPI, messagesAPI } from '../../services/api';
import Avatar from '../Avatar';

const SwapRequests: React.FC<{ isSidebarCollapsed: boolean }> = ({ isSidebarCollapsed }) => {
  const { user: authUser } = useAuth();
  // Public request form state
  const [showPublicForm, setShowPublicForm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<any>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [wantedSkillId, setWantedSkillId] = useState('');
  const [publicMessage, setPublicMessage] = useState('');
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'active' | 'completed' | 'public'>('received');
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's skills for public form
  useEffect(() => {
    skillsAPI.getMySkills()
      .then(setMySkills)
      .catch(console.error);
    // Fetch all offered skills for desired dropdown
    skillsAPI.getOfferedSkills()
      .then(setAvailableSkills)
      .catch(console.error);
  }, []);

  // Handle accept/reject actions
  const handleRespond = async (swapId: string, response: 'accept' | 'reject') => {
    try {
      const updated = await swapAPI.respondToSwap(swapId, response);
      setSwaps(prev => prev.map(s => s.id === swapId ? updated : s));
    } catch (err) {
      console.error('Error responding to swap:', err);
    }
  };

  // Submit a new public request
  const submitPublicRequest = async () => {
    if (!offeredSkillId || !wantedSkillId) return;
    try {
      await swapAPI.createSwapRequest({
        skillOffered: offeredSkillId,
        skillWanted: wantedSkillId,
        message: publicMessage,
        isPublic: true
      });
      setShowPublicForm(false);
      setActiveTab('public');
    } catch (err) {
      console.error('Public request error', err);
    }
  };

  // Handle scheduling a session
  const handleScheduleSession = (swap: any) => {
    setSelectedSwap(swap);
    setShowScheduleModal(true);
    setScheduledDate('');
    setScheduledTime('');
    setSessionNotes('');
  };

  // Submit scheduled session
  const submitSchedule = async () => {
    if (!selectedSwap || !scheduledDate || !scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // In a real app, this would call an API to schedule the session
      // await swapAPI.scheduleSession(selectedSwap.id, {
      //   date: scheduledDate,
      //   time: scheduledTime,
      //   notes: sessionNotes
      // });

      // For now, just update the local state
      const updatedSwap = {
        ...selectedSwap,
        sessionDate: `${scheduledDate} at ${scheduledTime}`,
        status: 'in-progress'
      };

      setSwaps(prev => prev.map(s => s.id === selectedSwap.id ? updatedSwap : s));
      setShowScheduleModal(false);
      alert('Session scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling session:', error);
      alert('Failed to schedule session. Please try again.');
    }
  };

  // Handle messaging
  const handleMessage = async (swap: any) => {
    try {
      // Get the other participant (either requester or provider)
      const otherParticipant = swap.requester.id === authUser?.id
        ? swap.provider
        : swap.requester;

      // Create or find existing conversation
      await messagesAPI.createConversation(otherParticipant.id);

      // Redirect to messages page with the conversation
      // In a real app, you might use React Router
      window.location.href = '/messages';

    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filterSwapsByTab = (list: any[]) => {
    if (!authUser) return [];
    switch (activeTab) {
      case 'public':
        return list;
      case 'received':
        return list.filter(swap => swap.provider.id === authUser.id && swap.status === 'pending');
      case 'sent':
        return list.filter(swap => swap.requester.id === authUser.id);
      case 'active':
        return list.filter(swap => (swap.requester.id === authUser.id || swap.provider.id === authUser.id)
          && (swap.status === 'accepted' || swap.status === 'in-progress'));
      case 'completed':
        return list.filter(swap => (swap.requester.id === authUser.id || swap.provider.id === authUser.id)
          && swap.status === 'completed');
      default:
        return list;
    }
  };

  const filteredSwaps = filterSwapsByTab(swaps);

  const tabs = [
    { id: 'received', label: 'Received', count: swaps.filter(s => s.status === 'pending').length },
    { id: 'sent', label: 'Sent', count: authUser ? swaps.filter(s => s.requester.id === authUser.id).length : 0 },
    { id: 'active', label: 'Active', count: swaps.filter(s => s.status === 'accepted' || s.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: swaps.filter(s => s.status === 'completed').length },
    { id: 'public', label: 'Public', count: swaps.length }
  ];

  // Fetch swaps whenever activeTab or authUser changes
  useEffect(() => {
    if (!authUser) return;
    setLoading(true);
    const fetchFn = activeTab === 'public'
      ? swapAPI.getPublicSwaps
      : swapAPI.getSwapRequests;
    fetchFn()
      .then(data => setSwaps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab, authUser]);

  // Guard until authUser and swaps are ready
  if (!authUser || loading) {
    return <div className="p-6">Loading swap requests...</div>;
  }
  return (
    <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your skill exchange requests and track progress</p>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-yellow-400 rounded-2xl p-6 text-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending</h3>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{swaps.filter(s => s.status === 'pending').length}</div>
        </div>

        <div className="bg-blue-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Active</h3>
            <Check className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{swaps.filter(s => s.status === 'accepted' || s.status === 'in-progress').length}</div>
        </div>

        <div className="bg-green-400 rounded-2xl p-6 text-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Completed</h3>
            <Star className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{swaps.filter(s => s.status === 'completed').length}</div>
        </div>

        <div className="bg-purple-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Success Rate</h3>
            <Star className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">92%</div>
        </div>
      </div>

      {/* Public Request Modal */}
      {showPublicForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Public Swap Request</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Offered Skill</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  aria-label="Offered Skill"
                  value={offeredSkillId}
                  onChange={e => setOfferedSkillId(e.target.value)}
                  id="offeredSkillSelect"
                >
                  <option value="">Select your skill</option>
                  {mySkills.map(skill => (
                    <option key={skill._id} value={skill._id}>{skill.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="wantedSkillSelect" className="block mb-1">Wanted Skill</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  aria-label="Wanted Skill"
                  value={wantedSkillId}
                  onChange={e => setWantedSkillId(e.target.value)}
                  id="wantedSkillSelect"
                >
                  <option value="">Select desired skill</option>
                  {availableSkills.map(skill => (
                    <option key={skill._id} value={skill._id}>{skill.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="publicMessageTextarea" className="block mb-1">Message</label>
                <textarea
                  className="w-full border px-2 py-1 rounded"
                  rows={3}
                  aria-label="Message"
                  value={publicMessage}
                  onChange={e => setPublicMessage(e.target.value)}
                  id="publicMessageTextarea"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowPublicForm(false)} className="px-4 py-2">Cancel</button>
                <button onClick={submitPublicRequest} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && selectedSwap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Schedule Learning Session</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Scheduling with <strong>{selectedSwap.requester.id === authUser?.id ? selectedSwap.provider.name : selectedSwap.requester.name}</strong>
                </p>
              </div>
              <div>
                <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="sessionDate"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="sessionTime" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  id="sessionTime"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="sessionNotes" className="block text-sm font-medium text-gray-700 mb-1">Session Notes (Optional)</label>
                <textarea
                  id="sessionNotes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="Add any specific topics or goals for this session..."
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSchedule}
                  className="px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors"
                >
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-colors flex items-center space-x-2 ${activeTab === tab.id
                  ? 'text-lime-600 border-b-2 border-lime-400'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label} Requests
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600" title="Filter">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600" title="Toggle view">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="p-6">
          {filteredSwaps.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {activeTab === 'received' && "You don't have any pending requests at the moment."}
                {activeTab === 'sent' && "You haven't sent any requests yet."}
                {activeTab === 'active' && "No active swaps in progress."}
                {activeTab === 'completed' && "No completed swaps yet."}
                {activeTab === 'public' && "No public swaps available."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSwaps.map((swap) => (
                <div key={swap.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <Avatar
                      src={swap.requester.avatar}
                      name={swap.requester.name}
                      size={48}
                      className="flex-shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{swap.requester.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(swap.status)}`}>
                              {getStatusIcon(swap.status)}
                              <span>{swap.status}</span>
                            </span>
                          </div>
                          <p className="text-gray-600">{swap.requester.role}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">{swap.timestamp}</p>
                          {swap.sessionDate && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>{swap.sessionDate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Offering</p>
                            <p className="font-medium text-gray-900">{swap.skillOffered.name}</p>
                            <span className="text-xs text-gray-500">{swap.skillOffered.category}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                            <div className="text-gray-400">⇄</div>
                            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                              <Star className="w-4 h-4 text-white" />
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-600">Wants</p>
                            <p className="font-medium text-gray-900">{swap.skillWanted.name}</p>
                            <span className="text-xs text-gray-500">{swap.skillWanted.category}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mt-4">{swap.message}</p>

                      {swap.feedback && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium text-green-800">Feedback</span>
                            {swap.rating && (
                              <span className="text-sm text-green-600">({swap.rating}/5)</span>
                            )}
                          </div>
                          <p className="text-green-700 text-sm">{swap.feedback}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 mt-4">
                        {swap.status === 'pending' && activeTab === 'received' && (
                          <>
                            <button onClick={() => handleRespond(swap.id, 'accept')} className="px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors flex items-center space-x-2">
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button onClick={() => handleRespond(swap.id, 'reject')} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-2">
                              <X className="w-4 h-4" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {(swap.status === 'accepted' || swap.status === 'in-progress') && (
                          <>
                            <button
                              onClick={() => handleScheduleSession(swap)}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>Schedule Session</span>
                            </button>
                            <button
                              onClick={() => handleMessage(swap)}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center space-x-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Message</span>
                            </button>
                          </>
                        )}

                        {swap.status === 'completed' && !swap.feedback && (
                          <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors flex items-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Leave Feedback</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequests;
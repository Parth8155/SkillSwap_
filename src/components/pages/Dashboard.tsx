import React, { useState, useEffect } from 'react';
import Avatar from '../Avatar';
import {
  Star,
  ArrowLeftRight,
  MessageCircle,
  Calendar,
  Check,
  Target,
  TrendingUp,
  Award,
  Filter,
  Eye,
  Zap,
  BookOpen,
  Clock,
  ChevronRight,
  Plus,
  Globe,
  Heart,
  Lightbulb,
  Trophy,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usersAPI, swapAPI } from '../../services/api';
import { socketService } from '../../services/socket';
import { achievements } from '../../data/mockData';

const Dashboard: React.FC<{ isSidebarCollapsed: boolean }> = ({ isSidebarCollapsed }) => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentSwaps, setRecentSwaps] = useState<any[]>([]);
  const [swapsLoading, setSwapsLoading] = useState(true);

  // Fetch profile data on mount
  useEffect(() => {
    if (!authUser) return;
    usersAPI.getProfile(authUser.id)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [authUser]);

  // Fetch recent swap activity
  useEffect(() => {
    if (!authUser) return;
    setSwapsLoading(true);
    swapAPI.getSwapRequests()
      .then(data => {
        // Sort by most recent and limit to recent activity
        const sortedSwaps = data.sort((a: any, b: any) =>
          new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime()
        ).slice(0, 10); // Show only 10 most recent
        setRecentSwaps(sortedSwaps);
        setSwapsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching swaps:', err);
        setRecentSwaps([]);
        setSwapsLoading(false);
      });
  }, [authUser]);

  // Function to handle swap responses
  const handleRespondToSwap = async (swapId: string, action: 'accept' | 'reject') => {
    try {
      await swapAPI.respondToSwap(swapId, action);
      // Refresh the swaps after responding
      const data = await swapAPI.getSwapRequests();
      const sortedSwaps = data.sort((a: any, b: any) =>
        new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime()
      ).slice(0, 10);
      setRecentSwaps(sortedSwaps);
    } catch (error) {
      console.error('Error responding to swap:', error);
    }
  };

  // Subscribe to status updates
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;
    const handler = ({ userId, status }: { userId: string; status: string }) => {
      if (profile && profile.id === userId) {
        setProfile((prev: any) => ({ ...prev, status }));
      }
    };
    socket.on('userStatusUpdate', handler);
    return () => { socket.off('userStatusUpdate', handler); };
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your skillful world...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-400/20 via-purple-400/20 to-yellow-400/20"></div>
        <div className="relative p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-lime-600 bg-clip-text text-transparent mb-4">
                Welcome back, {profile.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to unlock new skills and share your expertise? Your learning journey awaits!
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar
                      src={profile.avatar}
                      name={profile.name}
                      size={100}
                      className="ring-4 ring-lime-400/30"
                    />
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white ${getStatusColor(profile.status)} shadow-lg`} />
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-yellow-800" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-lg text-gray-600 mb-2">{profile.role}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{profile.rating}/5.0</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-purple-400" />
                        <span>{profile.completedSwaps} swaps</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>Since {new Date(profile.joinedDate).getFullYear()}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="group relative px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black rounded-full font-semibold hover:from-lime-500 hover:to-lime-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    title="Start a new skill swap"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Start Swap
                  </button>
                  <button
                    className="p-3 bg-white/50 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Send message"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    className="p-3 bg-white/50 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Schedule meeting"
                  >
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Skills Offered */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl p-6 text-black hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Skills Offered</h3>
                <Lightbulb className="w-8 h-8 text-black/70" />
              </div>
              <div className="text-4xl font-bold mb-2">{profile.skillsOffered.length}</div>
              <p className="text-black/70">Ready to share</p>
              <div className="mt-4 flex items-center text-sm text-black/60">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+2 this week</span>
              </div>
            </div>
          </div>

          {/* Skills Learning */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Learning Goals</h3>
                <BookOpen className="w-8 h-8 text-white/70" />
              </div>
              <div className="text-4xl font-bold mb-2">{profile.skillsWanted.length}</div>
              <p className="text-white/70">In progress</p>
              <div className="mt-4 flex items-center text-sm text-white/60">
                <Target className="w-4 h-4 mr-1" />
                <span>75% completed</span>
              </div>
            </div>
          </div>

          {/* Active Swaps */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 text-black hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Active Swaps</h3>
                <Zap className="w-8 h-8 text-black/70" />
              </div>
              <div className="text-4xl font-bold mb-2">{recentSwaps.filter((s: any) => s.status === 'accepted' || s.status === 'in-progress').length}</div>
              <p className="text-black/70">In progress</p>
              <div className="mt-4 flex items-center text-sm text-black/60">
                <Clock className="w-4 h-4 mr-1" />
                <span>3 this month</span>
              </div>
            </div>
          </div>

          {/* Community Impact */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Impact Score</h3>
                <Heart className="w-8 h-8 text-white/70" />
              </div>
              <div className="text-4xl font-bold mb-2">92</div>
              <p className="text-white/70">Community rating</p>
              <div className="mt-4 flex items-center text-sm text-white/60">
                <Globe className="w-4 h-4 mr-1" />
                <span>Top 10% globally</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Recent Activity</h2>
                    <p className="text-gray-600">Stay updated with your skill swaps</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Filter activities"
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="View options"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {swapsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading recent activity...</p>
                    </div>
                  </div>
                ) : recentSwaps.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ArrowLeftRight className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                    <p className="text-gray-600">Your skill swap activities will appear here</p>
                  </div>
                ) : (
                  recentSwaps.map((swap: any) => (
                    <div key={swap.id} className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                      <Avatar
                        src={swap.requester?.avatar || ''}
                        name={swap.requester?.name || 'Unknown User'}
                        size={48}
                        className="ring-2 ring-gray-100 group-hover:ring-lime-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{swap.requester?.name || 'Unknown User'}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(swap.status)}`}>
                            {swap.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          Wants to swap <span className="font-medium text-purple-600">{swap.skillOffered?.name || 'Unknown Skill'}</span> for{' '}
                          <span className="font-medium text-lime-600">{swap.skillWanted?.name || 'Unknown Skill'}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {swap.createdAt ? new Date(swap.createdAt).toLocaleDateString() :
                            swap.timestamp ? swap.timestamp : 'Unknown date'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {swap.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleRespondToSwap(swap.id, 'accept')}
                              className="px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors shadow-md hover:shadow-lg"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRespondToSwap(swap.id, 'reject')}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {swap.status === 'completed' && (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="More options"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-500" />
                Learning Progress
              </h3>
              <div className="space-y-4">
                {profile.skillsWanted.map((skill: any, index: number) => {
                  const progress = 75 - index * 15;
                  const progressClass = progress > 60 ? 'w-3/4' : progress > 30 ? 'w-1/2' : 'w-1/4';
                  return (
                    <div key={skill.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className="text-sm font-semibold text-purple-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r transition-all duration-500 ${progressClass} ${progress > 60 ? 'from-lime-400 to-lime-500' :
                            progress > 30 ? 'from-yellow-400 to-yellow-500' :
                              'from-red-400 to-red-500'
                            }`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{skill.category}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-500" />
                Recent Achievements
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
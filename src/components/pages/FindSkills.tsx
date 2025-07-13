import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, ArrowLeftRight, X, AlertCircle } from 'lucide-react';
import { usersAPI, swapAPI, skillsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { skillCategories, popularSkills } from '../../data/mockData';
import Avatar from '../Avatar';

const FindSkills: React.FC<{ isSidebarCollapsed: boolean }> = ({ isSidebarCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedSkillWanted, setSelectedSkillWanted] = useState<any>(null);
  const [selectedSkillOffered, setSelectedSkillOffered] = useState<any>(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all users and current user's skills
        const [usersData, userSkills] = await Promise.all([
          usersAPI.getAllUsers(),
          skillsAPI.getMySkills()
        ]);
        setUsers(usersData);
        setMySkills(userSkills);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    // Exclude current user from the list
    if (currentUser && user.id === currentUser.id) {
      return false;
    }

    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill: any) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory = !selectedCategory ||
      user.skillsOffered.some((skill: any) => skill.category === selectedCategory);
    const matchesLevel = !selectedLevel ||
      user.skillsOffered.some((skill: any) => skill.level === selectedLevel);

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Open swap request modal
  const openSwapModal = (user: any, skillWanted: any) => {
    setSelectedProvider(user);
    setSelectedSkillWanted(skillWanted);
    setSelectedSkillOffered(null);
    setSwapMessage('');
    setError(null);
    setShowSwapModal(true);
  };

  // Handle swap request submission
  const handleSwapRequest = async () => {
    if (!currentUser || !selectedProvider || !selectedSkillWanted || !selectedSkillOffered) {
      setError('Please select both skills for the swap.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await swapAPI.createSwapRequest({
        provider: selectedProvider.id,
        skillOffered: selectedSkillWanted.id, // Skill user wants to learn
        skillWanted: selectedSkillOffered.id, // Skill user is offering
        message: swapMessage || `I would like to learn ${selectedSkillWanted.name} and can teach ${selectedSkillOffered.name} in return.`,
      });

      setShowSwapModal(false);
      setSelectedProvider(null);
      setSelectedSkillWanted(null);
      setSelectedSkillOffered(null);
      setSwapMessage('');

      // Show success message
      alert('Swap request sent successfully! The user will be notified.');
    } catch (err: any) {
      console.error('Swap request error:', err);
      setError(err.response?.data?.message || 'Failed to send swap request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="p-6">Loading skills...</div>;
  }
  return (
    <div className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Skills</h1>
        <p className="text-gray-600">Discover talented people and learn new skills from the community</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills or people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            aria-label="Select category"
          >
            <option value="">All Categories</option>
            {skillCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            aria-label="Select skill level"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Results */}
          <div className="space-y-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-xs border border-gray-200 p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar with status */}
                  <div className="relative shrink-0">
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size={56}
                      className="object-cover border border-gray-100"
                    />
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Header row */}
                    <div className="flex flex-wrap justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[180px]">{user.name}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{user.role}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span>{user.rating}/5.0</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.completedSwaps} swaps</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => openSwapModal(user, user.skillsOffered[0])}
                        disabled={!user.skillsOffered.length}
                        className="h-fit px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        <span>Start Swap</span>
                      </button>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 leading-snug">{user.bio}</p>

                    {/* Skills Offered */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                        <span className="w-2 h-2 bg-lime-500 rounded-full mr-2"></span>
                        Skills Offered
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {user.skillsOffered.map((skill) => (
                          <div key={skill.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-lime-300 transition-colors">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h5 className="font-medium text-gray-900 text-sm">{skill.name}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)} whitespace-nowrap`}>
                                {skill.level}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{skill.description}</p>

                            {skill.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {skill.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="px-2 py-0.5 bg-white text-gray-600 rounded-full text-xs border border-gray-200">
                                    {tag}
                                  </span>
                                ))}
                                {skill.tags.length > 3 && (
                                  <span className="px-2 py-0.5 bg-white text-gray-400 rounded-full text-xs border border-gray-200">
                                    +{skill.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <button
                              onClick={() => openSwapModal(user, skill)}
                              className="w-full px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>Request Swap</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Wanted */}
                    {user.skillsWanted.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Looking to Learn
                        </h4>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="flex flex-wrap gap-2">
                            {user.skillsWanted.map((skill) => (
                              <div key={skill.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-purple-200 text-sm">
                                <span className="font-medium text-purple-800">{skill.name}</span>
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                  {skill.level}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Skills</h3>
            <div className="space-y-2">
              {popularSkills.slice(0, 8).map((skill, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(skill)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {skillCategories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedCategory === category
                    ? 'bg-lime-100 text-lime-800'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-lime-400 rounded-2xl p-6 text-black">
            <h3 className="font-semibold mb-4">Community Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold">{users.length + 1}</div>
                <div className="text-sm opacity-75">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm opacity-75">Skills Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm opacity-75">Swaps This Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && selectedProvider && selectedSkillWanted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Request Skill Swap
              </h3>
              <button
                onClick={() => setShowSwapModal(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Provider Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar
                  src={selectedProvider.avatar}
                  name={selectedProvider.name}
                  size={48}
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedProvider.name}</p>
                  <p className="text-sm text-gray-600">{selectedProvider.role}</p>
                </div>
              </div>

              {/* Skill You Want to Learn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Want to Learn:
                </label>
                <div className="p-3 bg-lime-50 border border-lime-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{selectedSkillWanted.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedSkillWanted.level)}`}>
                      {selectedSkillWanted.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedSkillWanted.description}</p>
                </div>
              </div>

              {/* Skill You're Offering */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You're Offering in Return:
                </label>
                <select
                  value={selectedSkillOffered?.id || ''}
                  onChange={(e) => {
                    const skill = mySkills.find(s => s.id === e.target.value);
                    setSelectedSkillOffered(skill);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  title="Select skill to offer"
                  required
                >
                  <option value="">Select a skill you can teach</option>
                  {mySkills.filter(skill => skill.type === 'offered').map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} ({skill.level})
                    </option>
                  ))}
                </select>
                {mySkills.filter(skill => skill.type === 'offered').length === 0 && (
                  <p className="text-sm text-orange-600 mt-1">
                    You need to add some skills you can offer in your profile first.
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional):
                </label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  placeholder={`Hi ${selectedProvider.name}, I'm interested in learning ${selectedSkillWanted.name}${selectedSkillOffered ? ` and can teach ${selectedSkillOffered.name} in return` : ''}. Let's discuss!`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleSwapRequest}
                disabled={submitting || !selectedSkillOffered}
                className="flex-1 px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Swap Request'}
              </button>
              <button
                onClick={() => setShowSwapModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindSkills;
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Target, BookOpen, Award, AlertCircle } from 'lucide-react';
import { skillsAPI } from '../../services/api';

interface BackendSkill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  tags: string[];
  type: 'offered' | 'wanted';
  userId: string;
}

const MySkills: React.FC<{ isSidebarCollapsed: boolean }> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState<'offered' | 'wanted'>('offered');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<BackendSkill | null>(null);
  const [skills, setSkills] = useState<BackendSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<BackendSkill>>({
    name: '',
    category: '',
    level: 'Beginner',
    description: '',
    tags: [],
    type: 'offered'
  });

  // Load skills on component mount
  useEffect(() => {
    loadMySkills();
  }, []);

  const loadMySkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const mySkills = await skillsAPI.getMySkills();
      setSkills(mySkills);
    } catch (err: any) {
      console.error('Error loading skills:', err);
      setError(err.response?.data?.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.category || !newSkill.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const skillData = {
        ...newSkill,
        type: activeTab,
        tags: newSkill.tags || []
      };

      await skillsAPI.createSkill(skillData);
      await loadMySkills(); // Reload skills

      setShowAddModal(false);
      setNewSkill({
        name: '',
        category: '',
        level: 'Beginner',
        description: '',
        tags: [],
        type: 'offered'
      });
    } catch (err: any) {
      console.error('Error adding skill:', err);
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSkill = async () => {
    if (!editingSkill || !editingSkill.id) {
      setError('No skill selected for editing');
      return;
    }

    if (!editingSkill.name || !editingSkill.category || !editingSkill.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await skillsAPI.updateSkill(editingSkill.id, {
        name: editingSkill.name,
        category: editingSkill.category,
        level: editingSkill.level,
        description: editingSkill.description,
        tags: editingSkill.tags || [],
        type: editingSkill.type
      });

      await loadMySkills(); // Reload skills
      setShowEditModal(false);
      setEditingSkill(null);
    } catch (err: any) {
      console.error('Error updating skill:', err);
      setError(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      setError(null);
      await skillsAPI.deleteSkill(skillId);
      await loadMySkills(); // Reload skills
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      setError(err.response?.data?.message || 'Failed to delete skill');
    }
  };

  const openEditModal = (skill: BackendSkill) => {
    setEditingSkill({ ...skill });
    setShowEditModal(true);
  };

  // Filter skills by type
  const offeredSkills = skills.filter(skill => skill.type === 'offered');
  const wantedSkills = skills.filter(skill => skill.type === 'wanted');
  const currentSkills = activeTab === 'offered' ? offeredSkills : wantedSkills;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Skills</h1>
        <p className="text-gray-600">Manage your skills and expertise to share with the community</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <span className="ml-3 text-gray-600">Loading your skills...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-lime-400 rounded-2xl p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Skills Offered</h3>
                <Star className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{offeredSkills.length}</div>
            </div>

            <div className="bg-purple-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Skills Wanted</h3>
                <Target className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{wantedSkills.length}</div>
            </div>

            <div className="bg-yellow-400 rounded-2xl p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">In Progress</h3>
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">3</div>
            </div>

            <div className="bg-blue-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Total Skills</h3>
                <Award className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{skills.length}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('offered')}
                  className={`px-6 py-4 font-medium transition-colors ${activeTab === 'offered'
                    ? 'text-lime-600 border-b-2 border-lime-400'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Skills I Offer ({offeredSkills.length})
                </button>
                <button
                  onClick={() => setActiveTab('wanted')}
                  className={`px-6 py-4 font-medium transition-colors ${activeTab === 'wanted'
                    ? 'text-purple-600 border-b-2 border-purple-400'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Skills I Want ({wantedSkills.length})
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'offered' ? 'Skills You Offer' : 'Skills You Want to Learn'}
                </h2>
                <button
                  onClick={() => {
                    setNewSkill({
                      name: '',
                      category: '',
                      level: 'Beginner',
                      description: '',
                      tags: [],
                      type: activeTab
                    });
                    setShowAddModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSkills.map((skill) => (
                  <div key={skill.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>
                        <p className="text-sm text-gray-600">{skill.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit skill"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{skill.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {skill.tags.map((tag, index) => (
                        <span
                          key={`${skill.id}-tag-${index}-${tag}`}
                          className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {currentSkills.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    {activeTab === 'offered' ? (
                      <Star className="w-12 h-12 mx-auto" />
                    ) : (
                      <Target className="w-12 h-12 mx-auto" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab === 'offered' ? 'offered' : 'wanted'} skills yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first {activeTab === 'offered' ? 'skill offering' : 'learning goal'}
                  </p>
                  <button
                    onClick={() => {
                      setNewSkill({
                        name: '',
                        category: '',
                        level: 'Beginner',
                        description: '',
                        tags: [],
                        type: activeTab
                      });
                      setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors"
                  >
                    Add Your First Skill
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Add New {activeTab === 'offered' ? 'Skill Offering' : 'Learning Goal'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="e.g., React Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  title="Select skill category"
                >
                  <option value="">Select category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Business">Business</option>
                  <option value="Language">Language</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts & Crafts">Arts & Crafts</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  title="Select skill level"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  rows={3}
                  placeholder="Describe your skill or what you want to learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newSkill.tags?.join(', ') || ''}
                  onChange={(e) => setNewSkill({
                    ...newSkill,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="e.g., frontend, javascript, ui/ux"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleAddSkill}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Adding...' : 'Add Skill'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setError(null);
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {showEditModal && editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Edit {editingSkill.type === 'offered' ? 'Skill Offering' : 'Learning Goal'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="e.g., React Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  title="Select skill category"
                >
                  <option value="">Select category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Business">Business</option>
                  <option value="Language">Language</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts & Crafts">Arts & Crafts</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={editingSkill.level}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  title="Select skill level"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingSkill.description}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  rows={3}
                  placeholder="Describe your skill or what you want to learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingSkill.tags?.join(', ') || ''}
                  onChange={(e) => setEditingSkill({
                    ...editingSkill,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="e.g., frontend, javascript, ui/ux"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleEditSkill}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating...' : 'Update Skill'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSkill(null);
                  setError(null);
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
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

export default MySkills;
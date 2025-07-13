import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  ArrowLeftRight, 
  MessageCircle, 
  User, 
  Settings,
  Home,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Check,
  Clock,
  Target,
  TrendingUp,
  Users,
  Award,
  Bell,
  Filter,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

interface SkillSwap {
  id: string;
  requester: User;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'completed';
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  const currentUser: User = {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Product Designer • Google',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  };

  const contacts: User[] = [
    {
      id: '2',
      name: 'Alex Chen',
      role: 'Frontend Developer',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'online'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      role: 'UX Designer',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'away'
    },
    {
      id: '4',
      name: 'James Wilson',
      role: 'Data Scientist',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'busy'
    },
    {
      id: '5',
      name: 'Emma Thompson',
      role: 'Marketing Manager',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'offline'
    }
  ];

  const recentSwaps: SkillSwap[] = [
    {
      id: '1',
      requester: contacts[0],
      skillOffered: 'React Development',
      skillWanted: 'UI Design',
      status: 'pending',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      requester: contacts[1],
      skillOffered: 'Figma Prototyping',
      skillWanted: 'JavaScript',
      status: 'accepted',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      requester: contacts[2],
      skillOffered: 'Python Analytics',
      skillWanted: 'Design Systems',
      status: 'completed',
      timestamp: '3 days ago'
    }
  ];

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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-black text-white flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold">SkillSwap</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {[
              { icon: Home, label: 'Dashboard', active: true },
              { icon: Star, label: 'My Skills' },
              { icon: Search, label: 'Find Skills' },
              { icon: ArrowLeftRight, label: 'Swap Requests' },
              { icon: MessageCircle, label: 'Messages' },
              { icon: User, label: 'Profile' },
              { icon: Settings, label: 'Settings' }
            ].map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  item.active 
                    ? 'bg-lime-400 text-black' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* User Profile Cards */}
        <div className="p-4 space-y-4">
          {/* Current User */}
          <div className="bg-lime-400 rounded-2xl p-4 text-black">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-lime-400 ${getStatusColor(currentUser.status)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{currentUser.name}</p>
                <p className="text-sm opacity-75 truncate">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Recent Contacts</h3>
            {contacts.slice(0, 3).map((contact) => (
              <div
                key={contact.id}
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => setSelectedUser(contact)}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${getStatusColor(contact.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contact.name}</p>
                  <p className="text-sm text-gray-400 truncate">{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${getStatusColor(currentUser.status)}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-gray-600">{currentUser.role}</p>
                <p className="text-sm text-gray-500">sarah.johnson@example.com • (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {[Phone, Mail, Calendar, MessageCircle].map((Icon, index) => (
                <button
                  key={index}
                  className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center text-black hover:bg-lime-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
              <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">High</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Warm</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Deal #536,276</span>
              <button className="text-blue-600 hover:text-blue-800">Summary</button>
              <button className="text-gray-600 hover:text-gray-800">Analytics</button>
              <button className="text-gray-600 hover:text-gray-800">Details</button>
              <button className="text-gray-600 hover:text-gray-800">Files</button>
              <button className="text-gray-600 hover:text-gray-800">History</button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Center Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {recentSwaps.map((swap) => (
                  <div key={swap.id} className="flex items-start space-x-4">
                    <img
                      src={swap.requester.avatar}
                      alt={swap.requester.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{swap.requester.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(swap.status)}`}>
                          {swap.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        Wants to swap <span className="font-medium">{swap.skillOffered}</span> for{' '}
                        <span className="font-medium">{swap.skillWanted}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{swap.timestamp}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {swap.status === 'pending' && (
                        <>
                          <button className="px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-500 transition-colors">
                            Accept
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            Decline
                          </button>
                        </>
                      )}
                      {swap.status === 'completed' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                    alt="Alex Chen"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Alex Chen</p>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                <div className="flex justify-end">
                  <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-xs">
                    <p>Hey! How are you?</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-md max-w-xs">
                    <p>We discussed your wishes with the guys in the production department and prepared a proposal.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-md max-w-xs">
                    <p>Sending it to you, I hope it meets your wishes.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-xs">
                    <p>Great, looking forward to it! Talk to our finance guy and give you an answer.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black hover:bg-lime-500 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-6 space-y-6">
            {/* Skills Offered */}
            <div className="bg-lime-400 rounded-2xl p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Skills Offered</h3>
                <Star className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold mb-2">8</div>
              <p className="text-sm opacity-75">Active skills ready to share</p>
            </div>

            {/* Skills Wanted */}
            <div className="bg-purple-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Skills Learning</h3>
                <Target className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold mb-2">5</div>
              <p className="text-sm opacity-75">Skills on learning list</p>
            </div>

            {/* Active Swaps */}
            <div className="bg-yellow-400 rounded-2xl p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Active Swaps</h3>
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold mb-2">12</div>
              <p className="text-sm opacity-75">Ongoing skill exchanges</p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Learning Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">React Development</span>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-lime-400 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">UI Design</span>
                    <span className="text-sm text-gray-500">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Python</span>
                    <span className="text-sm text-gray-500">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">First Successful Swap</p>
                    <p className="text-xs text-gray-500">Completed React for Design trade</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Community Helper</p>
                    <p className="text-xs text-gray-500">Helped 10+ people learn skills</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quick Learner</p>
                    <p className="text-xs text-gray-500">Completed 3 skills this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
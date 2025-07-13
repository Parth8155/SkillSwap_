import { User, Skill, SkillSwap, Conversation, Message, Achievement } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  role: 'Product Designer • Google',
  avatar: '', // Empty avatar to test auto-generation
  status: 'online',
  email: 'sarah.johnson@example.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Passionate product designer with 8+ years of experience creating user-centered digital experiences. Love sharing design knowledge and learning new technologies.',
  skillsOffered: [
    {
      id: '1',
      name: 'UI/UX Design',
      category: 'Design',
      level: 'Expert',
      description: 'Complete user interface and experience design from research to prototyping',
      tags: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research']
    },
    {
      id: '2',
      name: 'Design Systems',
      category: 'Design',
      level: 'Advanced',
      description: 'Building scalable design systems and component libraries',
      tags: ['Design Tokens', 'Component Libraries', 'Style Guides']
    }
  ],
  skillsWanted: [
    {
      id: '3',
      name: 'React Development',
      category: 'Programming',
      level: 'Beginner',
      description: 'Want to learn modern React development and hooks',
      tags: ['React', 'JavaScript', 'Hooks', 'Components']
    },
    {
      id: '4',
      name: 'Data Analysis',
      category: 'Analytics',
      level: 'Beginner',
      description: 'Learning data analysis and visualization techniques',
      tags: ['Python', 'Pandas', 'Data Visualization']
    }
  ],
  rating: 4.9,
  completedSwaps: 24,
  joinedDate: '2023-01-15'
};

export const users: User[] = [
  {
    id: '2',
    name: 'Alex Chen',
    role: 'Frontend Developer',
    avatar: '', // Test auto-generation for Alex Chen (AC initials)
    status: 'online',
    email: 'alex.chen@example.com',
    phone: '(555) 234-5678',
    location: 'Seattle, WA',
    bio: 'Frontend developer specializing in React and modern web technologies. Always excited to share coding knowledge.',
    skillsOffered: [
      {
        id: '5',
        name: 'React Development',
        category: 'Programming',
        level: 'Expert',
        description: 'Advanced React development including hooks, context, and performance optimization',
        tags: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Redux']
      }
    ],
    skillsWanted: [
      {
        id: '6',
        name: 'UI Design',
        category: 'Design',
        level: 'Intermediate',
        description: 'Want to improve my design skills for better developer-designer collaboration',
        tags: ['Figma', 'Design Principles', 'Color Theory']
      }
    ],
    rating: 4.8,
    completedSwaps: 18,
    joinedDate: '2023-02-20'
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    role: 'UX Designer',
    avatar: '', // Test auto-generation for Maria Rodriguez (MR initials)
    status: 'away',
    email: 'maria.rodriguez@example.com',
    phone: '(555) 345-6789',
    location: 'Austin, TX',
    bio: 'UX designer passionate about creating inclusive and accessible digital experiences.',
    skillsOffered: [
      {
        id: '7',
        name: 'User Research',
        category: 'Design',
        level: 'Expert',
        description: 'Comprehensive user research methodologies and analysis',
        tags: ['User Interviews', 'Usability Testing', 'Surveys', 'Analytics']
      }
    ],
    skillsWanted: [
      {
        id: '8',
        name: 'Prototyping',
        category: 'Design',
        level: 'Intermediate',
        description: 'Advanced prototyping techniques and tools',
        tags: ['Framer', 'Principle', 'Interactive Prototypes']
      }
    ],
    rating: 4.7,
    completedSwaps: 15,
    joinedDate: '2023-03-10'
  }
];

export const allUsers = [currentUser, ...users];

export const skillSwaps: SkillSwap[] = [
  {
    id: '1',
    requester: users[0],
    provider: currentUser,
    skillOffered: users[0].skillsOffered[0],
    skillWanted: currentUser.skillsOffered[0],
    status: 'pending',
    timestamp: '2 hours ago',
    message: 'Hi Sarah! I\'d love to learn UI/UX design from you. I can teach you React in return. What do you think?'
  },
  {
    id: '2',
    requester: currentUser,
    provider: users[1],
    skillOffered: currentUser.skillsOffered[1],
    skillWanted: users[1].skillsOffered[0],
    status: 'accepted',
    timestamp: '1 day ago',
    message: 'Would love to learn user research methods from you!',
    sessionDate: '2024-01-20'
  },
  {
    id: '3',
    requester: users[1],
    provider: currentUser,
    skillOffered: users[1].skillsOffered[0],
    skillWanted: currentUser.skillsOffered[0],
    status: 'completed',
    timestamp: '3 days ago',
    message: 'Thanks for the amazing design systems session!',
    rating: 5,
    feedback: 'Sarah is an excellent teacher! Very patient and knowledgeable.'
  }
];

export const conversations: Conversation[] = [
  {
    id: '1',
    participants: [currentUser, users[0]],
    lastMessage: {
      id: '1',
      senderId: users[0].id,
      receiverId: currentUser.id,
      content: 'Thanks for accepting my swap request! When would be a good time for our first session?',
      timestamp: '10 minutes ago',
      read: false,
      type: 'text'
    },
    unreadCount: 2,
    messages: [
      {
        id: '1',
        senderId: users[0].id,
        receiverId: currentUser.id,
        content: 'Hi Sarah! I saw your profile and I\'m really interested in learning UI/UX design.',
        timestamp: '2 hours ago',
        read: true,
        type: 'text'
      },
      {
        id: '2',
        senderId: currentUser.id,
        receiverId: users[0].id,
        content: 'Hi Alex! I\'d be happy to help you with design. Your React skills would be perfect for what I want to learn.',
        timestamp: '1 hour ago',
        read: true,
        type: 'text'
      },
      {
        id: '3',
        senderId: users[0].id,
        receiverId: currentUser.id,
        content: 'Thanks for accepting my swap request! When would be a good time for our first session?',
        timestamp: '10 minutes ago',
        read: false,
        type: 'text'
      }
    ]
  }
];

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Successful Swap',
    description: 'Completed your first skill exchange',
    icon: 'Award',
    unlockedAt: '2023-02-01',
    category: 'swaps'
  },
  {
    id: '2',
    title: 'Community Helper',
    description: 'Helped 10+ people learn new skills',
    icon: 'Users',
    unlockedAt: '2023-06-15',
    category: 'teaching'
  },
  {
    id: '3',
    title: 'Quick Learner',
    description: 'Completed 3 skills in one month',
    icon: 'TrendingUp',
    unlockedAt: '2023-08-20',
    category: 'learning'
  }
];

export const skillCategories = [
  'Programming',
  'Design',
  'Marketing',
  'Data Science',
  'Business',
  'Languages',
  'Creative',
  'Technology',
  'Finance',
  'Health & Wellness'
];

export const popularSkills = [
  'React Development',
  'UI/UX Design',
  'Python Programming',
  'Digital Marketing',
  'Data Analysis',
  'Graphic Design',
  'Project Management',
  'Content Writing',
  'Photography',
  'Public Speaking'
];
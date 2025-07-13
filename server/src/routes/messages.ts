import express from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import User from '../models/User';

const router = express.Router();

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name avatar email role status')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    const conversationsWithUnread = conversations.map(conv => {
      const unreadCount = conv.unreadCount.get(userId) || 0;
      return {
        ...conv.toJSON(),
        unreadCount
      };
    });

    res.json({
      success: true,
      data: conversationsWithUnread
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching conversations'
    });
  }
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
router.get('/conversations/:conversationId', async (req: AuthRequest, res: express.Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;
    
    // Verify user is participant in conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiverId: userId, read: false },
      { read: true }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
});

// @desc    Create or get conversation with another user
// @route   POST /api/messages/conversations
// @access  Private
router.post('/conversations', async (req: AuthRequest, res: express.Response) => {
  try {
    const { participantId } = req.body;
    const userId = req.user?.id;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    if (participantId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId], $size: 2 }
    }).populate('participants', 'name avatar email role status');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [userId, participantId]
      });
      
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name avatar email role status');
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating conversation'
    });
  }
});

// @desc    Get all users (for starting new conversations)
// @route   GET /api/messages/users
// @access  Private
router.get('/users', async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    
    const users = await User.find({ 
      _id: { $ne: userId } 
    }).select('name avatar email role status').sort({ name: 1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

export default router;

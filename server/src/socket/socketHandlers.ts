import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { SocketUser } from '../types';

const connectedUsers = new Map<string, SocketUser>();

export const initializeSocket = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.name);
    // Notify other users that this user is online
    socket.broadcast.emit('userOnline', socket.data.user._id.toString());

    // Add user to connected users
    connectedUsers.set(socket.data.user._id.toString(), {
      userId: socket.data.user._id.toString(),
      socketId: socket.id,
      status: 'online'
    });

    // Update user status
    User.findByIdAndUpdate(socket.data.user._id, {
      status: 'online',
      lastActive: new Date()
    }).exec();

    // Join user to their own room
    socket.join(socket.data.user._id.toString());
    // Conversation room handlers
    socket.on('joinConversation', (conversationId: string) => {
      socket.join(conversationId);
    });
    socket.on('leaveConversation', (conversationId: string) => {
      socket.leave(conversationId);
    });

    // Handle typing events
    socket.on('typing', ({ receiverId, isTyping }) => {
      socket.to(receiverId).emit('userTyping', {
        userId: socket.data.user._id.toString(),
        isTyping
      });
    });

    // Handle message events: persist and broadcast in conversation room
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, receiverId, content } = data;
        // Save message
        const message = await Message.create({
          senderId: socket.data.user._id,
          receiverId,
          conversationId,
          content
        });
        // Update conversation last message & unread count
        const conv = await Conversation.findById(conversationId);
        if (conv) {
          conv.lastMessage = message._id;
          const prev = conv.unreadCount.get(receiverId.toString()) || 0;
          conv.unreadCount.set(receiverId.toString(), prev + 1);
          await conv.save();
        }
        // Prepare payload
        const payload = {
          id: message._id.toString(),
          conversationId,
          senderId: socket.data.user._id.toString(),
          content,
          timestamp: message.createdAt
        };
        // Broadcast to conversation room
        io.to(conversationId).emit('messageReceived', payload);
      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    // Handle status updates
    socket.on('updateStatus', async (status) => {
      try {
        await User.findByIdAndUpdate(socket.data.user._id, { status });
        
        // Update in connected users
        const userConnection = connectedUsers.get(socket.data.user._id.toString());
        if (userConnection) {
          userConnection.status = status;
        }

        // Broadcast status update
        socket.broadcast.emit('userStatusUpdate', {
          userId: socket.data.user._id.toString(),
          status
        });
      } catch (error) {
        console.error('Status update error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.data.user.name);
      // Notify other users that this user is offline
      socket.broadcast.emit('userOffline', socket.data.user._id.toString());
      
      // Remove from connected users
      connectedUsers.delete(socket.data.user._id.toString());
      
      // Update user status
      await User.findByIdAndUpdate(socket.data.user._id, {
        status: 'offline',
        lastActive: new Date()
      });

      // Broadcast user offline
      socket.broadcast.emit('userStatusUpdate', {
        userId: socket.data.user._id.toString(),
        status: 'offline'
      });
    });
  });
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};

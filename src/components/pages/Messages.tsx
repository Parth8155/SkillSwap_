import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Plus,
  Circle,
  CheckCheck,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../services/socket';
import { messagesAPI, swapAPI } from '../../services/api';
import Avatar from '../Avatar';

const Messages: React.FC<{ isSidebarCollapsed: boolean }> = ({ isSidebarCollapsed }) => {
  const { user: authUser } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [acceptedSwapUsers, setAcceptedSwapUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const socketRef = useRef(socketService.getSocket());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (conversation: any) => {
    if (!authUser) return null;
    return conversation.participants.find((p: any) => p.id !== authUser.id);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load accepted swap users
  const loadAcceptedSwapUsers = async () => {
    if (!authUser) return;

    try {
      const swapRequests = await swapAPI.getSwapRequests();
      const acceptedUserIds = new Set<string>();

      swapRequests.forEach((swap: any) => {
        if (swap.status === 'accepted') {
          // If current user is the requester, add provider to accepted users
          if (swap.requester.id === authUser.id) {
            acceptedUserIds.add(swap.provider.id);
          }
          // If current user is the provider, add requester to accepted users
          else if (swap.provider.id === authUser.id) {
            acceptedUserIds.add(swap.requester.id);
          }
        }
      });

      setAcceptedSwapUsers(acceptedUserIds);
      return acceptedUserIds;
    } catch (error) {
      console.error('Error loading accepted swap users:', error);
      return new Set<string>();
    }
  };

  // Filter conversations to only show those with accepted swap users
  const filterConversationsByAcceptedSwaps = (conversationsData: any[], acceptedUsers: Set<string>) => {
    return conversationsData.filter(conversation => {
      const otherParticipant = conversation.participants.find((p: any) => p.id !== authUser?.id);
      return otherParticipant && acceptedUsers.has(otherParticipant.id);
    });
  };

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // First load accepted swap users
        const acceptedUsers = await loadAcceptedSwapUsers();

        // Then load conversations and filter them
        const conversationsData = await messagesAPI.getConversations();
        const filteredConversations = filterConversationsByAcceptedSwaps(conversationsData, acceptedUsers || new Set());

        setConversations(filteredConversations);
        if (filteredConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(filteredConversations[0]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      loadConversations();
    }
  }, [authUser]);

  // Load messages for selected conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        const messagesData = await messagesAPI.getMessages(selectedConversation.id);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Load users for new conversation (only accepted swap users)
  const loadUsers = async () => {
    try {
      const usersData = await messagesAPI.getUsers();
      // Filter users to only show those with accepted swaps
      const filteredUsers = usersData.filter((user: any) => acceptedSwapUsers.has(user.id));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // Create new conversation
  const createConversation = async (participantId: string) => {
    try {
      const conversation = await messagesAPI.createConversation(participantId);
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversation(conversation);
      setShowNewConversation(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };  // Enhanced message sending with typing indicators
  const handleSendMessage = () => {
    if (!authUser || !selectedConversation || !message.trim() || !socketRef.current) return;

    const other = selectedConversation.participants.find((p: any) => p.id !== authUser.id);
    if (!other) return;

    // Stop typing indicator
    socketRef.current.emit('stopTyping', {
      conversationId: selectedConversation.id,
      userId: authUser.id
    });

    socketRef.current.emit('sendMessage', {
      receiverId: other.id,
      conversationId: selectedConversation.id,
      content: message
    });

    // Optimistically update UI with the correct structure
    const newMessage = {
      id: Date.now().toString(),
      senderId: authUser.id,
      content: message,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Auto-scroll to bottom
    setTimeout(scrollToBottom, 100);
  };

  // Handle typing indicators
  const handleTyping = (value: string) => {
    setMessage(value);

    if (!socketRef.current || !selectedConversation || !authUser) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Start typing indicator
    socketRef.current.emit('startTyping', {
      conversationId: selectedConversation.id,
      userId: authUser.id
    });

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && authUser) {
        socketRef.current.emit('stopTyping', {
          conversationId: selectedConversation.id,
          userId: authUser.id
        });
      }
    }, 3000);
  };

  // Enhanced socket handling with typing indicators
  useEffect(() => {
    if (!authUser || !selectedConversation) return;

    const socket = socketRef.current;
    if (!socket) return;

    // Join selected conversation room
    socket.emit('joinConversation', selectedConversation.id);

    // Listen for incoming messages
    const messageHandler = (data: any) => {
      if (data.conversationId === selectedConversation.id) {
        setMessages(prev => [...prev, data]);
        setTimeout(scrollToBottom, 100);
      }
    };

    // Listen for typing indicators
    const typingStartHandler = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === selectedConversation.id && data.userId !== authUser.id) {
        setTypingUsers(prev => new Set([...prev, data.userId]));
      }
    };

    const typingStopHandler = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === selectedConversation.id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    };

    // Listen for message status updates
    const statusUpdateHandler = (data: { messageId: string; status: string }) => {
      setMessages(prev => prev.map(msg =>
        msg.id === data.messageId ? { ...msg, status: data.status } : msg
      ));
    };

    socket.on('messageReceived', messageHandler);
    socket.on('userStartedTyping', typingStartHandler);
    socket.on('userStoppedTyping', typingStopHandler);
    socket.on('messageStatusUpdate', statusUpdateHandler);

    return () => {
      socket.emit('leaveConversation', selectedConversation.id);
      socket.off('messageReceived', messageHandler);
      socket.off('userStartedTyping', typingStartHandler);
      socket.off('userStoppedTyping', typingStopHandler);
      socket.off('messageStatusUpdate', statusUpdateHandler);
    };
  }, [selectedConversation, authUser]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent rendering until user is ready
  if (!authUser) {
    return <div className="p-6">Please log in to access messages...</div>;
  }

  if (loading) {
    return <div className="p-6">Loading conversations...</div>;
  }

  return (
    <div className={`flex-1 flex h-full transition-all duration-300 bg-gradient-to-br from-gray-50 via-white to-lime-50 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
      {/* Conversations List */}
      <div className={`${isMobileView && selectedConversation ? 'hidden' : ''} w-full md:w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/60 flex flex-col shadow-lg`}>
        {/* Enhanced Header */}
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-lime-50/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-lime-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Messages</h1>
            </div>
            <button
              onClick={() => {
                setShowNewConversation(true);
                loadUsers();
              }}
              className="p-3 bg-gradient-to-r from-lime-400 to-green-500 text-white rounded-xl hover:from-lime-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              title="Start new conversation"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Enhanced Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            if (!otherParticipant) return null;

            const isSelected = selectedConversation?.id === conversation.id;
            const hasUnread = conversation.unreadCount > 0;

            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100/60 cursor-pointer hover:bg-gradient-to-r hover:from-lime-50/50 hover:to-green-50/30 transition-all duration-200 ${isSelected
                    ? 'bg-gradient-to-r from-lime-50 to-green-50/50 border-lime-200/60 shadow-inner'
                    : ''
                  } ${hasUnread ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar
                      src={otherParticipant.avatar}
                      name={otherParticipant.name}
                      size={52}
                      className={`ring-2 transition-all duration-200 ${isSelected ? 'ring-lime-200' : 'ring-gray-100'
                        } ${hasUnread ? 'ring-blue-200' : ''}`}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(otherParticipant.status)}`} />
                    {hasUnread && (
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate transition-colors ${hasUnread ? 'text-gray-900' : 'text-gray-800'
                        }`}>
                        {otherParticipant.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp || conversation.lastMessage.createdAt) : ''}
                      </span>
                    </div>

                    <p className={`text-sm truncate transition-colors ${hasUnread ? 'text-gray-700 font-medium' : 'text-gray-600'
                      }`}>
                      {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {otherParticipant.role || 'Skill Swapper'}
                      </span>
                      {hasUnread && (
                        <span className="bg-gradient-to-r from-lime-400 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredConversations.length === 0 && !searchQuery && (
            <div className="p-8 text-center text-gray-500">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-700 mb-2">No conversations yet</h3>
              <p className="text-sm mb-3 leading-relaxed">Complete skill swaps to start messaging with other users.</p>
              <p className="text-sm text-gray-400 leading-relaxed">Only users with accepted swap requests can message each other.</p>
            </div>
          )}

          {filteredConversations.length === 0 && searchQuery && (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium">No conversations found</p>
              <p className="text-sm mt-1">Try searching with a different name.</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Chat Area */}
      <div className={`flex-1 flex flex-col ${isMobileView && !selectedConversation ? 'hidden' : ''}`}>
        {selectedConversation ? (
          <>
            {/* Enhanced Chat Header */}
            <div className="p-4 border-b border-gray-200/60 bg-white/90 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isMobileView && (
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                      title="Back to conversations"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}

                  {(() => {
                    const otherParticipant = getOtherParticipant(selectedConversation);
                    if (!otherParticipant) return null;

                    return (
                      <>
                        <div className="relative">
                          <Avatar
                            src={otherParticipant.avatar}
                            name={otherParticipant.name}
                            size={44}
                            className="ring-2 ring-gray-100 shadow-sm"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${getStatusColor(otherParticipant.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-gray-900 text-lg">{otherParticipant.name}</h2>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">{otherParticipant.role || 'Skill Swapper'}</p>
                            {typingUsers.has(otherParticipant.id) && (
                              <div className="flex items-center space-x-1 text-xs text-lime-600">
                                <Circle className="w-2 h-2 animate-pulse" />
                                <span>typing...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    title="Voice call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    title="Video call"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    title="More options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/50 backdrop-blur-sm">
              {messages.map((msg, index) => {
                // Handle both populated and non-populated senderId
                const senderId = msg.senderId?.id || msg.senderId?._id || msg.senderId;
                const isCurrentUser = String(senderId) === String(authUser?.id);
                const senderName = msg.senderId?.name || 'Unknown';

                // Check if this message is from a different sender than the previous one
                const prevMsg = messages[index - 1];
                const prevSenderId = prevMsg ? (prevMsg.senderId?.id || prevMsg.senderId?._id || prevMsg.senderId) : null;
                const isNewSender = !prevMsg || String(senderId) !== String(prevSenderId);

                return (
                  <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                      {/* Show sender avatar and name for new senders (non-current user) */}
                      {!isCurrentUser && isNewSender && (
                        <div className="flex items-center space-x-2 mb-2 ml-1">
                          <Avatar
                            src={msg.senderId?.avatar || ''}
                            name={senderName}
                            size={24}
                          />
                          <span className="text-xs font-medium text-gray-600">{senderName}</span>
                        </div>
                      )}

                      <div className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isCurrentUser
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-tr-md ml-4'
                          : 'bg-white text-gray-900 rounded-tl-md border border-gray-200/60 mr-4'
                        }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>

                        <div className={`flex items-center justify-between mt-2 text-xs ${isCurrentUser ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                          <span>{formatMessageTime(msg.timestamp || msg.createdAt)}</span>

                          {/* Message status indicators for current user */}
                          {isCurrentUser && (
                            <div className="flex items-center space-x-1">
                              {msg.status === 'sending' && (
                                <Circle className="w-3 h-3 animate-pulse text-gray-400" />
                              )}
                              {msg.status === 'sent' && (
                                <CheckCheck className="w-3 h-3 text-gray-400" />
                              )}
                              {msg.status === 'delivered' && (
                                <CheckCheck className="w-3 h-3 text-gray-300" />
                              )}
                              {msg.status === 'read' && (
                                <CheckCheck className="w-3 h-3 text-lime-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-200/60 mr-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <Circle className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <Circle className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <Circle className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-gray-500">typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-gray-500">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Send className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No messages yet</h3>
                    <p className="text-sm text-gray-500">Start the conversation!</p>
                  </div>
                </div>
              )}

              {/* Auto-scroll target */}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Message Input */}
            <div className="p-4 border-t border-gray-200/60 bg-white/90 backdrop-blur-sm">
              <div className="flex items-end space-x-3">
                <button
                  className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <div className="flex items-end bg-gray-50 rounded-2xl border border-gray-200/60 focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20 transition-all duration-200">
                    <textarea
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => {
                        handleTyping(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none max-h-32 min-h-[48px] placeholder-gray-500"
                      rows={1}
                    />
                    <div className="flex items-center space-x-2 pr-3 pb-3">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200"
                        title="Add emoji"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-shrink-0 ${message.trim()
                      ? 'bg-gradient-to-r from-lime-400 to-green-500 text-white hover:from-lime-500 hover:to-green-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-white/30 backdrop-blur-sm">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Select a conversation</h3>
              <p className="text-gray-600 leading-relaxed">Choose a conversation from the sidebar to start messaging with your skill swap partners.</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-lime-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-lime-400 to-green-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Start New Conversation</h2>
                </div>
                <button
                  onClick={() => setShowNewConversation(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close modal"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {users.length > 0 ? (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => createConversation(user.id)}
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-lime-50 hover:to-green-50/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-lime-200/60"
                    >
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size={44}
                        className="ring-2 ring-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">{user.role || 'Skill Swapper'}</p>
                      </div>
                      <div className="text-lime-600">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-700 mb-3">No conversations available</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">You can only message users with whom you have accepted swap requests.</p>
                  <p className="text-gray-400 text-sm">Complete a skill swap to start messaging!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
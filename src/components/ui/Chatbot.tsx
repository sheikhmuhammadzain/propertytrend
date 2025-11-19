import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { apiService } from '../../services/apiServices';
import { useAuth } from '@/context';


interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen: controlledIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm your property market assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();


  const isOpen = controlledIsOpen ?? internalIsOpen;
  const toggleChat = onToggle ?? (() => {
    setInternalIsOpen(!internalIsOpen);
  });


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      const authRequiredMessage: Message = {
        id: Date.now().toString(),
        text: "🔒 You need to be logged in to use the chatbot. Please sign in to your account first.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, authRequiredMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    const messageToSend = inputText; // Store the message before clearing
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      const response = await apiService.chatResponse(messageToSend);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.answer || "I'm sorry, I couldn't process your request at the moment. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat API error:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 text-gray-500">
      <Bot className="h-4 w-4" />
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Chat button clicked!');
            toggleChat();
          }}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-black via-gray-800 to-gray-600 hover:from-gray-900 hover:via-gray-700 hover:to-gray-500 shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-110 border-2 border-white/20 cursor-pointer"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-gray-800 to-gray-600 animate-ping opacity-20 pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`transition-all duration-500 ease-in-out transform ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/10`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-black via-gray-800 to-gray-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold">Property Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat content */}
        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[480px] bg-gradient-to-b from-gray-50/50 to-gray-100/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-end space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-gray-700 to-gray-900' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-800'
                    }`}>
                      {message.isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                    </div>
                    
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-gray-800 to-black text-white rounded-br-sm'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-sm border border-gray-200/20'
                    }`}>
                      <div 
                        className="text-sm whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-gray-300' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200/20">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/60 backdrop-blur-sm border-t border-gray-200/20">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about property markets..."
                  className="flex-1 px-4 py-2 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white rounded-xl px-4 py-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Chatbot; 
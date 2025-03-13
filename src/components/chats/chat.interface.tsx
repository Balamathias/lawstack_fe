"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, UserCircle, Loader2, LucideScale, Sparkles } from 'lucide-react';
import { Message, User } from '@/@types/db';
import { useSendMessage } from '@/services/client/chat';
import MarkdownPreview from '../markdown-preview';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  chatId?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  user?: User
}

const ChatInterface = ({ chatId, initialMessages = [], onSendMessage, user }: Props) => {

  const [messages, setMessages] = useState<Partial<Message>[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: sendMessage, isPending: isLoading } = useSendMessage(chatId!);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Partial<Message> = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    try {
      if (onSendMessage) {
        await onSendMessage(inputValue);
      } else {
        sendMessage({ content: inputValue }, {
            onSuccess: (data) => {
                const { user_message, ai_message } = data?.data || {};
                if (ai_message) {
                    setMessages(prev => [...prev, ai_message]);
                }
                scrollToBottom();
            },
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className="flex flex-col h-full bg-inherit backdrop-blur-sm rounded-xl overflow-hidden relative">
      {/* Chat Header - Glassmorphic */}
      <div className="flex items-center justify-between p-2 sm:p-4 ">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-1.5 rounded-full backdrop-blur-sm">
            <LucideScale size={20} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Legal Assistant</h2>
        </div>
        <button className="p-1.5 hover:bg-secondary/60 rounded-full transition-all">
          <MoreVertical size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Messages Container - Fill Available Space */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-2 sm:p-4 h-full pb-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="bg-primary/5 p-3 rounded-full backdrop-blur-sm mb-3 animate-pulse">
              <LucideScale size={36} className="text-primary/70" />
            </div>
            <p className="font-medium text-center animate-fade-in">Begin your legal consultation</p>
            <span className="text-sm opacity-70 mt-2 animate-fade-in-delay">Your secure AI legal advisor is ready to assist</span>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id}
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${index === 0 ? 'animate-slide-in-up' : 'animate-fade-in'}`}
            >
              {message.sender === 'ai' && (
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="bg-primary/10 p-1 rounded-full backdrop-blur-sm shadow-sm">
                    <LucideScale size={18} className="text-primary" />
                  </div>
                </div>
              )}
              
              <div 
                className={`max-w-[80%] px-4 py-2.5 backdrop-blur-sm ${
                  message.sender === 'user' 
                    ? 'bg-secondary/40 rounded-2xl rounded-tr-sm shadow-sm' 
                    : 'text-card-foreground rounded-2xl border-none'
                }`}
              >
                {message?.sender === 'user' ? <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>: (
                    <MarkdownPreview content={message?.content!} />
                )}
                <span 
                  className={`text-xs mt-1 block text-right ${
                    message.sender === 'user' ? 'opacity-70' : 'text-muted-foreground'
                  }`}
                >
                  {formatTime(message?.created_at!)}
                </span>
              </div>
              
              {message.sender === 'user' && (
                <div className="flex-shrink-0 ml-2 mt-1">
                  {
                    user?.avatar ? (
                        <Avatar>
                            <AvatarImage src={user?.avatar} alt={user?.username!} />
                            <AvatarFallback>{user?.username?.[0].toUpperCase()!}</AvatarFallback>
                        </Avatar>
                    ): (
                        <UserCircle size={22} className="text-primary bg-background rounded-full" />
                    )
                  }
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex mb-4 justify-start animate-fade-in">
            <div className="flex-shrink-0 mr-2 mt-1">
              <div className="bg-primary/10 p-1 rounded-full backdrop-blur-sm animate-pulse">
                <LucideScale size={18} className="text-primary" />
              </div>
            </div>
            <div className="bg-card/90 backdrop-blur-sm text-card-foreground px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border-none border-primary/20">
              <div className="flex items-center space-x-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/70" />
                <span className="text-sm text-muted-foreground">Consulting legal knowledge...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Glassmorphic */}
      <div className="p-3 bg-card/80 backdrop-blur-md border-t border-border/30 shadow-[0_-1px_10px_rgba(0,0,0,0.03)] rounded-xl mt-auto sticky bottom-0">
        <div className="flex items-end space-x-2 bg-background/70 backdrop-blur-sm rounded-xl p-1.5 shadow-inner">
          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-full transition-all">
            <Paperclip size={18} />
          </button>
          
          <div className="flex-1 relative">
            <textarea 
              ref={textareaRef}
              className="w-full py-2 px-3 bg-transparent border-none focus:ring-0 resize-none outline-none text-foreground min-h-[40px] max-h-32"
              placeholder="Type your legal query..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
            />
          </div>
          
          <button 
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
              inputValue.trim() === '' || isLoading
                ? 'bg-secondary/70 text-muted-foreground cursor-not-allowed'
                : 'bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm'
            }`}
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isLoading}
          >
            <Send size={16} className={inputValue.trim() === '' ? '' : 'mr-[1px] mb-[1px]'} />
          </button>
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-muted-foreground/70 flex items-center">
            <Sparkles size={10} className="mr-1 text-primary/50" />
            <span>Powered by advanced legal AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
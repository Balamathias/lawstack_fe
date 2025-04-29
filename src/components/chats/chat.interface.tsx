"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, Paperclip, MoreVertical, UserCircle, Loader2, LucideScale, Sparkles, Check, Clipboard, X, File, Image as ImageIcon, MessageCircle, FileText, BookOpen, ExternalLink, Settings, Shield, Command, Zap, BadgeInfo, RotateCw, ChevronDown, HelpCircle, Share2, RefreshCw, ThumbsUp, ThumbsDown, Copy, Trash2, Plus } from 'lucide-react';
import { Message, MessageAttachment, User } from '@/@types/db';
import { useSendMessage } from '@/services/client/chat';
import MarkdownPreview from '../markdown-preview';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ChatHistory from './chat-history';
import Link from 'next/link';
import { Button } from '../ui/button';
import ScrollToBottomButton from '../ui/scroll-to-bottom-button';
import { AIModels, convertMarkdownToPlainText } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import Logo from '../logo';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const LOCALSTORAGE_MODEL_KEY = 'lawstack-selected-ai-model';

interface Props {
  chatId?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  user?: User;
  chat?: any; // Assuming chat is passed as a prop
  handleTitleChange?: (title: string) => void; // Assuming handleTitleChange is passed as a prop
}

// Interface for uploaded file structure
interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  url?: string;
  type: string;
  name: string;
  size: number;
}

// Available AI models
const AI_MODELS = [
  {
    id: AIModels.default,
    name: 'Standard',
    description: 'Balanced model for most legal questions',
    icon: <Command className="h-4 w-4" />,
    isDefault: false,
  },
    {
    id: AIModels.getModel('advanced'),
    name: 'Advanced',
    description: 'Enhanced reasoning and legal analysis capabilities',
    icon: <Sparkles className="h-4 w-4 text-amber-500" />,
    isDefault: false,
    isPremium: true,
  },
  {
    id: AIModels.getModel('expert'),
    name: 'Expert',
    description: 'Highest accuracy for complex legal questions',
    icon: <Shield className="h-4 w-4 text-indigo-500" />,
    isPremium: true,
  }
];

const ChatInterface = ({ chatId, initialMessages = [], onSendMessage, user, chat, handleTitleChange }: Props) => {
  const [messages, setMessages] = useState<Partial<Message>[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[1]);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isRetrying, setIsRetrying] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [messageToShare, setMessageToShare] = useState<Partial<Message> | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isGeneratingShareUrl, setIsGeneratingShareUrl] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const { mutate: sendMessage, isPending: isLoading } = useSendMessage(chatId!);

  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [historicalMessages] = useState<Set<string>>(
    new Set(initialMessages.map((m) => m.id?.toString() || ''))
  );

  useEffect(() => {
    router.refresh();
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
      if (messages.length > 0) {
        setShouldAutoScroll(false);
      }
    }
  }, [messages, shouldAutoScroll]);

  const lastScrollTop = useRef(0);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          const scrollingUp = scrollTop < lastScrollTop.current;
          lastScrollTop.current = scrollTop;
          if (isNearBottom && !scrollingUp && !shouldAutoScroll) {
            setShouldAutoScroll(true);
          } else if ((!isNearBottom && shouldAutoScroll) || scrollingUp) {
            setShouldAutoScroll(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [shouldAutoScroll]);

  useEffect(() => {
    if (chat?.chat_type && chat?.id) {
      let contextualTitle = '';

      if (chat.chat_type === 'past_question' && chat.past_question) {
        contextualTitle = `Question Discussion: ${chat.course_name || 'Course'} (${chat.past_question_year || 'Unknown Year'})`;
      } else if (chat.chat_type === 'course_specific' && chat.course) {
        contextualTitle = `Course Assistant: ${chat.course_name || 'Course'}`;
      }

      if (contextualTitle && (!chat.title || chat.title.startsWith('New Chat'))) {
        handleTitleChange?.(contextualTitle);
      }
    }
  }, [chat]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedModelId = localStorage.getItem(LOCALSTORAGE_MODEL_KEY);
        if (savedModelId) {
          const savedModel = AI_MODELS.find(model => model.id === savedModelId);
          if (savedModel) {
            setSelectedModel(savedModel);
          }
        }
      } catch (error) {
        console.error('Error loading AI model from localStorage:', error);
      }
    }
  }, []);

  const updateSelectedModel = (model: typeof selectedModel) => {
    setSelectedModel(model);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCALSTORAGE_MODEL_KEY, model.id);
      } catch (error) {
        console.error('Error saving AI model to localStorage:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Partial<Message> = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShouldAutoScroll(true);

    try {
      if (onSendMessage) {
        await onSendMessage(inputValue);
      } else {
        sendMessage(
          { content: inputValue, model: selectedModel.id },
          {
            onSuccess: (data) => {
              const { user_message, ai_message } = data?.data || {};
              if (ai_message) {
                const messageId = ai_message.id || Date.now().toString();
                setStreamingMessageId(messageId);

                setMessages((prev) => [
                  ...prev,
                  {
                    ...ai_message,
                    id: messageId,
                  },
                ]);

                const streamDuration = Math.min(ai_message.content.length * 30, 5000);
                setTimeout(() => {
                  setStreamingMessageId(null);
                }, streamDuration);
              }
            },
          }
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to upload file to Supabase storage
  const uploadFileToSupabase = async (file: File): Promise<UploadedFile> => {
    const fileId = uuidv4();
    const fileName = file.name;
    const fileType = file.type;
    const filePath = `${user?.id || 'anonymous'}/${chatId || 'temp'}/${fileId}-${fileName}`;
    
    // Create an uploadedFile object with initial state
    const uploadedFile: UploadedFile = {
      id: fileId,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading',
      type: fileType,
      name: fileName,
      size: file.size
    };
    
    try {
      // Upload file to Supabase storage bucket 'userdata'
      const { data, error } = await supabase.storage
        .from('userdata')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
      
      // Get public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('userdata')
        .getPublicUrl(filePath);
      
      // Update the uploadedFile with the URL and status
      return {
        ...uploadedFile,
        url: publicUrl,
        status: 'complete',
        progress: 100
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        ...uploadedFile,
        status: 'error',
        progress: 0
      };
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create temporary file objects with preview URLs
    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: uuidv4(),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading',
      type: file.type,
      name: file.name,
      size: file.size
    }));
    
    // Add the new files to the state
    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    
    // Show file dialog
    setFileDialogOpen(true);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    return toast.info('File uploads are not currently supported.')
    
    // Upload files in parallel
    const uploadPromises = newUploadedFiles.map(async (fileObj) => {
      const uploadedFile = await uploadFileToSupabase(fileObj.file);
      
      // Update the state with the uploaded file information
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileObj.id ? uploadedFile : f)
      );
      
      return uploadedFile;
    });
    
    try {
      await Promise.all(uploadPromises);
      toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Some files failed to upload. Please try again.');
    }
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Modify handleSendWithFiles to automatically clear the files after sending
  const handleSendWithFiles = async () => {
    if (uploadedFiles.length === 0 && inputValue.trim() === '') return;
    
    const failedUploads = uploadedFiles.filter(file => file.status === 'error');
    if (failedUploads.length > 0) {
      toast.error('Please remove failed uploads before sending');
      return;
    }
    
    const pendingUploads = uploadedFiles.filter(file => file.status === 'uploading');
    if (pendingUploads.length > 0) {
      toast.info('Please wait for all uploads to complete');
      return;
    }
    
    // Create file URLs array for the backend
    const fileUrls = uploadedFiles.map(file => file.url).filter(Boolean) as string[];
    
    const userMessage: Partial<Omit<Message, 'attachments'> & { attachments?: Partial<MessageAttachment>[]}> = {
      id: Date . now().toString(),
      content: inputValue,
      sender: 'user',
      created_at: new Date().toISOString(),
      attachments: uploadedFiles.map(file => ({
        url: file.url,
        filename: file.name,
        file_type: file.type,
        size: file.size
      }))
    };

    setMessages((prev: any) => [...prev, userMessage]);
    setInputValue('');
    setShouldAutoScroll(true);
    
    try {
      sendMessage(
        { 
          content: inputValue.trim(), 
          model: selectedModel.id,
          file_urls: fileUrls
        },
        {
          onSuccess: (data) => {
            const { user_message, ai_message } = data?.data || {};

            if (user_message) {
              setMessages(prev =>
                prev.map(msg => (msg.id === userMessage.id ? user_message : msg))
              );
            }

            if (ai_message) {
              const messageId = ai_message.id || Date.now().toString();
              setStreamingMessageId(messageId);

              setMessages(prev => [
                ...prev,
                {
                  ...ai_message,
                  id: messageId,
                },
              ]);

              const streamDuration = Math.min(ai_message.content.length * 30, 5000);
              setTimeout(() => {
                setStreamingMessageId(null);
              }, streamDuration);
            }

            // Clear uploaded files after successful send
            clearUploadedFiles();
          },
          onError: () => {
            toast.error('Failed to send message. Please try again.');
          },
        }
      );
    } catch (error) {
      console.error('Error sending message with files:', error);
      toast.error('Error sending message with files');
    }
  };

  // Add a function to clear uploaded files
  const clearUploadedFiles = () => {
    uploadedFiles.forEach(file => {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    });
    setUploadedFiles([]);
    setFileDialogOpen(false);
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    let raf: number;
    const resize = () => {
      textareaRef.current!.style.height = 'auto';
      textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight}px`;
    };
    raf = requestAnimationFrame(resize);
    return () => cancelAnimationFrame(raf);
  }, [inputValue]);

  const messageGroups = useMemo(() => {
    const groups: Record<string, Partial<Message>[]> = {};
    messages.forEach((message) => {
      if (!message.created_at) return;
      try {
        const messageDate = new Date(message.created_at);
        if (isNaN(messageDate.getTime())) return;
        const dateKey = messageDate.toLocaleDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(message);
      } catch (e) {
        console.error('Date parsing error:', e);
      }
    });
    return groups;
  }, [messages]);

  const suggestedFollowUpsMemo = useMemo(() => {
    const lastAiMessage = messages.findLast((m) => m.sender === 'ai');
    if (!lastAiMessage || streamingMessageId) return [];
    const generateSuggestions = (content: string) => {
      if (content.includes('legal precedent') || content.includes('case law')) {
        return ['Can you cite specific cases?', 'How does this apply to my situation?'];
      } else if (content.includes('statute') || content.includes('regulation')) {
        return ['What are the exceptions to this rule?', 'How is this enforced?'];
      } else if (content.includes('rights') || content.includes('entitled')) {
        return ['What documentation do I need?', "What's the timeline for this process?"];
      } else {
        return ['Can you explain that in simpler terms?', 'What should be my next steps?'];
      }
    };
    return generateSuggestions(lastAiMessage.content || '');
  }, [messages, streamingMessageId]);

  const handleCopy = (id: string, content: string) => {
    const plainText = convertMarkdownToPlainText(content);
    navigator.clipboard.writeText(plainText);
    
    setCopyState({ ...copyState, [id]: true });
    toast.success("Content copied to clipboard");

    setTimeout(() => {
      setCopyState({ ...copyState, [id]: false });
    }, 2000);
  };

  const handleRetry = (precedingUserMessageId: string | undefined) => {
    if (isRetrying || isLoading) return;

    setIsRetrying(true);

    const messageIndex = messages.findIndex(m => m.id === precedingUserMessageId);
    if (messageIndex !== -1) {
      const userMessage = messages[messageIndex];

      if (userMessage.content) {
        sendMessage(
          { content: userMessage.content, model: selectedModel.id },
          {
            onSuccess: (data) => {
              const { ai_message } = data?.data || {};
              if (ai_message) {
                const messageId = ai_message.id || Date.now().toString();
                setStreamingMessageId(messageId);

                const aiResponseIndex = messageIndex + 1;
                const newMessages = [...messages];

                if (aiResponseIndex < newMessages.length && newMessages[aiResponseIndex].sender === 'ai') {
                  newMessages[aiResponseIndex] = {
                    ...ai_message,
                    id: messageId,
                  };
                } else {
                  newMessages.push({
                    ...ai_message,
                    id: messageId,
                  });
                }

                setMessages(newMessages);

                const streamDuration = Math.min(ai_message.content.length * 30, 5000);
                setTimeout(() => {
                  setStreamingMessageId(null);
                  setIsRetrying(false);
                }, streamDuration);
              } else {
                setIsRetrying(false);
              }
            },
            onError: () => {
              setIsRetrying(false);
              toast.error("Failed to regenerate response");
            }
          }
        );
      } else {
        setIsRetrying(false);
      }
    } else {
      setIsRetrying(false);
    }
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    if (feedbackState[messageId] === type) {
      setFeedbackState({...feedbackState, [messageId]: null});
      toast.success("Feedback removed");
    } else {
      setFeedbackState({...feedbackState, [messageId]: type});

      if (type === 'up') {
        toast.success("Thanks for your positive feedback!");
      } else {
        toast.success("Thanks for your feedback. We'll work to improve.");
      }
    }
  };

  const handleShare = (message: Partial<Message>) => {
    setMessageToShare(message);
    setIsGeneratingShareUrl(true);

    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 10);
      setShareUrl(`${process.env.NEXT_PUBLIC_APP_URL}/shared/${message.id}`);
      setIsGeneratingShareUrl(false);
      setShareDialogOpen(true);
    }, 800);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard");
  };

  const findPrecedingUserMessageId = (currentIndex: number): string | undefined => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        return messages[i].id as string;
      }
    }
    return undefined;
  };

  const AnimatedMessage = useCallback(({ message, index }: { message: Partial<Message>; index: number }) => {
    const isStreaming = streamingMessageId === message.id && message.sender === 'ai';
    const isHistorical = message.id ? historicalMessages.has(message.id.toString()) : false;
    const precedingUserMessageId = message.sender === 'ai' ? findPrecedingUserMessageId(index) : undefined;

    return (
      <div
        className={`max-w-[90%] px-4 mt-2 backdrop-blur-sm ${
          message.sender === 'user'
            ? 'dark:bg-secondary/40 bg-primary/95 dark:text-foreground text-white rounded-2xl rounded-tr-sm shadow-sm py-2'
            : 'text-card-foreground rounded-2xl border-none'
        } ${isStreaming ? 'relative overflow-hidden' : ''}`}
      >
        {message?.sender === 'user' ? (
          <>
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            {message.attachments && renderAttachments(message.attachments)}
          </>
        ) : (
          <div className={isStreaming ? 'animate-fade-in-text' : ''}>
            <div>
              <MarkdownPreview className='text-base' content={message?.content!} />
            </div>
            {isStreaming && (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">
            {message?.created_at ? formatTime(message.created_at) : ''}
          </span>

          {message.sender === 'ai' && !isStreaming && (
            <div className="flex items-center opacity-100 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary/50 transition-all"
                      onClick={() => handleCopy(message.id as string, message.content as string)}
                    >
                      {copyState[message.id as string] ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {copyState[message.id as string] ? "Copied!" : "Copy response"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary/50 transition-all ${isRetrying ? 'animate-spin text-primary' : ''}`}
                      onClick={() => handleRetry(precedingUserMessageId)}
                      disabled={isRetrying || isLoading}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Regenerate response
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary/50 transition-all"
                      onClick={() => handleShare(message)}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Share response
                  </TooltipContent>
                </Tooltip>

                <div className="mx-0.5 border-r border-border h-4"></div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "text-muted-foreground p-1.5 rounded-md hover:bg-secondary/50 transition-all",
                        feedbackState[message.id as string] === 'up' && "text-green-500"
                      )}
                      onClick={() => handleFeedback(message.id as string, 'up')}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {feedbackState[message.id as string] === 'up' ? "Helpful - Click to undo" : "Mark as helpful"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "text-muted-foreground p-1.5 rounded-md hover:bg-secondary/50 transition-all",
                        feedbackState[message.id as string] === 'down' && "text-amber-500"
                      )}
                      onClick={() => handleFeedback(message.id as string, 'down')}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {feedbackState[message.id as string] === 'down' ? "Not helpful - Click to undo" : "Mark as not helpful"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    );
  }, [
    streamingMessageId,
    historicalMessages,
    copyState,
    feedbackState,
    isRetrying,
    isLoading,
    selectedModel,
  ]);

  // Modified renderAttachments to handle our new attachment format
  const renderAttachments = (attachments: any[]) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => {
          const isImage = attachment.file_type?.startsWith('image/');

          return (
            <div key={index} className="flex items-center gap-2 p-2 rounded-md border border-border/40 backdrop-blur-sm">
              {isImage ? (
                <div className="relative">
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={attachment.url}
                      alt={attachment.filename || 'Image'}
                      width={200}
                      height={120}
                      className="rounded-xl object-cover max-h-44"
                      style={{ objectFit: 'contain' }}
                    />
                  </a>
                </div>
              ) : (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <File className="h-5 w-5" />
                  <span className="text-sm truncate max-w-[200px]">{attachment.filename || 'File'}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const formatDateHeader = (dateString: string) => {
    try {
      const messageDate = new Date(dateString);

      if (isNaN(messageDate.getTime())) {
        return 'Recent Messages';
      }

      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return messageDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Messages';
    }
  };

  return (
    <div className="flex flex-col h-full bg-inherit backdrop-blur-sm rounded-xl overflow-hidden relative">
      <div className="flex items-center justify-between p-2 sm:p-4 bg-background/70 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-2">
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-3 gap-2.5 border border-border/40 hover:bg-accent/70 rounded-xl backdrop-blur-sm transition-all"
          title="Select AI model"
              >
          <div className="relative flex items-center justify-center w-5 h-5">
            {selectedModel.isPremium && (
              <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary/90 to-violet-500/90 ring-2 ring-background animate-pulse-slow" />
            )}
            {selectedModel.icon || <Settings className="h-4 w-4 text-primary/80" />}
          </div>
          
          <span className={cn(
            "font-medium text-xs md:text-sm tracking-tight",
            selectedModel.isPremium 
              ? "text-transparent bg-clip-text bg-gradient-to-r from-primary/90 to-violet-600 font-semibold" 
              : "text-foreground/90"
          )}>
            {selectedModel.name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70 ml-0.5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card/95 backdrop-blur-md border border-border/50 shadow-lg rounded-xl" align="end">
              <div className="px-4 pt-3.5 pb-2.5 border-b border-border/30">
          <h4 className="font-medium text-sm flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Select AI Model
          </h4>
          <p className="text-xs text-muted-foreground mt-1.5">
            Choose the model that best fits your legal research needs
          </p>
              </div>
              
              <div className="px-1.5 py-2.5 max-h-[280px] overflow-y-auto">
          {AI_MODELS.map((model) => (
            <div
              key={model.id}
              className={cn(
                "flex items-start gap-3 px-3.5 py-3 rounded-lg m-1 cursor-pointer hover:bg-secondary/70 transition-all relative group",
                selectedModel.id === model.id ? "bg-secondary/80 shadow-sm" : "bg-transparent"
              )}
              onClick={() => updateSelectedModel(model)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${model.name} model`}
            >
              <div className="relative mt-0.5">
                {model.isPremium && (
            <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-violet-500 ring-1 ring-background" />
                )}
                <div className={cn(
            "p-1.5 rounded-md transition-colors",
            selectedModel.id === model.id ? "bg-primary/15" : "bg-secondary/50 group-hover:bg-primary/10"
                )}>
            {model.icon || <Command className="h-4 w-4" />}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
            <div className={cn(
              "font-medium text-sm",
              model.isPremium && "text-transparent bg-clip-text bg-gradient-to-r from-primary/90 to-violet-500"
            )}>
              {model.name}
              {model.isPremium && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary">PRO</span>
              )}
            </div>
            
            {selectedModel.id === model.id && (
              <Check className="h-3.5 w-3.5 text-primary animate-in fade-in" />
            )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
            {model.description}
                </p>
              </div>
            </div>
          ))}

              </div>
              
              <div className="border-t border-border/30 px-4 py-2.5 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BadgeInfo className="h-3 w-3" />
              <span>Models updated with latest legal knowledge</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs gap-1 hover:bg-secondary/70"
              title="Reset to default model"
              onClick={() => updateSelectedModel(AI_MODELS[1])}
            >
              <RotateCw className="h-3 w-3" />
              Reset
            </Button>
          </div>
              </div>
            </PopoverContent>
          </Popover>
          <ChatHistory
            user={user!}
            currentChatId={chatId}
            trigger={
              <button 
          className="p-1.5 hover:bg-secondary/70 rounded-full transition-all cursor-pointer backdrop-blur-sm"
          title="View chat history"
          aria-label="View chat history"
              >
          <MessageCircle size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            }
          />
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto scrollbar-hidden p-2 sm:p-4 h-full pb-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="bg-primary/5 p-1.5 sm:p-3 rounded-full backdrop-blur-sm mb-3 animate-pulse">
              <LucideScale size={36} className="text-primary/70" />
            </div>
            <p className="font-medium text-center animate-fade-in">Begin your legal consultation</p>
            <span className="text-sm opacity-70 mt-2 animate-fade-in-delay">
              Your secure AI legal advisor is ready to assist
            </span>

            {!user && (
              <Link href="/login" passHref>
                <Button className="flex items-center mt-4 " variant={'secondary'}>
                  <span className="text-sm font-medium">Sign in to chat with LawStack AI</span>
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([date, groupMessages]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-[1px] flex-grow bg-border"></div>
                  <span className="px-3 text-xs text-muted-foreground font-medium">
                    {formatDateHeader(date)}
                  </span>
                  <div className="h-[1px] flex-grow bg-border"></div>
                </div>

                {groupMessages.map((message, index) => {
                  const globalIndex = messages.findIndex(m => m.id === message.id);

                  return (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      } ${
                        index === groupMessages.length - 1 && message.sender === 'ai'
                          ? 'animate-slide-in-up'
                          : index === 0
                          ? 'animate-slide-in-up'
                          : 'animate-fade-in'
                      } group`}
                    >
                      {message.sender === 'ai' && (
                        <div className="flex-shrink-0 mr-2 mt-2">
                          <div className="bg-primary/10 p-1 rounded-full backdrop-blur-sm shadow-sm">
                            <LucideScale size={18} className="text-primary" />
                          </div>
                        </div>
                      )}

                      <AnimatedMessage message={message} index={globalIndex} />

                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 ml-2 mt-2">
                          {user?.avatar ? (
                            <Avatar>
                              <AvatarImage src={user?.avatar} alt={user?.username!} />
                              <AvatarFallback>{user?.username?.[0].toUpperCase()!}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <UserCircle size={22} className="text-primary bg-background rounded-full" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {suggestedFollowUpsMemo.length > 0 &&
              !isLoading &&
              messages[messages.length - 1]?.sender === 'ai' && (
                <div className="pl-10 mb-6 animate-fade-in hidden">
                  <div className="text-xs text-muted-foreground mb-2">Suggested follow-ups:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedFollowUpsMemo.map((suggestion, i) => (
                      <button
                        key={i}
                        className="text-sm bg-secondary/40 hover:bg-secondary/60 px-3 py-1.5 rounded-full transition-colors"
                        onClick={() => {
                          setInputValue(suggestion);
                          setTimeout(() => {
                            if (textareaRef.current) {
                              textareaRef.current.focus();
                            }
                          }, 50);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}

        {isLoading && (
          <div className="flex mb-4 justify-start animate-fade-in">
            <div className="flex-shrink-0 mr-2 mt-1">
              <div className="bg-primary/10 p-1 rounded-full backdrop-blur-sm animate-pulse">
                <LucideScale size={18} className="text-primary" />
              </div>
            </div>
            <div className="bg-card/90 backdrop-blur-sm text-card-foreground px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border-none border-primary/20">
              <div className="flex items-center gap-2">
                <div className="typing-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span className="text-sm text-muted-foreground">Consulting Smart Assistant...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ScrollToBottomButton
        containerRef={messagesContainerRef as any}
        className="right-6 bottom-24"
        onClick={() => {
          scrollToBottom();
          setShouldAutoScroll(true);
        }}
      />

      {/* Improved chat input area with integrated file upload UI */}
      <div className="p-3 bg-card/70 backdrop-blur-md border border-border/50 shadow-[0_-1px_10px_rgba(0,0,0,0.03)] rounded-xl mt-auto sticky bottom-0">
        {/* File preview area - only shown when files are selected */}
        {uploadedFiles.length > 0 && (
          <div className="mb-2 py-1.5 px-2 rounded-lg bg-background/50 border border-border/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium flex items-center">
                <Paperclip className="h-3 w-3 mr-1 text-primary/70" />
                <span className="text-primary/90">Files ({uploadedFiles.length})</span>
              </h4>
              <button
                onClick={clearUploadedFiles}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-[96px] overflow-y-auto pb-1 scrollbar-thin">
              {uploadedFiles.map((file) => {
                const isImage = file.type.startsWith('image/');
                
                return (
                  <div 
                    key={file.id}
                    className={cn(
                      "relative group rounded-md border overflow-hidden",
                      "bg-card/80 shadow-sm transition-all flex-shrink-0",
                      file.status === 'error' ? "border-red-300/50" : "border-border/50"
                    )}
                    style={{ width: isImage ? '48px' : '120px', height: isImage ? '48px' : '32px' }}
                  >
                    {isImage ? (
                      <div className="h-full w-full relative">
                        <Image
                          src={file.previewUrl}
                          alt={file.name}
                          fill
                          className="object-cover"
                        />
                        
                        {file.status === 'uploading' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center px-2 py-1">
                        <File className="h-3 w-3 text-primary/70 flex-shrink-0 mr-1.5" />
                        <span className="text-xs truncate max-w-[75px]">{file.name}</span>
                        
                        {file.status === 'uploading' && (
                          <div className="ml-auto">
                            <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Status indicators */}
                    {file.status === 'complete' && (
                      <div className="absolute top-0.5 right-0.5 bg-green-500 rounded-full w-3 h-3 flex items-center justify-center">
                        <Check className="h-2 w-2 text-white" />
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <div className="absolute top-0.5 right-0.5 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center">
                        <X className="h-2 w-2 text-white" />
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadedFile(file.id);
                      }}
                      className={cn(
                        "absolute inset-0 bg-background/60 flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-opacity"
                      )}
                      disabled={file.status === 'uploading'}
                    >
                      <div className="bg-background/80 rounded-full p-1">
                        <X className="h-2.5 w-2.5 text-foreground" />
                      </div>
                    </button>
                  </div>
                );
              })}
              
              {/* Add more files button - more compact */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-dashed border-border hover:border-primary/50 bg-background/50 transition-colors flex-shrink-0"
              >
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end space-x-2 backdrop-blur-sm rounded-xl p-1.5 shadow-inner bg-transparent">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-full transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Attach files
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              className="w-full py-2 px-3 bg-transparent border-none focus:ring-0 resize-none outline-none text-foreground min-h-[40px] max-h-32"
              placeholder={uploadedFiles.length > 0 ? 'Add a message (optional)...' : 'Type your legal query...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                const isMobile = typeof window !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
                if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
                  e.preventDefault();
                  if (uploadedFiles.length > 0) {
                    handleSendWithFiles();
                  } else {
                    handleSendMessage();
                  }
                }
              }}
              rows={1}
            />
          </div>

          <button
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
              (inputValue.trim() === '' && uploadedFiles.length === 0) || isLoading
                ? 'bg-secondary/70 text-muted-foreground cursor-not-allowed'
                : 'bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm'
            }`}
            onClick={uploadedFiles.length > 0 ? handleSendWithFiles : handleSendMessage}
            disabled={(inputValue.trim() === '' && uploadedFiles.length === 0) || isLoading}
            title="Send message"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} className={inputValue.trim() === '' ? '' : 'mr-[1px] mb-[1px]'} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-muted-foreground/70 flex items-center">
            <HelpCircle size={10} className="mr-1 text-primary/50" />
            <span className='truncate'>AI can make mistakes, please verify important information.</span>
          </div>
        </div>
      </div>

      {/* Keep share dialog and remove file dialog since we've moved the UI */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share Response</DialogTitle>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this AI response with others via a link. The link will provide access to this response only.
            </p>
            
            {isGeneratingShareUrl ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground mt-4">Generating shareable link...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={shareUrl} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button size="sm" onClick={copyShareUrl}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setShareDialogOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      window.open(shareUrl, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
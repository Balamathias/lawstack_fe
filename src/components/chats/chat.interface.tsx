"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, UserCircle, Loader2, LucideScale, Sparkles, Check, Clipboard, X, File, Image as ImageIcon } from 'lucide-react';
import { Message, User } from '@/@types/db';
import { useSendMessage } from '@/services/client/chat';
import MarkdownPreview from '../markdown-preview';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ChatHistory from './chat-history';
import Link from 'next/link';
import { Button } from '../ui/button';
import ScrollToBottomButton from '../ui/scroll-to-bottom-button';
import { convertMarkdownToPlainText } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import Logo from '../logo';

interface Props {
  chatId?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  user?: User;
}

const ChatInterface = ({ chatId, initialMessages = [], onSendMessage, user }: Props) => {
  const [messages, setMessages] = useState<Partial<Message>[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messageGroups, setMessageGroups] = useState<Record<string, Partial<Message>[]>>({});
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      const scrollingUp = scrollTop < lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      if (isNearBottom && !scrollingUp && !shouldAutoScroll) {
        setShouldAutoScroll(true);
      } else if (!isNearBottom && shouldAutoScroll || scrollingUp) {
        setShouldAutoScroll(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [shouldAutoScroll]);

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
          { content: inputValue },
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setFileDialogOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendWithFiles = async () => {
    if (selectedFiles.length === 0 && inputValue.trim() === '') return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('content', inputValue.trim());

    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    const userMessage: Partial<Message> = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      created_at: new Date().toISOString(),
      // attachments: selectedFiles.map((file) => ({
      //   filename: file.name,
      //   file_type: file.type,
      //   size: file.size,
      //   url: URL.createObjectURL(file),
      // })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShouldAutoScroll(true);
    setFileDialogOpen(false);

    try {
      sendMessage(
        {
          formData,
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        },
        {
          onSuccess: (data) => {
            const { user_message, ai_message } = data?.data || {};

            if (user_message) {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === userMessage.id ? user_message : msg))
              );
            }

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

            setSelectedFiles([]);
            setUploadProgress(0);
            setIsUploading(false);
          },
          onError: () => {
            setUploadProgress(0);
            setIsUploading(false);
            toast.error('Failed to upload files. Please try again.');
          },
        }
      );
    } catch (error) {
      console.error('Error sending message with files:', error);
      setIsUploading(false);
      toast.error('Error sending message with files');
    }
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    const groups: Record<string, Partial<Message>[]> = {};

    messages.forEach((message) => {
      if (!message.created_at) return;

      try {
        const messageDate = new Date(message.created_at);

        if (isNaN(messageDate.getTime())) return;

        const dateKey = messageDate.toLocaleDateString();
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } catch (e) {
        console.error('Date parsing error:', e);
      }
    });

    setMessageGroups(groups);
  }, [messages]);

  useEffect(() => {
    const lastAiMessage = messages.findLast((m) => m.sender === 'ai');
    if (!lastAiMessage || streamingMessageId) return;

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

    setSuggestedFollowUps(generateSuggestions(lastAiMessage.content || ''));
  }, [messages, streamingMessageId]);

  const handleCopy = (id: string, content: string) => {
    const plainText = convertMarkdownToPlainText(content);
    navigator.clipboard.writeText(plainText);

    setCopyState({ ...copyState, [id]: true });

    setTimeout(() => {
      setCopyState({ ...copyState, [id]: false });
    }, 2000);
  };

  const toggleExpand = (id: string) => {
    setIsExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  const renderAttachments = (attachments: any[]) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => {
          const isImage = attachment.file_type?.startsWith('image/');

          return (
            <div key={index} className="flex items-center gap-2 bg-background/50 p-2 rounded-md border">
              {isImage ? (
                <div className="relative">
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={attachment.url}
                      alt={attachment.filename}
                      width={200}
                      height={120}
                      className="rounded-md object-cover max-h-40"
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
                  <span className="text-sm truncate max-w-[200px]">{attachment.filename}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const AnimatedMessage = ({ message }: { message: Partial<Message> }) => {
    const isStreaming = streamingMessageId === message.id && message.sender === 'ai';
    const isHistorical = message.id ? historicalMessages.has(message.id.toString()) : false;

    return (
      <div
        className={`max-w-[90%] px-4 py-2.5 backdrop-blur-sm ${
          message.sender === 'user'
            ? 'bg-secondary/40 rounded-2xl rounded-tr-sm shadow-sm'
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
            <div
              // className={
              //   isHistorical && isExpanded[message.id as string]
              //     ? ''
              //     : isHistorical && message.content && message.content.length > 500
              //     ? 'max-h-[300px] overflow-hidden relative'
              //     : ''
              // }
            >
              <MarkdownPreview content={message?.content!} />

              {/* {isHistorical &&
                !isExpanded[message.id as string] &&
                message.content &&
                message.content.length > 500 && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
                )} */}
            </div>

            {/* {isHistorical && message.content && message.content.length > 500 && (
              <button
                onClick={() => toggleExpand(message.id as string)}
                className="text-xs text-primary mt-1 hover:text-emerald-500 transition-all cursor-pointer"
              >
                {isExpanded[message.id as string] ? 'Show less' : 'Read more'}
              </button>
            )} */}

            {isStreaming && (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">
            {message?.created_at ? formatTime(message.created_at) : ''}
          </span>

          {message.sender === 'ai' && (
            <div className="opacity-75 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                className="text-xs text-muted-foreground hover:text-foreground p-1 rounded-sm cursor-pointer"
                onClick={() => handleCopy(message.id as string, message.content as string)}
              >
                {copyState[message.id as string] ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Clipboard className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-inherit backdrop-blur-sm rounded-xl overflow-hidden relative">
      <div className="flex items-center justify-between p-2 sm:p-4 ">
        <div className="flex items-center space-x-2">
          <Logo />
          <h2 className="text-xl font-muted-foreground">AI</h2>
        </div>
        <ChatHistory
          user={user!}
          currentChatId={chatId}
          trigger={
            <button className="p-1.5 hover:bg-secondary/60 rounded-full transition-all cursor-pointer">
              <MoreVertical size={18} className="text-muted-foreground" />
            </button>
          }
        />
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

                {groupMessages.map((message, index) => (
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
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex-shrink-0 mr-2 mt-1">
                        <div className="bg-primary/10 p-1 rounded-full backdrop-blur-sm shadow-sm">
                          <LucideScale size={18} className="text-primary" />
                        </div>
                      </div>
                    )}

                    <AnimatedMessage message={message} />

                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 ml-2 mt-1">
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
                ))}
              </div>
            ))}

            {suggestedFollowUps.length > 0 &&
              !isLoading &&
              messages[messages.length - 1]?.sender === 'ai' && (
                <div className="pl-10 mb-6 animate-fade-in hidden">
                  <div className="text-xs text-muted-foreground mb-2">Suggested follow-ups:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedFollowUps.map((suggestion, i) => (
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
                <span className="text-sm text-muted-foreground">Consulting LawStack base...</span>
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

      <div className="p-3 bg-card/80 backdrop-blur-md border border-border/50 shadow-[0_-1px_10px_rgba(0,0,0,0.03)] rounded-xl mt-auto sticky bottom-0">
        <div className="flex items-end space-x-2 bg-background/70 backdrop-blur-sm rounded-xl p-1.5 shadow-inner">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <button
            className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-full transition-all"
            title="Attach file"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              className="w-full py-2 px-3 bg-transparent border-none focus:ring-0 resize-none outline-none text-foreground min-h-[40px] max-h-32"
              placeholder={selectedFiles.length > 0 ? 'Add a message (optional)...' : 'Type your legal query...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (selectedFiles.length > 0) {
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
              (inputValue.trim() === '' && selectedFiles.length === 0) || isLoading || isUploading
                ? 'bg-secondary/70 text-muted-foreground cursor-not-allowed'
                : 'bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm'
            }`}
            onClick={selectedFiles.length > 0 ? handleSendWithFiles : handleSendMessage}
            disabled={(inputValue.trim() === '' && selectedFiles.length === 0) || isLoading || isUploading}
            title="Send message"
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} className={inputValue.trim() === '' ? '' : 'mr-[1px] mb-[1px]'} />
            )}
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex items-center justify-between mt-2 px-2">
            <button
              className="text-xs text-primary flex items-center hover:underline"
              onClick={() => setFileDialogOpen(true)}
            >
              <Paperclip size={12} className="mr-1" />
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </button>

            <button
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setSelectedFiles([])}
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-muted-foreground/70 flex items-center">
            <Sparkles size={10} className="mr-1 text-primary/50" />
            <span>Powered by advanced LawStack AI</span>
          </div>
        </div>
      </div>

      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Selected Files</DialogTitle>

          <div className="max-h-[300px] overflow-y-auto py-2">
            {selectedFiles.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

              return (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-3">
                    {isImage ? (
                      <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden relative bg-muted">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <File className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{fileSizeMB} MB</p>
                    </div>
                  </div>

                  <button
                    className="p-1 rounded-full hover:bg-secondary"
                    onClick={() => removeFile(index)}
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Add More
            </Button>
            <Button onClick={handleSendWithFiles} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>Send</>
              )}
            </Button>
          </div>

          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs text-center mt-1 text-muted-foreground">{uploadProgress}% Uploaded</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
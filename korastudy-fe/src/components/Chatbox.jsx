import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from 'lucide-react';
import { chatService } from '../api/chatService';
import ReactMarkdown from 'react-markdown';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { text: "Tôi muốn học từ vựng TOEIC", icon: "📚" },
    { text: "Hỗ trợ kỹ thuật", icon: "🔧" },
    { text: "Tôi cần giúp đỡ về tài khoản", icon: "👤" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleQuickAction = (text) => {
    setInputMessage(text);
    setShowWelcome(false);
    handleSendMessage(null, text);
  };

  const handleSendMessage = async (e, quickText = null) => {
    if (e) e.preventDefault();
    const messageText = quickText || inputMessage;
    if (!messageText.trim()) return;

    setShowWelcome(false);

    const userMsg = {
      id: Date.now(),
      text: messageText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(messageText);
      const aiMsg = {
        id: Date.now() + 1,
        text: response.content,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
        sender: 'ai',
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-inter">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[480px] h-[680px] bg-white dark:bg-dark-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-dark-700 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            <div className="relative flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-xl text-white">Ask KoraStudy</h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full border border-white/30">
                    Q built-in
                  </span>
                </div>
                <p className="text-white/90 text-sm max-w-[320px]">
                  Nhận hướng dẫn và đề xuất hữu ích từ trợ lý AI của KoraStudy.
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-800 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-600">
            {showWelcome && messages.length === 0 ? (
              <div className="space-y-6 pt-4">
                {/* Welcome Section */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-3">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                    Bạn cần giúp đỡ gì?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Hãy cho tôi biết bạn đang tìm kiếm gì.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-600 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-dark-700 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {action.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Bằng cách trò chuyện, bạn đồng ý với{' '}
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      điều khoản sử dụng
                    </a>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                        : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-dark-600'
                    } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' : ''}`}>
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-500 pl-3 italic my-2 opacity-80" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          code: ({node, inline, className, children, ...props}) => {
                            return inline ? (
                              <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-black/10 dark:bg-white/10 p-2 rounded text-xs font-mono overflow-x-auto my-2" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
            <div className="flex gap-2 items-center bg-gray-100 dark:bg-dark-900 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Hỏi một câu hỏi"
                className="flex-1 bg-transparent text-gray-800 dark:text-white px-3 py-2 text-sm focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-500"
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 hover:shadow-2xl hover:shadow-purple-500/50 text-white rounded-full shadow-xl flex items-center justify-center group z-50 hover:scale-110`}
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform duration-200" />
      </button>
      
      {/* Close Button (when open) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${!isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 absolute bottom-0 right-0 w-16 h-16 bg-white dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-600 dark:text-gray-300 rounded-full shadow-xl border-2 border-gray-200 dark:border-dark-600 flex items-center justify-center z-40 hover:rotate-90`}
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default Chatbox;

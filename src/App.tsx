import { useState, useCallback, useRef, useEffect, memo } from 'react';
import viteLogo from '/vite.svg';
import './App.css';
import { faAngleDown, faAngleUp, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Markdown from 'react-markdown';

// Constants
const CHAT_CONFIG = {
  API_URL: 'http://localhost:11434',
  MODEL: 'deepseek-r1:7b',
  TEMPERATURE: 0.1,
  REPEAT_PENALTY: 1.2,
  NUMA: true
} as const;

// Types
enum MessageRole {
  User = "user",
  Assistant = "assistant",
  Tool = "tool",
  System = "system"
}

type Message = {
  role: MessageRole;
  content: string;
}

type MessageWithThinking = Message & {
  thinking: boolean;
  think: string;
  thinkingStartTime?: number;
  thinkingTime?: number;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<MessageWithThinking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const messageQueue = useRef<string>('');

  // Cleanup effect
  useEffect(() => {
    return () => {
      abortController.current?.abort();
    };
  }, []);

  // Utility functions
  const transformToMessageWithThinking = (message: Message): MessageWithThinking => {
    const baseMessage = {
      ...message,
      thinking: false,
      think: "",
    };

    if (message.role !== MessageRole.Assistant) {
      return {
        ...baseMessage,
        content: message.content
      };
    }

    const isStartingToThink = message.content.includes("<think>") && !message.content.includes("</think>");
    const hasFinishedThinking = message.content.includes("</think>");

    const cleanThinkContent = (text: string) =>
      text.replace(/<think>|<\/think>/g, '').trim();

    const thinkMatch = message.content.match(/<think>(.*?)<\/think>(.*)?/s);

    // Get previous message state from sessionStorage
    const prevThinkingStartTime = sessionStorage.getItem('thinkingStartTime');
    const prevThinkingTime = sessionStorage.getItem('thinkingTime');

    // Calculate thinking time if thinking has finished
    let thinkingTime;
    if (hasFinishedThinking && prevThinkingStartTime) {
      thinkingTime = Date.now() - parseInt(prevThinkingStartTime);
      sessionStorage.setItem('thinkingTime', thinkingTime.toString());
      sessionStorage.removeItem('thinkingStartTime');
    } else if (prevThinkingTime) {
      thinkingTime = parseInt(prevThinkingTime);
    }

    // Store thinking start time if just started thinking
    if (isStartingToThink && !prevThinkingStartTime) {
      sessionStorage.setItem('thinkingStartTime', Date.now().toString());
      sessionStorage.removeItem('thinkingTime');
    }

    if (!thinkMatch) {
      return {
        ...baseMessage,
        thinking: isStartingToThink,
        think: cleanThinkContent(message.content),
        content: "",
        thinkingStartTime: isStartingToThink ? Date.now() : undefined,
        thinkingTime
      };
    }

    return {
      ...baseMessage,
      thinking: isStartingToThink,
      think: cleanThinkContent(thinkMatch[1] || ""),
      content: (thinkMatch[2] || "").trim(),
      thinkingStartTime: isStartingToThink ? Date.now() : undefined,
      thinkingTime
    };
  };

  const updateMessages = useCallback((newMessage: MessageWithThinking) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.role === MessageRole.Assistant) {
        return [...prev.slice(0, -1), newMessage];
      }
      return [...prev, newMessage];
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    messageQueue.current = '';
    abortController.current = new AbortController();

    const initialMessages = messages;
    try {
      const userMessage = transformToMessageWithThinking({
        role: MessageRole.User,
        content: content.trim()
      });

      setMessages(prev => [...prev, userMessage]);

      const chatMessages: Message[] = [
        ...initialMessages.map(m => ({
          role: m.role,
          content: m.role === MessageRole.User ? m.content : `<think>${m.think}</think>${m.content}`
        })),
        { role: MessageRole.User, content: content.trim() }
      ];

      const response = await fetch(`${CHAT_CONFIG.API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.current.signal,
        body: JSON.stringify({
          model: CHAT_CONFIG.MODEL,
          messages: chatMessages,
          streaming: true,
          options: {
            temperature: CHAT_CONFIG.TEMPERATURE,
            repeat_penalty: CHAT_CONFIG.REPEAT_PENALTY,
            numa: CHAT_CONFIG.NUMA,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const { message: { content } } = JSON.parse(chunk);

        messageQueue.current += content;
        updateMessages(transformToMessageWithThinking({
          role: MessageRole.Assistant,
          content: messageQueue.current
        }));
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Network connection error');
      setMessages(initialMessages);
    } finally {
      setIsLoading(false);
      abortController.current = null;
      messageQueue.current = '';
    }
  }, [messages, isLoading, updateMessages]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="h-screen">
      <section className="flex flex-col justify-center space-y-4 max-w-4xl mx-auto p-4 h-screen">
        <div className={`greeting p-4 bg-white rounded-lg shadow-sm ${messages.length === 0 ? 'block' : 'hidden'}`}>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <img src={viteLogo} className="w-8 h-8" alt="Vite logo" />
            <span className='font-semibold'>Hi, I'm ViVu Chat.</span>
          </div>
          <p className='text-center text-gray-600'>How can I help you today?</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4" role="alert">
            <p className="text-red-700">{error}</p>
            <button type='button' onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-sm">
              Dismiss
            </button>
          </div>
        )}

        <div className={`message-box space-y-4 ${messages.length === 0 ? 'hidden' : 'block flex-grow'}`}>
          {messages.map((message, index) => (
            <MessageBox
              key={`${message.role}-${index}`}
              message={message} // message is now correctly typed as MessageWithThinking
              isLoading={isLoading && index === messages.length - 1}
            />
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className={`bg-white p-4 rounded-lg shadow-lg border border-gray-200 ${messages.length === 0 ? '' : 'sticky bottom-4'}`}>
          <textarea
            rows={2}
            className="w-full rounded-lg p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type your message here...'
            disabled={isLoading}
          />
          <div className="flex justify-end mt-2">
            <button type='button' title='Send'
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

interface MessageBoxProps {
  message: MessageWithThinking;
  isLoading: boolean;
}

const MessageBox = memo(({ message, isLoading }: MessageBoxProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const formatThinkingTime = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)} second${ms >= 2000 ? 's' : ''}`;
  };

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`p-3 px-4 max-w-[95%] ${message.role === "user" ? "bg-blue-100 rounded-full" : ""}`}>
        {message.role === "assistant" && (
          <>
            <div className='flex items-center mb-4'>
              <div className="avatar p-2">
                <img src={viteLogo} className="w-8 h-8" alt="Vite logo" />
              </div>
              {message.think && message.think !== "\n\n" && (
                <div className="thinking">
                  <button type='button'
                    onClick={() => setCollapsed(c => !c)}
                    className="text-blue-700 hover:bg-blue-50 font-medium rounded-lg text-sm p-2 inline-flex items-center cursor-pointer">
                    <span className={message.thinking ? "animate-pulse" : ""}>
                      {message.thinkingTime ? `Thought for ${formatThinkingTime(message.thinkingTime)}` : "Thinking..."}
                    </span>
                    <FontAwesomeIcon
                      icon={collapsed ? faAngleDown : faAngleUp}
                      className='ml-2'
                    />
                  </button>
                </div>
              )}
            </div>
            {message.think && message.think !== "\n\n" && (
              <div className={`${collapsed ? "hidden" : "block"} bg-blue-100 mb-4 text-sm italic border-l-2 border-gray-400 pl-2 py-1`}>
                <Markdown>{message.think}</Markdown>
              </div>
            )}
          </>
        )}

        <article className="max-w-none">
          <Markdown>{message.content}</Markdown>
        </article>

        {message.role === "assistant" && isLoading && (
          <div role="status">
            <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
});


export default App;
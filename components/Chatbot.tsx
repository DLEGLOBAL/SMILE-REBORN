import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToBot } from '../services/geminiService';
import { MessageCircleIcon, XIcon, SendIcon, UserIcon, BotIcon, LoaderIcon } from './icons';
import ReactMarkdown from 'react-markdown';


export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponse = await sendMessageToBot(input);
            const botMessage: ChatMessage = { sender: 'bot', text: botResponse };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            setMessages([{ sender: 'bot', text: "Hi! How can I help you on your smile journey today?" }]);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 bg-aqua-main text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 z-40 animate-fade-in"
                    aria-label="Open Chatbot"
                >
                    <MessageCircleIcon className="w-8 h-8" />
                </button>
            )}

            {isOpen && (
                <div 
                    className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-full sm:max-w-md h-[80vh] sm:h-auto sm:max-h-[70vh] bg-ivory rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 flex flex-col animate-slide-in-up"
                    style={{ animationDuration: '0.3s' }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-gold-main text-white rounded-t-2xl sm:rounded-t-2xl">
                        <h3 className="font-bold text-lg">Smile Assistant</h3>
                        <button onClick={toggleChat} aria-label="Close Chatbot">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-aqua-main flex items-center justify-center text-white"><BotIcon className="w-5 h-5"/></div>}
                                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-aqua-main text-white rounded-br-none' : 'bg-white text-text-dark rounded-bl-none border border-gold-light'}`}>
                                    <div className="text-sm space-y-2">
                                        <ReactMarkdown components={{
                                            p: ({node, ...props}) => <p className="mb-1" {...props} />,
                                            a: ({node, ...props}) => <a className="text-aqua-dark hover:underline" {...props} />,
                                        }}>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                                {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-dark flex items-center justify-center text-white"><UserIcon className="w-5 h-5"/></div>}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3 my-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-aqua-main flex items-center justify-center text-white"><BotIcon className="w-5 h-5"/></div>
                                <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-white text-text-dark rounded-bl-none border border-gold-light">
                                    <LoaderIcon className="w-5 h-5 text-aqua-main" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gold-light/50 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-1 px-4 py-2 border border-gold-main rounded-full focus:outline-none focus:ring-2 focus:ring-aqua-main"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-aqua-main text-white rounded-full p-3 disabled:bg-gray-400">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
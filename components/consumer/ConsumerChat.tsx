
import React, { useState, useRef, useEffect } from 'react';
import { ConsumerData } from './ConsumerForm';
import { GoogleGenAI } from "@google/genai";
import { SendIcon } from '../icons/SendIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ConsumerChatProps {
    userData: ConsumerData;
}

const ConsumerChat: React.FC<ConsumerChatProps> = ({ userData }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting from AI
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            setIsTyping(true);
            
            setTimeout(() => {
                const initialMessage: Message = {
                    id: 1,
                    text: `Olá, ${userData.name}! Sou o assistente virtual da SolarLink. Vi que você é de ${userData.city}/${userData.uf}. Como posso te ajudar hoje? \n\nPosso estimar sua economia com energia solar ou tirar dúvidas sobre como funciona. O que prefere?`,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages([initialMessage]);
                setIsTyping(false);
            }, 1500);
        }
    }, [userData]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Construct conversation history for context
            const history = messages.map(m => `${m.sender === 'user' ? 'Usuário' : 'Assistente'}: ${m.text}`).join('\n');
            const prompt = `
            Você é um consultor especialista em energia solar da SolarLink.
            
            Dados do usuário:
            Nome: ${userData.name}
            Cidade: ${userData.city} - ${userData.uf}
            
            Histórico da conversa:
            ${history}
            Usuário: ${userMsg.text}
            
            Instruções:
            1. Seja amigável, educado e persuasivo, mas honesto.
            2. Se o usuário perguntar sobre economia, pergunte o valor médio da conta de luz dele (em Reais).
            3. Se ele der o valor da conta, faça uma estimativa simples (considerando payback médio de 3 a 4 anos e economia de 90-95%).
            4. Tire dúvidas sobre equipamentos, instalação, garantia, etc.
            5. Seu objetivo final é fazer com que ele queira receber um orçamento de um integrador parceiro (mas não force demais).
            6. Responda de forma concisa (máximo 3 parágrafos curtos).
            
            Responda como o Assistente:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const aiText = response.text || "Desculpe, estou com dificuldade de conexão. Poderia repetir?";

            const aiMsg: Message = {
                id: Date.now() + 1,
                text: aiText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: "Tive um problema técnico. Podemos continuar em instantes?",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Chat Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Consultor SolarLink</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-gray-400">Online agora</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                                {msg.sender === 'user' ? (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                        <UserCircleIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                                        <SparklesIcon className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-none'
                            }`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[10px] block mt-2 opacity-70 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-end gap-2">
                             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-none">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Digite sua mensagem..." 
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-gray-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-indigo-900/20"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsumerChat;

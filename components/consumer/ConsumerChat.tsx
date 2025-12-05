
import React, { useState, useRef, useEffect } from 'react';
import { ConsumerData } from './ConsumerForm';
import { supabase, supabaseAnonKey, supabaseUrl } from '../../lib/supabaseClient';
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
    initialContext?: string; // e.g., "Residencial", "Usina"
}

const ConsumerChat: React.FC<ConsumerChatProps> = ({ userData, initialContext }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            setIsTyping(true);
            
            const contextMsg = initialContext ? ` Vi que você tem interesse em projetos do tipo: ${initialContext}.` : '';

            setTimeout(async () => {
                const welcomeText = `Olá, ${userData.name}! Sou a Solara, sua assistente de energia.${contextMsg} Como posso te ajudar a economizar hoje?`;
                
                const initialMessage: Message = {
                    id: Date.now(),
                    text: welcomeText,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages([initialMessage]);
                setIsTyping(false);

                // Save initial message to DB if ID exists
                if (userData.id && !userData.id.startsWith('temp-')) {
                    await supabase.from('chat_logs').insert({
                        lead_id: userData.id,
                        role: 'assistant',
                        content: welcomeText
                    });
                }
            }, 1500);
        }
    }, [userData, initialContext]);

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

        // 1. Save User Message to DB
        if (userData.id && !userData.id.startsWith('temp-')) {
            supabase.from('chat_logs').insert({
                lead_id: userData.id,
                role: 'user',
                content: userMsg.text
            }).then(() => {});
        }

        try {
            const agentUrl = supabaseUrl
                ? `${supabaseUrl}/functions/v1/solara-agent`
                : '';

            let aiText: string | undefined;

            if (agentUrl) {
                const result = await fetch(agentUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(supabaseAnonKey ? { apikey: supabaseAnonKey } : {}),
                    },
                    body: JSON.stringify({
                        message: userMsg.text,
                        lead_id: userData.id,
                        context: initialContext,
                    }),
                });

                if (result.ok) {
                    const payload = await result.json();
                    aiText = payload.reply as string | undefined;
                }
            }

            if (!aiText) {
                aiText = supabaseConfigured
                    ? "Não consegui falar com o agente agora, mas vou registrar sua solicitação. Pode compartilhar o valor da sua conta de luz ou dúvidas específicas?"
                    : "Estou operando em modo offline, mas estou ouvindo! Conecte o app ao Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) para respostas reais.";
            }

            const aiMsg: Message = {
                id: Date.now() + 1,
                text: aiText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

            // 2. Save AI Response to DB
            if (userData.id && !userData.id.startsWith('temp-')) {
                await supabase.from('chat_logs').insert({
                    lead_id: userData.id,
                    role: 'assistant',
                    content: aiText
                });
            }

        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: "Estou com uma instabilidade na conexão com o servidor da Gerencia. Podemos continuar?",
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
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative">
                    <SparklesIcon className="w-6 h-6 text-white" />
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5">
                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        Solara 
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI Agent</span>
                    </h3>
                    <p className="text-xs text-gray-400">Conectada à Gerencia</p>
                </div>
            </div>

            {/* Chat Area */}
            {!supabaseConfigured && (
                <div className="bg-amber-900/40 border border-amber-700 text-amber-100 px-4 py-3 text-sm">
                    Executando em modo offline. Configure <code className="font-mono text-amber-200">VITE_SUPABASE_URL</code> e <code className="font-mono text-amber-200">VITE_SUPABASE_ANON_KEY</code> para habilitar respostas reais do agente.
                </div>
            )}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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

                            <div className={`p-3.5 rounded-2xl shadow-md text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-none'
                            }`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[10px] block mt-1.5 opacity-60 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start pl-10">
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-none">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Digite sua mensagem..." 
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 pr-12"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-transparent disabled:text-gray-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center aspect-square"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsumerChat;

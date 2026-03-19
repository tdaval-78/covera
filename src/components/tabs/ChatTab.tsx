'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import type { InsuranceContract, ChatMessage } from '@/types';

export default function ChatTab({
  contracts,
  messages,
  setMessages,
  selectedContract,
}: {
  contracts: InsuranceContract[];
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  selectedContract: InsuranceContract | null;
}) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeContractId, setActiveContractId] = useState<string | null>(
    selectedContract?.id || contracts[0]?.id || null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const activeContract = contracts.find(c => c.id === activeContractId) || contracts[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeContract?.analysis || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyText = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content,
          contractText: JSON.stringify(activeContract.analysis),
          conversationHistory: historyText,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "Désolé, je n'ai pas pu analyser votre question.",
        timestamp: new Date(),
      };

      setMessages([...messages, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Une erreur technique s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages([...messagesRef.current, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Suis-je couvert pour un vol ?",
    "Quel est le montant de ma franchise ?",
    "Quelles sont les exclusions ?",
    "Jusqu'à quand suis-je couvert ?",
  ];

  if (contracts.length === 0) {
    return (
      <div className="p-8 h-full flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat</h1>
        <p className="text-gray-500 mb-8">Posez des questions sur vos contrats</p>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Bot size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">Importez un contrat pour commencer à discuter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-500">
          Discutez avec l'IA sur la base de {activeContract?.name || 'votre contrat'}
        </p>
      </div>

      {/* Contract selector */}
      <div className="mb-4">
        <select
          value={activeContractId || ''}
          onChange={e => setActiveContractId(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {contracts.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto bg-white rounded-2xl border border-gray-100 p-4 mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot size={40} className="text-blue-400 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">
              Bonjour, je suis Covera Bot
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              Je réponds à vos questions sur votre contrat en me basant uniquement sur les termes de votre police.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              {msg.role === 'user'
                ? <User size={16} className="text-white" />
                : <Bot size={16} className="text-gray-600" />
              }
            </div>
            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot size={16} className="text-gray-600" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={
            activeContract?.analysis
              ? 'Posez une question sur votre contrat...'
              : "Importez d'abord un contrat analysé..."
          }
          disabled={!activeContract?.analysis || loading}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !activeContract?.analysis || loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          Envoyer
        </button>
      </div>
    </div>
  );
}

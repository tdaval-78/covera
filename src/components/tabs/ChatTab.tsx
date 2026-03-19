'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
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

    setMessages([...messagesRef.current, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyText = messagesRef.current
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
        content: data.answer || "Je n'ai pas pu analyser votre question.",
        timestamp: new Date(),
      };

      setMessages([...messagesRef.current, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages([...messagesRef.current, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Suis-je couvert pour un vol ?",
    "Montant de ma franchise ?",
    "Quelles exclusions ?",
    "Jusqu'à quand couvert ?",
  ];

  if (contracts.length === 0) {
    return (
      <div className="p-4 md:p-8 h-full flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Chat</h1>
        <p className="text-gray-500 mb-6 text-sm md:text-base">Posez des questions sur vos contrats</p>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={MessageCircle}
            title="Pas encore de contrat"
            description="Importez un contrat pour commencer à discuter avec l'IA Covera."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 pb-3 md:pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Basé sur {activeContract?.name || 'votre contrat'}
        </p>
        {/* Contract selector */}
        {contracts.length > 1 && (
          <select
            value={activeContractId || ''}
            onChange={e => setActiveContractId(e.target.value)}
            className="mt-3 w-full max-w-xs glass-input px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {contracts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 md:px-6 space-y-3">
        {messages.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-4">
              <Bot size={28} className="text-indigo-500" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Bonjour, je suis Covera Bot</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-5">
              Je réponds à vos questions sur votre contrat en me basant uniquement sur ses termes.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 bg-white/70 hover:bg-white rounded-full text-xs text-gray-600 hover:text-gray-900 transition-colors border border-white/50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'glass'
            }`}>
              {msg.role === 'user'
                ? <User size={14} className="text-white" />
                : <Bot size={14} className="text-indigo-500" />
              }
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm'
                : 'glass rounded-tl-sm text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full glass flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-indigo-500" />
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 pt-3 md:pt-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Posez une question..."
            disabled={!activeContract?.analysis || loading}
            className="flex-1 glass-input px-4 py-3 rounded-xl text-sm md:text-base text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !activeContract?.analysis || loading}
            className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

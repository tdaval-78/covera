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

    setMessages([...messagesRef.current, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyText = messagesRef.current.map(m => `${m.role}: ${m.content}`).join('\n');
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
      <div className="p-5 md:p-8 h-full flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Chat</h1>
        <p className="text-sm mt-1 mb-6">Posez des questions sur vos contrats</p>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--brand-light)' }}>
              <MessageCircle size={28} style={{ color: 'var(--brand)' }} />
            </div>
            <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Pas encore de contrat</h3>
            <p className="text-sm">Importez un contrat pour discuter avec l&apos;IA Covera.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
            <Bot size={16} />
          </div>
          <div>
            <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Covera Bot</h1>
          </div>
        </div>
        <p className="text-sm">
          Basé sur {activeContract?.name || 'votre contrat'}
        </p>
        {contracts.length > 1 && (
          <select
            value={activeContractId || ''}
            onChange={e => setActiveContractId(e.target.value)}
            className="input mt-3 text-sm"
          >
            {contracts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 md:px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Bonjour, je suis Covera Bot</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Expert en vos contrats d&apos;assurance</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Je réponds à vos questions sur votre contrat en me basant uniquement sur ses termes. Je ne fabrique jamais d&apos;information.
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="btn btn-outline btn-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={msg.role === 'user'
                ? { background: 'var(--brand)', color: 'white' }
                : { background: 'var(--bg-subtle)', color: 'var(--brand)' }}
            >
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={msg.role === 'user'
                ? { background: 'var(--brand)', color: 'white', borderBottomRightRadius: '4px' }
                : { background: 'var(--bg-subtle)', color: 'var(--text-primary)', borderBottomLeftRadius: '4px' }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-subtle)', color: 'var(--brand)' }}>
              <Bot size={14} />
            </div>
            <div className="card px-4 py-3 rounded-2xl rounded-bl-sm" style={{ borderBottomLeftRadius: '4px' }}>
              <div className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <span key={delay} className="w-2 h-2 rounded-full" style={{ background: 'var(--brand)', animation: `pulse 1s ease-in-out ${delay}ms infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="flex gap-2 max-w-2xl">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Posez une question..."
            disabled={!activeContract?.analysis || loading}
            className="input flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !activeContract?.analysis || loading}
            className="btn btn-brand btn-md w-12 p-0"
          >
            <Send size={16} />
          </button>
        </div>
        {!activeContract?.analysis && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Importez d&apos;abord un contrat analysé.</p>
        )}
      </div>
    </div>
  );
}

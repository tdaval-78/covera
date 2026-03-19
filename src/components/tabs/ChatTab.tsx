'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { InsuranceContract, ChatMessage } from '@/types';

interface Props {
  contracts: InsuranceContract[];
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  selectedContract: InsuranceContract | null;
}

const WELCOME = `Bonjour ! Je suis l&apos;assistant Covera. Sélectionnez un contrat dans l&apos;onglet "Contrats" pour commencer à poser des questions sur vos garanties, exclusions, ou conditions.`;

export default function ChatTab({ contracts, messages, setMessages, selectedContract }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME }]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const contractText = selectedContract?.analysis?.rawText || selectedContract?.coverageItems.map(i => `${i.name}: ${i.coveredRisks.join(', ')} — Exclusions: ${i.excludedRisks.join(', ')}`).join('\n') || '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          contractContext: contractText,
          contractName: selectedContract?.name,
        }),
      });
      const data = await res.json();
      const reply: ChatMessage = { role: 'assistant', content: data.reply || "Je n'ai pas pu traiter votre demande. Réessayez." };
      setMessages(prev => [...prev, reply]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Une erreur s'est produite. Réessayez." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', flexShrink: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Chat</h1>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
            background: selectedContract ? 'var(--brand-light)' : 'var(--bg-subtle)',
            border: selectedContract ? '1px solid var(--brand)' : '1px solid var(--border)',
            cursor: 'pointer', width: '100%', textAlign: 'left',
          }}
        >
          <FileText size={14} style={{ color: selectedContract ? 'var(--brand)' : 'var(--text-tertiary)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: selectedContract ? 'var(--brand)' : 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedContract ? selectedContract.name : 'Sélectionnez un contrat...'}
          </span>
          {expanded ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
        </button>

        {expanded && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
            {contracts.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0, textAlign: 'center', padding: 12 }}>Aucun contrat disponible. Importez-en un d&apos;abord.</p>
            ) : contracts.map(c => (
              <button
                key={c.id}
                onClick={() => { setExpanded(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                  background: c.id === selectedContract?.id ? 'var(--brand-light)' : 'var(--bg-subtle)',
                  border: c.id === selectedContract?.id ? '1px solid var(--brand)' : '1px solid var(--border)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <FileText size={14} style={{ color: c.id === selectedContract?.id ? 'var(--brand)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: c.id === selectedContract?.id ? 'var(--brand)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: msg.role === 'assistant' ? 'linear-gradient(135deg, #5B4CF5, #7C5CF5)' : 'var(--bg-subtle)',
              color: msg.role === 'assistant' ? 'white' : 'var(--text-secondary)',
            }}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div style={{
              maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #5B4CF5, #7C5CF5)' : 'var(--bg-card)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              fontSize: 14, lineHeight: 1.6, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
            }}>
              <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} style={{ color: 'white' }} />
            </div>
            <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={16} style={{ color: 'var(--brand)', animation: 'spin 0.7s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>L&apos;IA réfléchit...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 100px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: 640, margin: '0 auto' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={selectedContract ? 'Posez une question sur votre contrat...' : 'Sélectionnez un contrat d&apos;abord...'}
            disabled={!selectedContract}
            rows={1}
            style={{
              flex: 1, padding: '12px 16px', boxSizing: 'border-box',
              background: 'var(--bg-subtle)', border: '1.5px solid var(--border)',
              borderRadius: 14, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
              resize: 'none', minHeight: 44, maxHeight: 120, lineHeight: 1.5,
              fontFamily: 'inherit',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading || !selectedContract}
            style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: input.trim() && selectedContract ? 'linear-gradient(135deg, #5B4CF5, #7C5CF5)' : 'var(--bg-subtle)',
              color: input.trim() && selectedContract ? 'white' : 'var(--text-tertiary)',
              border: 'none', cursor: input.trim() && selectedContract ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: input.trim() && selectedContract ? '0 2px 8px rgba(91,76,245,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

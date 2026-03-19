'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import SituationTab from '@/components/tabs/SituationTab';
import DetailsTab from '@/components/tabs/DetailsTab';
import ChatTab from '@/components/tabs/ChatTab';
import AddContractTab from '@/components/tabs/AddContractTab';
import type { InsuranceContract, ChatMessage } from '@/types';
import { useContracts } from '@/hooks/useContracts';

type Tab = 'situation' | 'details' | 'chat' | 'add';

export default function Home() {
  const { user, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('situation');
  const [selectedContract, setSelectedContract] = useState<InsuranceContract | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { contracts, loading: contractsLoading, addContract, deleteContract } = useContracts(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleContractAdded = async (contract: InsuranceContract) => {
    if (!user) return;
    const savedId = await addContract({
      userId: user.id,
      name: contract.name,
      category: contract.category,
      fileName: contract.fileName,
      fileType: contract.fileType,
      analysis: contract.analysis,
      coverageItems: contract.coverageItems,
    });
    setActiveTab('situation');
    if (savedId) {
      // Refresh will happen via the hook
    }
  };

  if (loading || contractsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 8px 24px rgba(91,76,245,0.3)' }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full border-2 mx-auto" style={{ borderColor: 'rgba(91,76,245,0.2)', borderTopColor: '#5B4CF5', animation: 'spin 0.7s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'situation':
        return (
          <SituationTab
            contracts={contracts}
            onSelectContract={(c) => {
              setSelectedContract(c);
              setActiveTab('details');
            }}
            onAddContract={() => setActiveTab('add')}
            onDeleteContract={deleteContract}
          />
        );
      case 'details':
        return (
          <DetailsTab
            contracts={contracts}
            selectedContract={selectedContract}
            onSelectContract={setSelectedContract}
          />
        );
      case 'chat':
        return (
          <ChatTab
            contracts={contracts}
            messages={messages}
            setMessages={setMessages}
            selectedContract={selectedContract}
          />
        );
      case 'add':
        return (
          <AddContractTab
            onContractAdded={handleContractAdded}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as Tab)}
          theme={theme}
          onToggleTheme={toggle}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {renderTab()}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as Tab)}
        theme={theme}
        onToggleTheme={toggle}
      />
    </div>
  );
}

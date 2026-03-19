'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import SituationTab from '@/components/tabs/SituationTab';
import DetailsTab from '@/components/tabs/DetailsTab';
import ChatTab from '@/components/tabs/ChatTab';
import AddContractTab from '@/components/tabs/AddContractTab';
import { LoadingSpinner } from '@/components/ui/EmptyState';
import type { InsuranceContract, ChatMessage } from '@/types';

type Tab = 'situation' | 'details' | 'chat' | 'add';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('situation');
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<InsuranceContract | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const addContract = (contract: InsuranceContract) => {
    setContracts(prev => [...prev, contract]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg" style={{boxShadow:'0 8px 24px rgba(99,102,241,0.3)'}}>
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <LoadingSpinner size={28} text="Chargement..." />
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
            onContractAdded={(contract) => {
              addContract(contract);
              setActiveTab('situation');
            }}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex">
        <Sidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as Tab)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        {renderTab()}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t as Tab)} />
    </div>
  );
}

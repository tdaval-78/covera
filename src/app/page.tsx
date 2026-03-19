'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import SituationTab from '@/components/tabs/SituationTab';
import DetailsTab from '@/components/tabs/DetailsTab';
import ChatTab from '@/components/tabs/ChatTab';
import AddContractTab from '@/components/tabs/AddContractTab';
import type { InsuranceContract, ChatMessage } from '@/types';
import { Loader2 } from 'lucide-react';

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
          <Loader2 size={40} className="animate-spin mx-auto text-indigo-500 mb-3" />
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'situation':
        return <SituationTab contracts={contracts} onSelectContract={setSelectedContract} />;
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
      <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />
      <main className="flex-1 overflow-auto">
        {renderTab()}
      </main>
    </div>
  );
}

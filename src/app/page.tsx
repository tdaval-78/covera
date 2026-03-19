'use client';

import { useState } from 'react';
import SituationTab from '@/components/tabs/SituationTab';
import DetailsTab from '@/components/tabs/DetailsTab';
import ChatTab from '@/components/tabs/ChatTab';
import AddContractTab from '@/components/tabs/AddContractTab';
import Sidebar from '@/components/Sidebar';
import type { InsuranceContract, CoverageItem, ChatMessage } from '@/types';

type Tab = 'situation' | 'details' | 'chat' | 'add';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('situation');
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<InsuranceContract | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addContract = (contract: InsuranceContract) => {
    setContracts(prev => [...prev, contract]);
  };

  const coverageItems: CoverageItem[] = contracts.flatMap(c => c.coverageItems);

  const renderTab = () => {
    switch (activeTab) {
      case 'situation':
        return (
          <SituationTab
            contracts={contracts}
            onSelectContract={setSelectedContract}
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderTab()}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { createBrowserClient } from '@supabase/ssr';

function useContracts(userId: string | undefined) {
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchContracts = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('contracts')
      .select('*, contract_analysis(*), coverage_items(*)')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setContracts(data.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        userId: row.user_id as string,
        name: row.name as string,
        category: row.category as InsuranceContract['category'],
        fileName: (row.file_name as string) || '',
        fileType: row.file_type as InsuranceContract['fileType'],
        uploadedAt: row.uploaded_at as string,
        analysis: row.contract_analysis ? {
          insurer: (row.contract_analysis as Record<string, unknown>).insurer as string || '',
          policyNumber: (row.contract_analysis as Record<string, unknown>).policy_number as string || '',
          productName: (row.contract_analysis as Record<string, unknown>).product_name as string || '',
          startDate: ((row.contract_analysis as Record<string, unknown>).start_date as string) || '',
          endDate: ((row.contract_analysis as Record<string, unknown>).end_date as string) || '',
          premium: (row.contract_analysis as Record<string, unknown>).premium as number || 0,
          currency: 'EUR',
          franchise: (row.contract_analysis as Record<string, unknown>).franchise as number || 0,
          coveredRisks: (row.contract_analysis as Record<string, unknown>).covered_risks as string[] || [],
          excludedRisks: (row.contract_analysis as Record<string, unknown>).excluded_risks as string[] || [],
          plafonds: (row.contract_analysis as Record<string, unknown>).plafonds as InsuranceContract['coverageItems'][0]['plafonds'] || [],
          conditions: (row.contract_analysis as Record<string, unknown>).conditions as string || '',
          confidence: (row.contract_analysis as Record<string, unknown>).confidence as number || 0,
          rawText: '', rawHtml: '',
        } : null,
        coverageItems: ((row.coverage_items as Array<Record<string, unknown>>) || []).map((item: Record<string, unknown>) => ({
          id: item.id as string,
          name: item.name as string,
          category: item.category as InsuranceContract['category'],
          icon: '',
          insurer: (item.insurer as string) || '',
          policyNumber: (item.policy_number as string) || '',
          startDate: (item.start_date as string) || '',
          endDate: (item.end_date as string) || '',
          premium: (item.premium as number) || 0,
          franchise: (item.franchise as number) || 0,
          coverageStatus: (item.coverage_status as InsuranceContract['coverageItems'][0]['coverageStatus']) || 'unknown',
          coveredRisks: (item.covered_risks as string[]) || [],
          excludedRisks: (item.excluded_risks as string[]) || [],
          plafonds: (item.plafonds as InsuranceContract['coverageItems'][0]['plafonds']) || [],
          conditions: (item.conditions as string) || '',
          notes: (item.notes as string) || '',
        })),
      })));
    }
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const addContract = useCallback(async (contract: Omit<InsuranceContract, 'id' | 'uploadedAt'>) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('contracts')
      .insert({ user_id: userId, name: contract.name, category: contract.category, file_name: contract.fileName, file_type: contract.fileType, raw_text: contract.analysis?.rawText || '' })
      .select().single();
    if (error || !data) return null;
    if (contract.analysis) {
      await supabase.from('contract_analysis').insert({
        contract_id: data.id,
        insurer: contract.analysis.insurer,
        policy_number: contract.analysis.policyNumber,
        product_name: contract.analysis.productName,
        start_date: contract.analysis.startDate || null,
        end_date: contract.analysis.endDate || null,
        premium: contract.analysis.premium,
        franchise: contract.analysis.franchise,
        covered_risks: contract.analysis.coveredRisks,
        excluded_risks: contract.analysis.excludedRisks,
        plafonds: contract.analysis.plafonds,
        conditions: contract.analysis.conditions,
        confidence: contract.analysis.confidence,
      });
    }
    if (contract.coverageItems.length > 0) {
      await supabase.from('coverage_items').insert(contract.coverageItems.map(item => ({
        contract_id: data.id, name: item.name, category: item.category, insurer: item.insurer,
        policy_number: item.policyNumber, start_date: item.startDate || null, end_date: item.endDate || null,
        premium: item.premium, franchise: item.franchise, coverage_status: item.coverageStatus,
        covered_risks: item.coveredRisks, excluded_risks: item.excludedRisks, plafonds: item.plafonds,
        conditions: item.conditions, notes: item.notes,
      })));
    }
    await fetchContracts();
    return data.id;
  }, [userId, supabase, fetchContracts]);

  const deleteContract = useCallback(async (contractId: string) => {
    if (!userId) return;
    await supabase.from('contracts').delete().eq('id', contractId).eq('user_id', userId);
    setContracts(prev => prev.filter(c => c.id !== contractId));
  }, [userId, supabase]);

  return { contracts, loading, addContract, deleteContract };
}

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
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const handleContractAdded = async (contract: InsuranceContract) => {
    await addContract({
      userId: user!.id,
      name: contract.name,
      category: contract.category,
      fileName: contract.fileName,
      fileType: contract.fileType,
      analysis: contract.analysis,
      coverageItems: contract.coverageItems,
    });
    setActiveTab('situation');
  };

  if (loading || contractsLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(91,76,245,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(91,76,245,0.2)', borderTopColor: '#5B4CF5', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'situation':
        return <SituationTab contracts={contracts} onSelectContract={(c) => { setSelectedContract(c); setActiveTab('details'); }} onAddContract={() => setActiveTab('add')} onDeleteContract={deleteContract} />;
      case 'details':
        return <DetailsTab contracts={contracts} selectedContract={selectedContract} onSelectContract={setSelectedContract} />;
      case 'chat':
        return <ChatTab contracts={contracts} messages={messages} setMessages={setMessages} selectedContract={selectedContract} />;
      case 'add':
        return <AddContractTab onContractAdded={handleContractAdded} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <div style={{ display: 'none' }} className="lg:block">
        <Sidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as Tab)} theme={theme} onToggleTheme={toggle} />
      </div>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {renderTab()}
      </main>
      <MobileNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t as Tab)} theme={theme} onToggleTheme={toggle} />
    </div>
  );
}

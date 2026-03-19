'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { InsuranceContract } from '@/types';

export function useContracts(userId: string | undefined) {
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchContracts = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        contract_analysis (*),
        coverage_items (*)
      `)
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      const mapped: InsuranceContract[] = data.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        userId: row.user_id as string,
        name: row.name as string,
        category: row.category as InsuranceContract['category'],
        fileName: row.file_name as string || '',
        fileType: row.file_type as InsuranceContract['fileType'],
        uploadedAt: row.uploaded_at as string,
        analysis: row.contract_analysis ? {
          insurer: (row.contract_analysis as Record<string, unknown>).insurer as string || '',
          policyNumber: (row.contract_analysis as Record<string, unknown>).policy_number as string || '',
          productName: (row.contract_analysis as Record<string, unknown>).product_name as string || '',
          startDate: (row.contract_analysis as Record<string, unknown>?.start_date as string) || '',
          endDate: (row.contract_analysis as Record<string, unknown>).end_date as string || '',
          premium: (row.contract_analysis as Record<string, unknown>).premium as number || 0,
          currency: 'EUR',
          franchise: (row.contract_analysis as Record<string, unknown>).franchise as number || 0,
          coveredRisks: (row.contract_analysis as Record<string, unknown>).covered_risks as string[] || [],
          excludedRisks: (row.contract_analysis as Record<string, unknown>).excluded_risks as string[] || [],
          plafonds: (row.contract_analysis as Record<string, unknown>).plafonds as InsuranceContract['coverageItems'][0]['plafonds'] || [],
          conditions: (row.contract_analysis as Record<string, unknown>).conditions as string || '',
          confidence: (row.contract_analysis as Record<string, unknown>).confidence as number || 0,
          rawText: '',
          rawHtml: '',
        } : null,
        coverageItems: (row.coverage_items as Array<Record<string, unknown>> || []).map((item: Record<string, unknown>) => ({
          id: item.id as string,
          name: item.name as string,
          category: item.category as InsuranceContract['category'],
          icon: '',
          insurer: item.insurer as string || '',
          policyNumber: item.policy_number as string || '',
          startDate: item.start_date as string || '',
          endDate: item.end_date as string || '',
          premium: item.premium as number || 0,
          franchise: item.franchise as number || 0,
          coverageStatus: item.coverage_status as InsuranceContract['coverageItems'][0]['coverageStatus'] || 'unknown',
          coveredRisks: item.covered_risks as string[] || [],
          excludedRisks: item.excluded_risks as string[] || [],
          plafonds: item.plafonds as InsuranceContract['coverageItems'][0]['plafonds'] || [],
          conditions: item.conditions as string || '',
          notes: item.notes as string || '',
        })),
      }));
      setContracts(mapped);
    }
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const addContract = useCallback(async (contract: Omit<InsuranceContract, 'id' | 'uploadedAt'>) => {
    if (!userId) return null;

    // Insert contract
    const { data: contractData, error: contractError } = await supabase
      .from('contracts')
      .insert({
        user_id: userId,
        name: contract.name,
        category: contract.category,
        file_name: contract.fileName,
        file_type: contract.fileType,
        raw_text: contract.analysis?.rawText || '',
      })
      .select()
      .single();

    if (contractError || !contractData) {
      console.error('Failed to save contract:', contractError);
      return null;
    }

    // Insert analysis
    if (contract.analysis) {
      await supabase.from('contract_analysis').insert({
        contract_id: contractData.id,
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

    // Insert coverage items
    if (contract.coverageItems.length > 0) {
      await supabase.from('coverage_items').insert(
        contract.coverageItems.map(item => ({
          contract_id: contractData.id,
          name: item.name,
          category: item.category,
          insurer: item.insurer,
          policy_number: item.policyNumber,
          start_date: item.startDate || null,
          end_date: item.endDate || null,
          premium: item.premium,
          franchise: item.franchise,
          coverage_status: item.coverageStatus,
          covered_risks: item.coveredRisks,
          excluded_risks: item.excludedRisks,
          plafonds: item.plafonds,
          conditions: item.conditions,
          notes: item.notes,
        }))
      );
    }

    await fetchContracts();
    return contractData.id;
  }, [userId, supabase, fetchContracts]);

  const deleteContract = useCallback(async (contractId: string) => {
    if (!userId) return;
    await supabase.from('contracts').delete().eq('id', contractId).eq('user_id', userId);
    setContracts(prev => prev.filter(c => c.id !== contractId));
  }, [userId, supabase]);

  return { contracts, loading, addContract, deleteContract, refresh: fetchContracts };
}

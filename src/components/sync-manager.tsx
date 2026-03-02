'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { getPendingSyncActions, markSyncActionComplete } from '@/lib/offline-storage';
import { OfflineIndicator } from './offline-indicator';

interface SyncManagerProps {
  children: React.ReactNode;
}

export function SyncManager({ children }: SyncManagerProps) {
  const { isOnline } = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkPendingActions = useCallback(async () => {
    const actions = await getPendingSyncActions();
    setPendingCount(actions.length);
  }, []);

  useEffect(() => {
    checkPendingActions();
    // Check every 5 seconds
    const interval = setInterval(checkPendingActions, 5000);
    return () => clearInterval(interval);
  }, [checkPendingActions]);

  const handleSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const actions = await getPendingSyncActions();
      
      for (const action of actions) {
        try {
          // Simulate API call - replace with actual API
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action),
          });
          
          await markSyncActionComplete(action.id);
        } catch (error) {
          console.error('Sync failed for action:', action, error);
        }
      }
      
      await checkPendingActions();
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, checkPendingActions]);

  return (
    <>
      {children}
      <OfflineIndicator 
        onSync={handleSync} 
        pendingCount={pendingCount} 
      />
    </>
  );
}

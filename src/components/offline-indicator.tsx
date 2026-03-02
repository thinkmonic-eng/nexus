'use client';

import { useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface OfflineIndicatorProps {
  onSync?: () => Promise<void>;
  pendingCount?: number;
}

export function OfflineIndicator({ onSync, pendingCount = 0 }: OfflineIndicatorProps) {
  const { isOnline, wasOffline, resetWasOffline } = useOnlineStatus();

  useEffect(() => {
    if (wasOffline && isOnline && onSync) {
      // Auto-sync when coming back online
      onSync().then(() => resetWasOffline());
    }
  }, [isOnline, wasOffline, onSync, resetWasOffline]);

  if (isOnline && !wasOffline && pendingCount === 0) {
    return null;
  }

  if (!isOnline) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto max-w-md z-50">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Modo Offline</AlertTitle>
        <AlertDescription>
          Estás trabajando sin conexión. Los cambios se sincronizarán cuando vuelvas a estar online.
        </AlertDescription>
      </Alert>
    );
  }

  if (wasOffline || pendingCount > 0) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-yellow-50 border-yellow-200">
        <Wifi className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Conexión Restaurada</AlertTitle>
        <AlertDescription className="text-yellow-700">
          {pendingCount > 0 ? (
            <>
              Hay {pendingCount} cambio{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''} para sincronizar.
              <Button
                size="sm"
                variant="outline"
                className="ml-2 h-6 text-xs"
                onClick={onSync}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Sincronizar
              </Button>
            </>
          ) : (
            'Sincronización completada.'
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

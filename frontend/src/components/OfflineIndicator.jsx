import React, { useState, useEffect } from 'react';
import { FiWifiOff, FiWifi, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import offlineQueue from '../utils/offlineQueue';

const OfflineIndicator = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show brief notification
      setTimeout(() => {
        updatePendingCount();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueProcessed = (event) => {
      setPendingActions(event.detail.remaining);
    };

    const updatePendingCount = () => {
      setPendingActions(offlineQueue.getPendingCount());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('queueProcessed', handleQueueProcessed);

    // Initial count
    updatePendingCount();

    // Update count periodically
    const interval = setInterval(updatePendingCount, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('queueProcessed', handleQueueProcessed);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingActions === 0) {
    return null; // Don't show anything when online and no pending actions
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`rounded-lg shadow-lg p-4 transition-all duration-300 ${
          isOnline
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}
        onClick={() => setShowDetails(!showDetails)}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <FiWifi className="text-2xl" />
          ) : (
            <FiWifiOff className="text-2xl animate-pulse" />
          )}
          <div>
            <div className="font-semibold">
              {isOnline ? t('online') || 'Online' : t('offline') || 'Offline'}
            </div>
            {pendingActions > 0 && (
              <div className="text-sm flex items-center space-x-1">
                <FiClock />
                <span>
                  {pendingActions} {t('pendingActions') || 'pending actions'}
                </span>
              </div>
            )}
          </div>
        </div>

        {showDetails && pendingActions > 0 && (
          <div className="mt-3 pt-3 border-t border-white/30">
            <div className="text-sm">
              {isOnline
                ? t('syncingActions') || 'Syncing your actions...'
                : t('actionsWillSync') || 'Actions will sync when online'}
            </div>
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOnline) {
                    offlineQueue.processQueue();
                  }
                }}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
                disabled={!isOnline}
              >
                {isOnline
                  ? t('syncNow') || 'Sync Now'
                  : t('waitingForConnection') || 'Waiting for connection'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;

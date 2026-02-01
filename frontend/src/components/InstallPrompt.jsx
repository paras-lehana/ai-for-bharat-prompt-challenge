import React, { useState, useEffect } from 'react';
import { FiX, FiDownload, FiSmartphone } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const InstallPrompt = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('installPromptDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if not installed, not dismissed recently (7 days), and not iOS
    if (!isInStandaloneMode && (!dismissed || daysSinceDismissed > 7) && !iOS) {
      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // Show prompt after a delay
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    // Show iOS instructions if on iOS and not installed
    if (iOS && !isInStandaloneMode && (!dismissed || daysSinceDismissed > 7)) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-2xl p-5 relative animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <FiSmartphone className="text-3xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {t('installApp') || 'Install Lokal Mandi'}
            </h3>
            <p className="text-sm text-white/90 mb-3">
              {isIOS
                ? t('installInstructionsIOS') || 'Tap the share button and select "Add to Home Screen"'
                : t('installInstructions') || 'Install our app for quick access and offline support'}
            </p>

            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <FiDownload />
                <span>{t('install') || 'Install'}</span>
              </button>
            )}

            {isIOS && (
              <div className="text-sm space-y-2 bg-white/10 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">1️⃣</span>
                  <span>{t('tapShareButton') || 'Tap the Share button'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">2️⃣</span>
                  <span>{t('selectAddToHome') || 'Select "Add to Home Screen"'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">3️⃣</span>
                  <span>{t('tapAdd') || 'Tap "Add"'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

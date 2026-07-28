import { useState, useEffect, useCallback } from 'react';
import { useFeatureFlags } from '../../../core/hooks/useFeatureFlags';

const DISMISS_KEY = 'pwa-install-dismissed-at';
const COMPLETED_KEY = 'pwa-install-completed';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
// beforeinstallprompt fires very early when supported — a short wait is enough
// to distinguish "native support, event pending" from "not supported at all".
const PLATFORM_DETECTION_DELAY_MS = 1000;

function detectIsInstalled() {
  try {
    if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone) return true; // iOS Safari "Add to Home Screen"
    if (localStorage.getItem(COMPLETED_KEY) === '1') return true;
  } catch {
    /* ignore */
  }
  return false;
}

function detectIsIosSafari() {
  const ua = window.navigator.userAgent || '';
  const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isChromeOnIos = /CriOS/.test(ua); // Chrome-on-iOS can't install PWAs either
  return isIosDevice && !isChromeOnIos;
}

function isDismissedRecently() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < COOLDOWN_MS;
  } catch {
    return false;
  }
}

/**
 * Central PWA install-prompt state: detects platform (native beforeinstallprompt
 * vs iOS Safari vs unsupported/already installed), tracks the 7-day dismiss
 * cooldown, and exposes install()/dismiss() actions. No UI here.
 */
export function usePwaInstall() {
  const { flags } = useFeatureFlags();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState('unsupported'); // 'native' | 'ios' | 'unsupported'
  const [isInstalled, setIsInstalled] = useState(() => detectIsInstalled());
  const [dismissedRecently, setDismissedRecently] = useState(() => isDismissedRecently());

  useEffect(() => {
    if (isInstalled) return;

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('native');
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    function handleAppInstalled() {
      try {
        localStorage.setItem(COMPLETED_KEY, '1');
      } catch {
        /* ignore */
      }
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
    window.addEventListener('appinstalled', handleAppInstalled);

    const timer = setTimeout(() => {
      setPlatform((current) => (current === 'native' ? current : (detectIsIosSafari() ? 'ios' : 'unsupported')));
    }, PLATFORM_DETECTION_DELAY_MS);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const install = useCallback(async () => {
    if (platform === 'native' && deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch {
        /* ignore */
      }
      setDeferredPrompt(null);
    }
    // platform === 'ios': the consuming component opens PwaIosInstructionsModal instead.
  }, [platform, deferredPrompt]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setDismissedRecently(true);
  }, []);

  const shouldShow = !isInstalled
    && platform !== 'unsupported'
    && !dismissedRecently
    && flags.pwaPromptEnabled !== false;

  return { platform, isInstalled, shouldShow, install, dismiss };
}

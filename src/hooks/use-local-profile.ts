

"use client";

import { useState, useEffect, useCallback } from 'react';
import type { LocalProfile } from '@/lib/types';

const getStorageKey = (uid: string | undefined) => uid ? `wikistars5-local-profile-${uid}` : '';

export function useLocalProfile(uid: string | undefined) {
  const [localProfile, setLocalProfile] = useState<LocalProfile | null>(null);
  const storageKey = getStorageKey(uid);

  useEffect(() => {
    if (!storageKey) {
        setLocalProfile(null);
        return;
    };

    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        setLocalProfile(JSON.parse(item));
      } else {
        setLocalProfile(null);
      }
    } catch (error) {
      console.error("Error reading from local storage", error);
      setLocalProfile(null);
    }
  }, [storageKey]);

  const saveLocalProfile = useCallback((profile: LocalProfile) => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
      // Dispatch a custom event to notify other parts of the app, like useAuth.
      window.dispatchEvent(new Event('local-profile-updated'));
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  }, [storageKey]);

  const clearLocalProfile = useCallback(() => {
      if (!storageKey) return;
      try {
        window.localStorage.removeItem(storageKey);
        // Also dispatch an event on clearing, in case the UI needs to react.
        window.dispatchEvent(new Event('local-profile-updated'));
      } catch (error) {
        console.error("Error removing from local storage", error);
      }
  }, [storageKey]);

  return { localProfile, saveLocalProfile, clearLocalProfile };
}

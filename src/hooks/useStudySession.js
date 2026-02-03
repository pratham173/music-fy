/**
 * Custom hook for study session management
 */
import { useState, useEffect } from 'react';
import {
  saveStudyContent,
  getStudyContentByPDF,
  deleteStudyContent
} from '../services/indexedDB';
import {
  saveStudySession,
  getStudySessions
} from '../services/supabase';

export function useStudySession() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSession = async (sessionData) => {
    setLoading(true);
    setError(null);

    try {
      // Save to IndexedDB
      const localSession = await saveStudyContent(sessionData);
      
      // Try to save to Supabase (cloud sync)
      try {
        await saveStudySession(sessionData);
      } catch (err) {
        console.warn('Failed to sync to cloud:', err);
      }

      setCurrentSession(localSession);
      return localSession;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadSessionsByPDF = async (pdfId) => {
    setLoading(true);
    setError(null);

    try {
      const localSessions = await getStudyContentByPDF(pdfId);
      setSessions(localSessions);
      return localSessions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadCloudSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      const cloudSessions = await getStudySessions();
      return cloudSessions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeSession = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteStudyContent(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSession?.id === id) {
        setCurrentSession(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    loadSessionsByPDF,
    loadCloudSessions,
    removeSession,
    sessions,
    currentSession,
    setCurrentSession,
    loading,
    error
  };
}

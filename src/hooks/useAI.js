/**
 * Custom hook for AI content generation
 */
import { useState } from 'react';
import { aiProvider } from '../services/aiProvider';
import { getPromptForTheme } from '../services/promptTemplates';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [provider, setProvider] = useState(null);

  const generate = async (content, theme) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = getPromptForTheme(theme, content);
      const response = await aiProvider.generate(prompt);
      
      setResult(response.content);
      setProvider(response.provider);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProviderStatus = () => {
    return aiProvider.getStatus();
  };

  return {
    generate,
    loading,
    error,
    result,
    provider,
    getProviderStatus
  };
}

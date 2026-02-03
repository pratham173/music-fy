/**
 * AI Provider Status Component
 * Shows which AI provider is currently active
 */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AIProviderStatus({ provider }) {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (provider) {
      setStatus('active');
    } else {
      setStatus('idle');
    }
  }, [provider]);

  const getProviderName = (provider) => {
    const names = {
      gemini: 'Google Gemini',
      groq: 'Groq',
      together: 'Together AI',
      huggingface: 'Hugging Face'
    };
    return names[provider] || provider;
  };

  const getProviderIcon = (provider) => {
    const icons = {
      gemini: '✨',
      groq: '⚡',
      together: '🤝',
      huggingface: '🤗'
    };
    return icons[provider] || '🤖';
  };

  if (!provider) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="ai-provider-status"
    >
      <div className="status-indicator">
        <span className="provider-icon">{getProviderIcon(provider)}</span>
        <span className="provider-name">{getProviderName(provider)}</span>
        <span className={`status-dot ${status}`}></span>
      </div>

      <style jsx>{`
        .ai-provider-status {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .provider-icon {
          font-size: 18px;
        }

        .provider-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-dot.active {
          background: #4CAF50;
        }

        .status-dot.idle {
          background: #9E9E9E;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .ai-provider-status {
            bottom: 16px;
            right: 16px;
          }

          .status-indicator {
            padding: 10px 16px;
          }

          .provider-name {
            font-size: 13px;
          }
        }
      `}</style>
    </motion.div>
  );
}

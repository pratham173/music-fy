/**
 * Results Page
 * Displays AI-generated study content
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import StudyContent from '../components/study/StudyContent';
import LoadingAnimation from '../components/study/LoadingAnimation';
import AIProviderStatus from '../components/study/AIProviderStatus';
import { useAI } from '../hooks/useAI';
import { useStudySession } from '../hooks/useStudySession';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { generate, loading, error, result, provider } = useAI();
  const { createSession } = useStudySession();
  
  const [content, setContent] = useState(null);
  const [saved, setSaved] = useState(false);

  const { pdfName, chapterName, chapterText, theme, pdfId } = location.state || {};

  useEffect(() => {
    if (!chapterText || !theme) {
      navigate('/upload');
      return;
    }

    generateContent();
  }, []);

  const generateContent = async () => {
    try {
      const response = await generate(chapterText, theme);
      setContent(response.content);
    } catch (err) {
      console.error('Error generating content:', err);
    }
  };

  const handleSave = async () => {
    if (!content || saved) return;

    try {
      await createSession({
        pdfId,
        pdfName,
        chapterName,
        theme,
        content,
        provider
      });
      setSaved(true);
      alert('Study session saved successfully!');
    } catch (err) {
      console.error('Error saving session:', err);
      alert('Failed to save session');
    }
  };

  const handleRegenerate = () => {
    setContent(null);
    setSaved(false);
    generateContent();
  };

  const handleNewSession = () => {
    navigate('/upload');
  };

  if (!chapterText || !theme) {
    return null;
  }

  return (
    <div className="results-page">
      <div className="results-container">
        <header className="results-header">
          <button onClick={() => navigate('/study')} className="back-btn">
            ← Back to Dashboard
          </button>
          
          <div className="header-actions">
            {content && !loading && (
              <>
                <button
                  onClick={handleRegenerate}
                  className="action-btn regenerate-btn"
                >
                  🔄 Regenerate
                </button>
                <button
                  onClick={handleSave}
                  className={`action-btn save-btn ${saved ? 'saved' : ''}`}
                  disabled={saved}
                >
                  {saved ? '✓ Saved' : '💾 Save'}
                </button>
                <button
                  onClick={handleNewSession}
                  className="action-btn new-btn"
                >
                  + New
                </button>
              </>
            )}
          </div>
        </header>

        <div className="results-content">
          {loading && <LoadingAnimation />}
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-state"
            >
              <div className="error-icon">⚠️</div>
              <h2>Generation Failed</h2>
              <p>{error}</p>
              <button onClick={handleRegenerate} className="retry-btn">
                Try Again
              </button>
            </motion.div>
          )}

          {content && !loading && (
            <StudyContent
              content={content}
              theme={theme}
              pdfName={pdfName}
              chapterName={chapterName}
            />
          )}
        </div>

        {provider && <AIProviderStatus provider={provider} />}
      </div>

      <style jsx>{`
        .results-page {
          min-height: 100vh;
          padding: 24px;
          background: var(--bg-primary);
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .back-btn {
          padding: 10px 20px;
          background: var(--glass-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: var(--secondary-bg);
          transform: translateX(-2px);
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .regenerate-btn {
          background: var(--secondary-bg);
          color: var(--text-primary);
        }

        .regenerate-btn:hover {
          background: var(--border-color);
        }

        .save-btn {
          background: var(--primary-color);
          color: white;
        }

        .save-btn:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .save-btn.saved {
          background: #4CAF50;
          cursor: default;
        }

        .new-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .new-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .results-content {
          margin-top: 32px;
        }

        .error-state {
          text-align: center;
          padding: 80px 24px;
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .error-state h2 {
          font-size: 24px;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .error-state p {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .retry-btn {
          padding: 12px 32px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .results-page {
            padding: 16px;
          }

          .results-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .action-btn {
            flex: 1;
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

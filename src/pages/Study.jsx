/**
 * Study Dashboard Page
 * Main entry point for study features
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePDF } from '../hooks/usePDF';

export default function Study() {
  const navigate = useNavigate();
  const { loadAllPDFs, savedPDFs, removePDF } = usePDF();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedPDFs();
  }, []);

  const loadSavedPDFs = async () => {
    try {
      await loadAllPDFs();
    } catch (err) {
      console.error('Error loading PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewStudySession = () => {
    navigate('/upload');
  };

  const handleDeletePDF = async (id) => {
    if (window.confirm('Are you sure you want to delete this PDF and all its study content?')) {
      try {
        await removePDF(id);
      } catch (err) {
        console.error('Error deleting PDF:', err);
      }
    }
  };

  return (
    <div className="study-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="study-container"
      >
        <header className="study-header">
          <div className="header-content">
            <h1 className="page-title">
              <span className="title-icon">📚</span>
              StudyFlow
            </h1>
            <p className="page-subtitle">
              AI-Powered Study Assistant
            </p>
          </div>
          
          <button
            onClick={handleNewStudySession}
            className="new-session-btn"
          >
            <span className="btn-icon">+</span>
            New Study Session
          </button>
        </header>

        <div className="study-content">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading your study materials...</p>
            </div>
          ) : savedPDFs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h2>No Study Materials Yet</h2>
              <p>Upload a PDF to start generating personalized study content</p>
              <button
                onClick={handleNewStudySession}
                className="primary-btn"
              >
                Upload Your First PDF
              </button>
            </div>
          ) : (
            <div className="pdfs-grid">
              {savedPDFs.map((pdf) => (
                <motion.div
                  key={pdf.id}
                  className="pdf-card"
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  <div className="pdf-icon">📄</div>
                  <div className="pdf-info">
                    <h3 className="pdf-name">{pdf.name}</h3>
                    <div className="pdf-meta">
                      <span>{pdf.numPages} pages</span>
                      <span>{pdf.chapters?.length || 0} chapters</span>
                    </div>
                    <div className="pdf-date">
                      {new Date(pdf.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="pdf-actions">
                    <button
                      onClick={() => navigate(`/upload?pdfId=${pdf.id}`)}
                      className="action-btn study-btn"
                    >
                      Study
                    </button>
                    <button
                      onClick={() => handleDeletePDF(pdf.id)}
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .study-page {
          min-height: 100vh;
          padding: 24px;
          background: var(--bg-primary);
        }

        .study-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .study-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 42px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .title-icon {
          font-size: 48px;
        }

        .page-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          margin: 0;
        }

        .new-session-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .new-session-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .btn-icon {
          font-size: 20px;
        }

        .study-content {
          margin-top: 32px;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 80px 24px;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid var(--border-color);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
        }

        .empty-state h2 {
          font-size: 24px;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .primary-btn {
          padding: 14px 28px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .pdfs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .pdf-card {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pdf-icon {
          font-size: 48px;
        }

        .pdf-info {
          flex: 1;
        }

        .pdf-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          word-break: break-word;
        }

        .pdf-meta {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .pdf-date {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .pdf-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .study-btn {
          background: var(--primary-color);
          color: white;
        }

        .study-btn:hover {
          background: var(--primary-hover);
        }

        .delete-btn {
          background: var(--secondary-bg);
          color: var(--text-secondary);
        }

        .delete-btn:hover {
          background: #f44336;
          color: white;
        }

        @media (max-width: 768px) {
          .study-page {
            padding: 16px;
          }

          .page-title {
            font-size: 32px;
          }

          .title-icon {
            font-size: 36px;
          }

          .pdfs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

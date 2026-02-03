/**
 * Chapter Selector Component
 * Allows users to select chapters/sections from PDF
 */
import { motion } from 'framer-motion';

export default function ChapterSelector({ chapters, selectedChapter, onSelect }) {
  if (!chapters || chapters.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="chapter-selector"
    >
      <h3 className="selector-title">Select Chapter or Section</h3>
      
      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <motion.button
            key={chapter.index}
            onClick={() => onSelect(chapter)}
            className={`chapter-card ${selectedChapter?.index === chapter.index ? 'selected' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="chapter-number">
              {chapter.index + 1}
            </div>
            <div className="chapter-info">
              <div className="chapter-title">{chapter.title}</div>
              <div className="chapter-page">Page {chapter.pageNumber}</div>
            </div>
            {selectedChapter?.index === chapter.index && (
              <div className="selected-indicator">✓</div>
            )}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .chapter-selector {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .selector-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 20px;
          text-align: center;
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .chapter-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .chapter-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chapter-card.selected {
          border-color: var(--primary-color);
          background: var(--primary-bg);
        }

        .chapter-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .chapter-info {
          flex: 1;
          text-align: left;
          overflow: hidden;
        }

        .chapter-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chapter-page {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .selected-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .chapters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}

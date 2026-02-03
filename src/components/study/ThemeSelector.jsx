/**
 * Theme Selector Component
 * Toggle between 3 study themes
 */
import { motion } from 'framer-motion';
import { THEMES } from '../../services/promptTemplates';

export default function ThemeSelector({ selectedTheme, onSelect }) {
  const themes = Object.values(THEMES);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="theme-selector"
    >
      <h3 className="selector-title">Choose Your Study Mode</h3>
      
      <div className="themes-grid">
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              '--theme-color': theme.color
            }}
          >
            <div className="theme-icon">{theme.icon}</div>
            <div className="theme-info">
              <div className="theme-name">{theme.name}</div>
              <div className="theme-description">{theme.description}</div>
            </div>
            {selectedTheme === theme.id && (
              <div className="selected-indicator">✓</div>
            )}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .theme-selector {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .selector-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 20px;
          text-align: center;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .theme-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 24px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          text-align: center;
        }

        .theme-card:hover {
          border-color: var(--theme-color);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .theme-card.selected {
          border-color: var(--theme-color);
          background: linear-gradient(135deg, var(--glass-bg) 0%, rgba(var(--theme-color), 0.1) 100%);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .theme-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .theme-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .theme-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .theme-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .selected-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          background: var(--theme-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .themes-grid {
            grid-template-columns: 1fr;
          }

          .theme-card {
            padding: 24px 20px;
          }

          .theme-icon {
            font-size: 40px;
          }
        }
      `}</style>
    </motion.div>
  );
}

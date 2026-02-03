/**
 * Loading Animation Component
 * Beautiful loading state during AI processing
 */
import { motion } from 'framer-motion';

export default function LoadingAnimation({ message = 'Generating study content...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-animation"
    >
      <div className="loading-content">
        <div className="spinner-container">
          <motion.div
            className="spinner"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </motion.div>
        </div>
        
        <motion.p
          className="loading-message"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>

        <div className="loading-steps">
          <motion.div
            className="step"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            ✓ Analyzing content
          </motion.div>
          <motion.div
            className="step"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            ⏳ Generating insights
          </motion.div>
          <motion.div
            className="step"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            📝 Formatting content
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .loading-animation {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 40px;
        }

        .loading-content {
          text-align: center;
          max-width: 400px;
        }

        .spinner-container {
          margin-bottom: 32px;
          display: flex;
          justify-content: center;
        }

        .spinner {
          width: 80px;
          height: 80px;
          position: relative;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .spinner-ring:nth-child(1) {
          animation-delay: -0.45s;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: -0.3s;
          border-top-color: var(--accent-color);
        }

        .spinner-ring:nth-child(3) {
          animation-delay: -0.15s;
          border-top-color: var(--secondary-color);
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-message {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 32px;
        }

        .loading-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step {
          font-size: 14px;
          color: var(--text-secondary);
          padding: 8px 16px;
          background: var(--glass-bg);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
          .loading-animation {
            min-height: 300px;
            padding: 24px;
          }

          .spinner {
            width: 60px;
            height: 60px;
          }

          .loading-message {
            font-size: 16px;
          }
        }
      `}</style>
    </motion.div>
  );
}

/**
 * Study Content Component
 * Displays AI-generated content with LaTeX rendering
 */
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function StudyContent({ content, theme, pdfName, chapterName }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && content) {
      renderLatex(contentRef.current);
    }
  }, [content]);

  const renderLatex = (element) => {
    // Render block LaTeX ($$...$$)
    element.innerHTML = element.innerHTML.replace(
      /\$\$(.*?)\$\$/gs,
      (match, formula) => {
        try {
          return `<div class="latex-block">${katex.renderToString(formula.trim(), {
            displayMode: true,
            throwOnError: false
          })}</div>`;
        } catch (err) {
          return match;
        }
      }
    );

    // Render inline LaTeX ($...$)
    element.innerHTML = element.innerHTML.replace(
      /\$([^\$]+)\$/g,
      (match, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: false,
            throwOnError: false
          });
        } catch (err) {
          return match;
        }
      }
    );
  };

  if (!content) {
    return null;
  }

  // Convert markdown-style headers to HTML
  const formattedContent = content
    .replace(/^# (.+)$/gm, '<h1 class="content-h1">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="content-h2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="content-h3">$1</h3>')
    .replace(/^\*\*(.+?)\*\*$/gm, '<strong>$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="study-content"
    >
      <div className="content-header">
        <div className="content-meta">
          <span className="meta-item">📄 {pdfName}</span>
          {chapterName && <span className="meta-item">📖 {chapterName}</span>}
        </div>
      </div>

      <div 
        ref={contentRef}
        className="content-body"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />

      <style jsx>{`
        .study-content {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid var(--border-color);
        }

        .content-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .content-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .meta-item {
          font-size: 14px;
          color: var(--text-secondary);
          padding: 6px 12px;
          background: var(--secondary-bg);
          border-radius: 8px;
        }

        .content-body {
          color: var(--text-primary);
          line-height: 1.8;
          font-size: 16px;
        }

        .content-body :global(.content-h1) {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 32px 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--primary-color);
        }

        .content-body :global(.content-h2) {
          font-size: 22px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 28px 0 12px 0;
        }

        .content-body :global(.content-h3) {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 20px 0 10px 0;
        }

        .content-body :global(strong) {
          font-weight: 600;
          color: var(--text-primary);
        }

        .content-body :global(ul) {
          margin: 16px 0;
          padding-left: 24px;
        }

        .content-body :global(li) {
          margin: 8px 0;
          line-height: 1.6;
        }

        .content-body :global(.latex-block) {
          margin: 24px 0;
          padding: 20px;
          background: var(--secondary-bg);
          border-radius: 8px;
          overflow-x: auto;
          text-align: center;
        }

        .content-body :global(.katex) {
          font-size: 1.1em;
        }

        .content-body :global(.katex-display) {
          margin: 16px 0;
        }

        @media (max-width: 768px) {
          .study-content {
            padding: 24px 20px;
          }

          .content-body {
            font-size: 15px;
          }

          .content-body :global(.content-h1) {
            font-size: 24px;
          }

          .content-body :global(.content-h2) {
            font-size: 20px;
          }

          .content-meta {
            flex-direction: column;
          }
        }
      `}</style>
    </motion.div>
  );
}

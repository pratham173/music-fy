/**
 * PDF Uploader Component
 * Drag-and-drop interface for PDF uploads
 */
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

export default function PDFUploader({ onUpload, loading }) {
  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      onUpload(pdfFile);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: loading
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pdf-uploader"
    >
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="dropzone-content">
          {loading ? (
            <>
              <div className="upload-icon loading-icon">⏳</div>
              <p className="upload-text">Processing PDF...</p>
              <p className="upload-subtext">Extracting text and chapters</p>
            </>
          ) : isDragActive ? (
            <>
              <div className="upload-icon active-icon">📄</div>
              <p className="upload-text">Drop your PDF here</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📚</div>
              <p className="upload-text">Drop a PDF here</p>
              <p className="upload-subtext">or click to browse</p>
              <div className="upload-formats">
                Supported: PDF files only
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .pdf-uploader {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .dropzone {
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
        }

        .dropzone:hover:not(.loading) {
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .dropzone.active {
          border-color: var(--primary-color);
          background: var(--primary-bg);
        }

        .dropzone.loading {
          cursor: wait;
          opacity: 0.7;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-icon {
          font-size: 64px;
          margin-bottom: 8px;
          transition: transform 0.3s ease;
        }

        .dropzone:hover .upload-icon:not(.loading-icon) {
          transform: scale(1.1);
        }

        .loading-icon {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .upload-text {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .upload-subtext {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .upload-formats {
          font-size: 12px;
          color: var(--text-tertiary);
          margin-top: 16px;
          padding: 8px 16px;
          background: var(--secondary-bg);
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .dropzone {
            padding: 40px 24px;
          }

          .upload-icon {
            font-size: 48px;
          }

          .upload-text {
            font-size: 18px;
          }
        }
      `}</style>
    </motion.div>
  );
}

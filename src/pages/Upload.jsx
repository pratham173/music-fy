/**
 * Upload Page
 * PDF upload and chapter/theme selection
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PDFUploader from '../components/study/PDFUploader';
import ChapterSelector from '../components/study/ChapterSelector';
import ThemeSelector from '../components/study/ThemeSelector';
import { usePDF } from '../hooks/usePDF';
import { getOptimalChunk } from '../services/chunkingService';

export default function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { uploadAndParse, loadPDF, extractChapter, pdfData, loading } = usePDF();
  
  const [step, setStep] = useState(1); // 1: Upload, 2: Chapter, 3: Theme
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('exam_cram');

  useEffect(() => {
    // Check if we're loading an existing PDF
    const pdfId = searchParams.get('pdfId');
    if (pdfId) {
      loadExistingPDF(parseInt(pdfId));
    }
  }, [searchParams]);

  const loadExistingPDF = async (pdfId) => {
    try {
      await loadPDF(pdfId);
      setStep(2); // Skip to chapter selection
    } catch (err) {
      console.error('Error loading PDF:', err);
      navigate('/study');
    }
  };

  const handlePDFUpload = async (file) => {
    try {
      await uploadAndParse(file);
      setStep(2);
    } catch (err) {
      alert('Failed to upload PDF: ' + err.message);
    }
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setStep(3);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handleGenerate = async () => {
    if (!pdfData || !selectedChapter) {
      alert('Please select a chapter');
      return;
    }

    // Extract chapter text
    let chapterText = '';
    
    if (selectedChapter.pageNumber && pdfData.file) {
      // Extract specific pages for this chapter
      const nextChapter = pdfData.chapters[selectedChapter.index + 1];
      const endPage = nextChapter ? nextChapter.pageNumber - 1 : pdfData.numPages;
      
      try {
        chapterText = await extractChapter(
          pdfData.file,
          selectedChapter.pageNumber,
          endPage
        );
      } catch (err) {
        console.error('Error extracting chapter:', err);
        alert('Failed to extract chapter text');
        return;
      }
    } else {
      // Fallback: use full text and chunk it
      chapterText = getOptimalChunk(pdfData.text);
    }

    // Navigate to results page with data
    navigate('/results', {
      state: {
        pdfName: pdfData.name,
        chapterName: selectedChapter.title,
        chapterText,
        theme: selectedTheme,
        pdfId: pdfData.id
      }
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/study');
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <header className="upload-header">
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Upload</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Chapter</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Theme</span>
            </div>
          </div>
        </header>

        <div className="upload-content">
          {step === 1 && (
            <PDFUploader onUpload={handlePDFUpload} loading={loading} />
          )}

          {step === 2 && pdfData && (
            <ChapterSelector
              chapters={pdfData.chapters}
              selectedChapter={selectedChapter}
              onSelect={handleChapterSelect}
            />
          )}

          {step === 3 && (
            <>
              <ThemeSelector
                selectedTheme={selectedTheme}
                onSelect={handleThemeSelect}
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="generate-section"
              >
                <button
                  onClick={handleGenerate}
                  className="generate-btn"
                  disabled={!selectedChapter}
                >
                  Generate Study Content ✨
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .upload-page {
          min-height: 100vh;
          padding: 24px;
          background: var(--bg-primary);
        }

        .upload-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .upload-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 24px;
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

        .progress-steps {
          display: flex;
          gap: 32px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.4;
          transition: opacity 0.3s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          font-weight: 700;
          color: var(--text-primary);
        }

        .step.active .step-number {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .step-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .upload-content {
          margin-top: 32px;
        }

        .generate-section {
          margin-top: 48px;
          text-align: center;
        }

        .generate-btn {
          padding: 16px 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .upload-page {
            padding: 16px;
          }

          .upload-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .progress-steps {
            width: 100%;
            justify-content: space-between;
            gap: 12px;
          }

          .step-label {
            display: none;
          }

          .generate-btn {
            width: 100%;
            padding: 14px 32px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Custom hook for PDF handling
 */
import { useState } from 'react';
import { extractTextFromPDF, extractTextFromPages } from '../services/pdfParser';
import { savePDF, getPDF, getAllPDFs, deletePDF } from '../services/indexedDB';

export function usePDF() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [savedPDFs, setSavedPDFs] = useState([]);

  const uploadAndParse = async (file) => {
    setLoading(true);
    setError(null);

    try {
      // Extract text and chapters from PDF
      const extracted = await extractTextFromPDF(file);
      
      // Save PDF to IndexedDB
      const saved = await savePDF(file, {
        text: extracted.text,
        numPages: extracted.numPages,
        chapters: extracted.chapters
      });

      setPdfData({
        id: saved.id,
        name: file.name,
        text: extracted.text,
        numPages: extracted.numPages,
        chapters: extracted.chapters,
        file: file
      });

      return saved;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const extractChapter = async (file, startPage, endPage) => {
    setLoading(true);
    setError(null);

    try {
      const text = await extractTextFromPages(file, startPage, endPage);
      return text;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadPDF = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const pdf = await getPDF(id);
      setPdfData(pdf);
      return pdf;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadAllPDFs = async () => {
    setLoading(true);
    setError(null);

    try {
      const pdfs = await getAllPDFs();
      setSavedPDFs(pdfs);
      return pdfs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePDF = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deletePDF(id);
      setSavedPDFs(prev => prev.filter(pdf => pdf.id !== id));
      if (pdfData?.id === id) {
        setPdfData(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAndParse,
    extractChapter,
    loadPDF,
    loadAllPDFs,
    removePDF,
    loading,
    error,
    pdfData,
    savedPDFs
  };
}

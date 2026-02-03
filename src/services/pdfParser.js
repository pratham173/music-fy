/**
 * PDF Parser Service
 * Uses pdfjs-dist to extract text from PDF files
 */
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

/**
 * Extract text from a PDF file
 * @param {File} file - PDF file object
 * @returns {Promise<{text: string, numPages: number, chapters: Array}>}
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const chapters = [];
    const numPages = pdf.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      
      fullText += pageText + '\n\n';
      
      // Detect chapter headings (simple heuristic: lines with all caps or starting with "Chapter")
      const lines = pageText.split('\n');
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (
          trimmed.length > 5 && 
          trimmed.length < 100 &&
          (trimmed === trimmed.toUpperCase() || 
           trimmed.match(/^(Chapter|CHAPTER|Section|SECTION)\s+\d+/))
        ) {
          chapters.push({
            title: trimmed,
            pageNumber: i,
            index: chapters.length
          });
        }
      });
    }
    
    // If no chapters detected, create default chapters by page ranges
    if (chapters.length === 0) {
      const pagesPerChapter = Math.max(5, Math.ceil(numPages / 10));
      for (let i = 0; i < numPages; i += pagesPerChapter) {
        const endPage = Math.min(i + pagesPerChapter, numPages);
        chapters.push({
          title: `Pages ${i + 1}-${endPage}`,
          pageNumber: i + 1,
          index: chapters.length
        });
      }
    }
    
    return {
      text: fullText,
      numPages,
      chapters
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF. Please ensure the file is a valid PDF.');
  }
}

/**
 * Extract text from a specific page range
 * @param {File} file - PDF file object
 * @param {number} startPage - Starting page (1-indexed)
 * @param {number} endPage - Ending page (1-indexed)
 * @returns {Promise<string>}
 */
export async function extractTextFromPages(file, startPage, endPage) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    const start = Math.max(1, startPage);
    const end = Math.min(endPage, pdf.numPages);
    
    for (let i = start; i <= end; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      text += pageText + '\n\n';
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from pages:', error);
    throw new Error('Failed to extract text from specified pages.');
  }
}

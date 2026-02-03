/**
 * Text Chunking Service
 * Splits large documents into manageable chunks for AI processing
 */

const MAX_CHUNK_SIZE = 8000; // Characters per chunk (safe for most AI models)

/**
 * Split text into chunks by size
 * @param {string} text - Text to chunk
 * @param {number} maxSize - Maximum characters per chunk
 * @returns {Array<string>}
 */
export function chunkBySize(text, maxSize = MAX_CHUNK_SIZE) {
  const chunks = [];
  let currentChunk = '';
  
  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph exceeds max size, save current chunk
    if (currentChunk.length + paragraph.length > maxSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    
    // If a single paragraph is too large, split it by sentences
    if (paragraph.length > maxSize) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        currentChunk += sentence + ' ';
      }
    } else {
      currentChunk += paragraph + '\n\n';
    }
  }
  
  // Add remaining chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Smart chunking by headers/sections
 * @param {string} text - Text to chunk
 * @returns {Array<{title: string, content: string}>}
 */
export function chunkByHeaders(text) {
  const chunks = [];
  const lines = text.split('\n');
  let currentChunk = { title: 'Introduction', content: '' };
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect headers (all caps, or starts with Chapter/Section)
    if (
      trimmed.length > 5 && 
      trimmed.length < 100 &&
      (trimmed === trimmed.toUpperCase() || 
       trimmed.match(/^(Chapter|CHAPTER|Section|SECTION)\s+\d+/))
    ) {
      // Save previous chunk if it has content
      if (currentChunk.content.trim().length > 0) {
        chunks.push(currentChunk);
      }
      
      // Start new chunk
      currentChunk = { title: trimmed, content: '' };
    } else {
      currentChunk.content += line + '\n';
    }
  }
  
  // Add final chunk
  if (currentChunk.content.trim().length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Get optimal chunk for AI processing
 * @param {string} text - Full text
 * @param {number} targetSize - Target chunk size
 * @returns {string} - Optimally sized chunk
 */
export function getOptimalChunk(text, targetSize = MAX_CHUNK_SIZE) {
  if (text.length <= targetSize) {
    return text;
  }
  
  // Try to find a natural break point
  const substring = text.substring(0, targetSize);
  const lastParagraph = substring.lastIndexOf('\n\n');
  const lastSentence = substring.lastIndexOf('.');
  
  if (lastParagraph > targetSize * 0.7) {
    return text.substring(0, lastParagraph);
  } else if (lastSentence > targetSize * 0.7) {
    return text.substring(0, lastSentence + 1);
  }
  
  return substring;
}

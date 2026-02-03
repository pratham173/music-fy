/**
 * IndexedDB Service for offline storage
 */
import { openDB } from 'idb';

const DB_NAME = 'StudyFlowDB';
const DB_VERSION = 1;

/**
 * Initialize IndexedDB
 */
export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store for uploaded PDFs
      if (!db.objectStoreNames.contains('pdfs')) {
        const pdfStore = db.createObjectStore('pdfs', { keyPath: 'id', autoIncrement: true });
        pdfStore.createIndex('name', 'name');
        pdfStore.createIndex('uploadDate', 'uploadDate');
      }

      // Store for generated study content
      if (!db.objectStoreNames.contains('studyContent')) {
        const contentStore = db.createObjectStore('studyContent', { keyPath: 'id', autoIncrement: true });
        contentStore.createIndex('pdfId', 'pdfId');
        contentStore.createIndex('theme', 'theme');
        contentStore.createIndex('createdAt', 'createdAt');
      }

      // Store for user preferences
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }
    }
  });

  return db;
}

/**
 * Save PDF to IndexedDB
 */
export async function savePDF(pdfFile, metadata = {}) {
  const db = await initDB();
  
  const pdfData = {
    name: pdfFile.name,
    size: pdfFile.size,
    type: pdfFile.type,
    file: pdfFile,
    uploadDate: new Date().toISOString(),
    ...metadata
  };

  const id = await db.add('pdfs', pdfData);
  return { id, ...pdfData };
}

/**
 * Get PDF from IndexedDB
 */
export async function getPDF(id) {
  const db = await initDB();
  return await db.get('pdfs', id);
}

/**
 * Get all PDFs
 */
export async function getAllPDFs() {
  const db = await initDB();
  return await db.getAll('pdfs');
}

/**
 * Delete PDF
 */
export async function deletePDF(id) {
  const db = await initDB();
  await db.delete('pdfs', id);
  
  // Also delete associated study content
  const content = await db.getAllFromIndex('studyContent', 'pdfId', id);
  for (const item of content) {
    await db.delete('studyContent', item.id);
  }
}

/**
 * Save study content
 */
export async function saveStudyContent(content) {
  const db = await initDB();
  
  const contentData = {
    ...content,
    createdAt: new Date().toISOString()
  };

  const id = await db.add('studyContent', contentData);
  return { id, ...contentData };
}

/**
 * Get study content by ID
 */
export async function getStudyContent(id) {
  const db = await initDB();
  return await db.get('studyContent', id);
}

/**
 * Get study content by PDF ID
 */
export async function getStudyContentByPDF(pdfId) {
  const db = await initDB();
  return await db.getAllFromIndex('studyContent', 'pdfId', pdfId);
}

/**
 * Get study content by theme
 */
export async function getStudyContentByTheme(theme) {
  const db = await initDB();
  return await db.getAllFromIndex('studyContent', 'theme', theme);
}

/**
 * Delete study content
 */
export async function deleteStudyContent(id) {
  const db = await initDB();
  await db.delete('studyContent', id);
}

/**
 * Save user preference
 */
export async function savePreference(key, value) {
  const db = await initDB();
  await db.put('preferences', { key, value });
}

/**
 * Get user preference
 */
export async function getPreference(key) {
  const db = await initDB();
  const result = await db.get('preferences', key);
  return result?.value;
}

/**
 * Get all preferences
 */
export async function getAllPreferences() {
  const db = await initDB();
  const prefs = await db.getAll('preferences');
  return prefs.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}

// Cloudinary file mapping utility
// This maps local file paths to actual Cloudinary URLs

// Server-side data loading
let serverSideUploads = null;
let serverSideRawUploads = null;

// Client-side data cache
let clientSideUploads = null;
let clientSideRawUploads = null;
let isLoading = false;
let loadPromise = null;

// Load server-side data
if (typeof window === 'undefined') {
  try {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const filePath = join(process.cwd(), 'cloudinary-uploads.json');
    const rawFilePath = join(process.cwd(), 'cloudinary-raw-uploads.json');
    
    const fileContent = readFileSync(filePath, 'utf8');
    serverSideUploads = JSON.parse(fileContent);
    
    if (require('fs').existsSync(rawFilePath)) {
      const rawFileContent = readFileSync(rawFilePath, 'utf8');
      serverSideRawUploads = JSON.parse(rawFileContent);
    }
  } catch (error) {
    console.error('Error loading server-side uploads data:', error);
    serverSideUploads = [];
    serverSideRawUploads = [];
  }
}

/**
 * Load client-side uploads data from API
 */
export async function loadClientSideUploads() {
  if (typeof window !== 'undefined') {
    // If already loading, return the existing promise
    if (isLoading && loadPromise) {
      return loadPromise;
    }
    
    // If already loaded, return immediately
    if (clientSideUploads && clientSideRawUploads) {
      return { regular: clientSideUploads, raw: clientSideRawUploads };
    }
    
    // Start loading
    isLoading = true;
    loadPromise = (async () => {
      try {
        const response = await fetch('/api/cloudinary-uploads');
        if (response.ok) {
          const data = await response.json();
          clientSideUploads = data.regular || [];
          clientSideRawUploads = data.raw || [];
          return { regular: clientSideUploads, raw: clientSideRawUploads };
        } else {
          return null;
        }
      } catch (error) {
        return null;
      } finally {
        isLoading = false;
        loadPromise = null;
      }
    })();
    
    return loadPromise;
  }
  return { regular: clientSideUploads || [], raw: clientSideRawUploads || [] };
}

/**
 * Ensure client-side data is loaded (for use in components)
 */
export async function ensureClientSideDataLoaded() {
  if (typeof window !== 'undefined') {
    return await loadClientSideUploads();
  }
  return null;
}

/**
 * Get the actual Cloudinary URL for a local file path
 * @param {string} localPath - Local file path (e.g., '/communities/dubai-creek-harbour/albero/BROCHURE/ALBERO_DCH_BROCHURE.pdf')
 * @returns {string|null} - The actual Cloudinary URL or null if not found
 */
export function getActualCloudinaryUrl(localPath) {
  // Use server-side data if available, otherwise use client-side cache
  let uploads, rawUploads;
  
  if (typeof window === 'undefined') {
    uploads = serverSideUploads || [];
    rawUploads = serverSideRawUploads || [];
  } else {
    uploads = clientSideUploads || [];
    rawUploads = clientSideRawUploads || [];
  }
  
  // Remove leading slash and normalize path separators
  const normalizedPath = localPath.replace(/^\//, '').replace(/\//g, '\\');
  
  // Remove 'communities/' prefix if present since the JSON doesn't include it
  const pathWithoutCommunities = normalizedPath.replace(/^communities\\/, '');
  
  // First check for raw PDF uploads (complete multi-page PDFs)
  const rawUploadResult = rawUploads.find(upload => 
    upload.localPath.toLowerCase() === pathWithoutCommunities.toLowerCase()
  );
  
  if (rawUploadResult) {
    return rawUploadResult.url;
  }
  
  // Fallback to regular uploads (converted images)
  const uploadResult = uploads.find(upload => 
    upload.localPath.toLowerCase() === pathWithoutCommunities.toLowerCase()
  );
  
  return uploadResult ? uploadResult.url : null;
}

/**
 * Get all available files for a specific community and sub-community
 * @param {string} community - Community name
 * @param {string} subCommunity - Sub-community name
 * @returns {object} - Object with brochures, floorplans, and images arrays
 */
export function getCommunityFiles(community, subCommunity) {
  const communityPath = `${community}\\${subCommunity}`;
  const uploads = typeof window === 'undefined' ? serverSideUploads : (clientSideUploads || []);
  
  const files = uploads.filter(upload => 
    upload.localPath.toLowerCase().includes(communityPath.toLowerCase())
  );
  
  const result = {
    brochures: [],
    floorplans: [],
    images: []
  };
  
  files.forEach(file => {
    const localPath = file.localPath.toLowerCase();
    if (localPath.includes('\\brochure\\')) {
      result.brochures.push({
        name: file.localPath.split('\\').pop(),
        url: file.url,
        size: file.size
      });
    } else if (localPath.includes('\\floorplans\\')) {
      result.floorplans.push({
        name: file.localPath.split('\\').pop(),
        url: file.url,
        size: file.size
      });
    } else if (localPath.includes('\\images\\')) {
      result.images.push({
        name: file.localPath.split('\\').pop(),
        url: file.url,
        size: file.size
      });
    }
  });
  
  return result;
}

/**
 * Check if a file exists in Cloudinary
 * @param {string} localPath - Local file path
 * @returns {boolean} - Whether the file exists in Cloudinary
 */
export function fileExistsInCloudinary(localPath) {
  return getActualCloudinaryUrl(localPath) !== null;
}

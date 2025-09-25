// Cloudinary utility functions

const CLOUD_NAME = 'dfdxba7yz';
const BASE_FOLDER = 'emaar-map/communities';

/**
 * Generate Cloudinary URL for a file
 * @param {string} publicId - The public ID of the file in Cloudinary
 * @param {object} options - Cloudinary transformation options
 * @returns {string} - The complete Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };

  const transformations = Object.entries(defaultOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  // If there are transformations, include them, otherwise use the direct URL
  if (transformations) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
  } else {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;
  }
}

/**
 * Get the public ID for a community file
 * @param {string} community - Community name (e.g., 'dubai-creek-harbour')
 * @param {string} subCommunity - Sub-community name (e.g., 'albero')
 * @param {string} type - File type ('BROCHURE', 'FLOORPLANS', 'IMAGES')
 * @param {string} filename - File name without extension
 * @returns {string} - The public ID
 */
export function getCommunityFilePublicId(community, subCommunity, type, filename) {
  return `${BASE_FOLDER}/${community}/${subCommunity}/${type.toLowerCase()}/${filename}`.toLowerCase();
}

/**
 * Convert local file path to Cloudinary URL
 * @param {string} localPath - Local file path (e.g., '/communities/dubai-creek-harbour/albero/BROCHURE/ALBERO_DCH_BROCHURE.pdf')
 * @param {object} options - Cloudinary transformation options
 * @returns {string} - The Cloudinary URL
 */
export function convertLocalPathToCloudinaryUrl(localPath, options = {}) {
  // Remove leading slash and convert to lowercase
  const cleanPath = localPath.replace(/^\//, '').toLowerCase();
  
  // Remove file extension for public ID
  const pathWithoutExt = cleanPath.replace(/\.[^/.]+$/, '');
  
  // Add the emaar-map prefix to match Cloudinary structure
  const publicId = `emaar-map/${pathWithoutExt}`;
  
  // For PDFs, Cloudinary converts them to JPG, so we need to specify the format
  const originalExt = localPath.split('.').pop().toLowerCase();
  if (originalExt === 'pdf') {
    options.format = 'jpg';
  }
  
  return getCloudinaryUrl(publicId, options);
}

/**
 * Get Cloudinary URL for a community brochure
 * @param {string} community - Community name
 * @param {string} subCommunity - Sub-community name
 * @param {string} filename - File name without extension
 * @returns {string} - The Cloudinary URL
 */
export function getBrochureUrl(community, subCommunity, filename) {
  const publicId = getCommunityFilePublicId(community, subCommunity, 'BROCHURE', filename);
  return getCloudinaryUrl(publicId, { format: 'pdf' });
}

/**
 * Get Cloudinary URL for a community floor plan
 * @param {string} community - Community name
 * @param {string} subCommunity - Sub-community name
 * @param {string} filename - File name without extension
 * @returns {string} - The Cloudinary URL
 */
export function getFloorPlanUrl(community, subCommunity, filename) {
  const publicId = getCommunityFilePublicId(community, subCommunity, 'FLOORPLANS', filename);
  return getCloudinaryUrl(publicId, { format: 'pdf' });
}

/**
 * Get Cloudinary URL for a community image
 * @param {string} community - Community name
 * @param {string} subCommunity - Sub-community name
 * @param {string} filename - File name without extension
 * @param {object} options - Image transformation options
 * @returns {string} - The Cloudinary URL
 */
export function getImageUrl(community, subCommunity, filename, options = {}) {
  const publicId = getCommunityFilePublicId(community, subCommunity, 'IMAGES', filename);
  return getCloudinaryUrl(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  });
}

/**
 * Get optimized image URL with specific dimensions
 * @param {string} community - Community name
 * @param {string} subCommunity - Sub-community name
 * @param {string} filename - File name without extension
 * @param {number} width - Image width
 * @param {number} height - Image height (optional)
 * @param {object} additionalOptions - Additional transformation options
 * @returns {string} - The optimized Cloudinary URL
 */
export function getOptimizedImageUrl(community, subCommunity, filename, width, height = null, additionalOptions = {}) {
  const publicId = getCommunityFilePublicId(community, subCommunity, 'IMAGES', filename);
  
  const options = {
    width,
    quality: 'auto',
    fetch_format: 'auto',
    ...additionalOptions
  };
  
  if (height) {
    options.height = height;
  }
  
  return getCloudinaryUrl(publicId, options);
}

/**
 * Get responsive image URLs for different screen sizes
 * @param {string} community - Community name
 * @param {string} subCommunity - Sub-community name
 * @param {string} filename - File name without extension
 * @returns {object} - Object with different size URLs
 */
export function getResponsiveImageUrls(community, subCommunity, filename) {
  const publicId = getCommunityFilePublicId(community, subCommunity, 'IMAGES', filename);
  
  return {
    thumbnail: getCloudinaryUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
    small: getCloudinaryUrl(publicId, { width: 400, quality: 'auto' }),
    medium: getCloudinaryUrl(publicId, { width: 800, quality: 'auto' }),
    large: getCloudinaryUrl(publicId, { width: 1200, quality: 'auto' }),
    original: getCloudinaryUrl(publicId, { quality: 'auto' })
  };
}

/**
 * Check if a file exists in Cloudinary (basic check by trying to access the URL)
 * @param {string} url - The Cloudinary URL to check
 * @returns {Promise<boolean>} - Whether the file exists
 */
export async function checkFileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

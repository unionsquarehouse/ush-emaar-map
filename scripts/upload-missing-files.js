const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Configure Cloudinary
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.log('❌ Missing Cloudinary credentials!');
  console.log('   Please set in .env.local:');
  console.log('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('   CLOUDINARY_API_KEY=your_api_key');
  console.log('   CLOUDINARY_API_SECRET=your_api_secret');
  process.exit(1);
}

console.log(`🔧 Using Cloudinary credentials:`);
console.log(`   Cloud Name: ${CLOUD_NAME}`);
console.log(`   API Key: ${API_KEY.substring(0, 8)}...`);
console.log(`   API Secret: ${API_SECRET.substring(0, 8)}...`);
console.log('');

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

// Configuration
const config = {
  resource_type: 'auto',
  overwrite: true,
  use_filename: true,
  unique_filename: false,
  quality: 'auto',
  fetch_format: 'auto',
  pages: false,
};

// Load existing uploads to check what's already uploaded
function loadExistingUploads() {
  try {
    const uploadsPath = path.join(__dirname, '..', 'cloudinary-uploads.json');
    if (fs.existsSync(uploadsPath)) {
      const data = fs.readFileSync(uploadsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️  Could not load existing uploads, will upload all files');
  }
  return [];
}

// Find files that need to be uploaded (only brochures and floor plans)
function findMissingFiles(dir) {
  let files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        // Only include brochures and floor plans
        const dirName = path.basename(currentDir).toLowerCase();
        if (dirName === 'brochure' || dirName === 'floorplans') {
          files.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Generate public ID from file path
function generatePublicId(filePath) {
  // Convert to relative path from communities directory
  const relativePath = path.relative(path.join(__dirname, '..', 'public', 'communities'), filePath);
  
  // Normalize path separators and convert to lowercase
  const normalizedPath = relativePath.replace(/\\/g, '/').toLowerCase();
  
  // Remove file extension
  const withoutExt = normalizedPath.replace(/\.[^/.]+$/, '');
  
  // Create public ID with emaar-map prefix
  return `emaar-map/communities/${withoutExt}`;
}

// Compress large files before upload
async function compressLargeFile(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  
  console.log(`📊 File size: ${path.basename(filePath)} - ${fileSizeInMB.toFixed(2)}MB`);
  
  if (fileSizeInMB > 10) {
    console.log(`⚠️  Large file detected: ${path.basename(filePath)} (${fileSizeInMB.toFixed(2)}MB > 10MB limit)`);
    
    const sharp = require('sharp');
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Compress images
      console.log(`📦 Compressing image: ${path.basename(filePath)}`);
      const outputPath = filePath.replace(ext, '_compressed' + ext);
      
      try {
        await sharp(filePath)
          .jpeg({ quality: 70, progressive: true })
          .png({ quality: 70, progressive: true })
          .toFile(outputPath);
        
        const compressedStats = fs.statSync(outputPath);
        const compressedSizeInMB = compressedStats.size / (1024 * 1024);
        console.log(`✅ Compressed: ${fileSizeInMB.toFixed(2)}MB -> ${compressedSizeInMB.toFixed(2)}MB`);
        
        // Check if still too large
        if (compressedSizeInMB > 10) {
          console.log(`⚠️  Still too large after compression, trying more aggressive compression...`);
          const aggressivePath = filePath.replace(ext, '_aggressive' + ext);
          await sharp(filePath)
            .jpeg({ quality: 30, progressive: true })
            .png({ quality: 30, progressive: true })
            .toFile(aggressivePath);
          
          const aggressiveStats = fs.statSync(aggressivePath);
          const aggressiveSizeInMB = aggressiveStats.size / (1024 * 1024);
          console.log(`✅ Aggressive compression: ${fileSizeInMB.toFixed(2)}MB -> ${aggressiveSizeInMB.toFixed(2)}MB`);
          
          // Clean up first attempt
          fs.unlinkSync(outputPath);
          return aggressivePath;
        }
        
        return outputPath;
      } catch (error) {
        console.error(`❌ Failed to compress image: ${error.message}`);
        return filePath; // Return original if compression fails
      }
    } else if (ext === '.pdf') {
      console.log(`❌ PDF file ${path.basename(filePath)} is ${fileSizeInMB.toFixed(2)}MB - Cloudinary has 10MB limit for PDFs`);
      console.log(`💡 Consider compressing the PDF manually or splitting it into smaller files`);
      return null; // Skip this file
    }
  }
  
  return filePath;
}

// Upload file to Cloudinary
async function uploadFile(filePath, existingUploads) {
  const publicId = generatePublicId(filePath);
  
  // Check if file is already uploaded
  const alreadyUploaded = existingUploads.find(upload => 
    upload.publicId === publicId || 
    upload.localPath === path.relative(path.join(__dirname, '..', 'public', 'communities'), filePath).replace(/\\/g, '\\')
  );
  
  if (alreadyUploaded) {
    console.log(`⏭️  Skipping already uploaded: ${path.basename(filePath)}`);
    return alreadyUploaded;
  }
  
  try {
    console.log(`📤 Uploading: ${path.basename(filePath)}`);
    
    // Compress if needed
    const fileToUpload = await compressLargeFile(filePath);
    
    // Skip if compression failed or file is too large
    if (!fileToUpload) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} - too large or compression failed`);
      return null;
    }
    
    // Check final file size before upload
    const finalStats = fs.statSync(fileToUpload);
    const finalSizeInMB = finalStats.size / (1024 * 1024);
    
    if (finalSizeInMB > 10) {
      console.log(`❌ File still too large after compression: ${path.basename(filePath)} (${finalSizeInMB.toFixed(2)}MB)`);
      // Clean up compressed file
      if (fileToUpload !== filePath) {
        fs.unlinkSync(fileToUpload);
      }
      return null;
    }
    
    console.log(`📤 Final size: ${finalSizeInMB.toFixed(2)}MB - proceeding with upload`);
    
    const result = await cloudinary.uploader.upload(fileToUpload, {
      ...config,
      public_id: publicId,
    });
    
    // Clean up compressed file if it was created
    if (fileToUpload !== filePath) {
      fs.unlinkSync(fileToUpload);
    }
    
    const uploadResult = {
      localPath: path.relative(path.join(__dirname, '..', 'public', 'communities'), filePath).replace(/\\/g, '\\'),
      publicId: result.public_id,
      url: result.secure_url,
      size: result.bytes,
      format: result.format
    };
    
    console.log(`✅ Uploaded successfully: ${path.basename(filePath)}`);
    console.log(`   📊 Size: ${(result.bytes / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`   🔗 URL: ${result.secure_url}`);
    return uploadResult;
    
  } catch (error) {
    console.error(`❌ Failed to upload ${path.basename(filePath)}:`, error.message);
    
    // Clean up compressed file if it was created
    try {
      if (fileToUpload && fileToUpload !== filePath) {
        fs.unlinkSync(fileToUpload);
      }
    } catch (cleanupError) {
      console.error(`⚠️  Could not clean up compressed file: ${cleanupError.message}`);
    }
    
    return null;
  }
}

// Main upload function
async function uploadMissingFiles() {
  const communitiesDir = path.join(__dirname, '..', 'public', 'communities');
  
  if (!fs.existsSync(communitiesDir)) {
    console.log('❌ Communities directory not found!');
    return;
  }
  
  console.log('🔍 Loading existing uploads...');
  const existingUploads = loadExistingUploads();
  console.log(`📊 Found ${existingUploads.length} existing uploads`);
  
  console.log('🔍 Finding missing brochures and floor plans...');
  const filesToUpload = findMissingFiles(communitiesDir);
  console.log(`📋 Found ${filesToUpload.length} brochures and floor plans to check`);
  
  const uploadResults = [];
  let uploadedCount = 0;
  let skippedCount = 0;
  
  for (const filePath of filesToUpload) {
    const result = await uploadFile(filePath, existingUploads);
    if (result) {
      if (result.url) {
        uploadResults.push(result);
        uploadedCount++;
      } else {
        skippedCount++;
      }
    }
  }
  
  // Merge with existing uploads
  const allUploads = [...existingUploads, ...uploadResults];
  
  // Save updated uploads
  const uploadsPath = path.join(__dirname, '..', 'cloudinary-uploads.json');
  fs.writeFileSync(uploadsPath, JSON.stringify(allUploads, null, 2));
  
  console.log('');
  console.log('🎉 Upload complete!');
  console.log(`📤 Successfully uploaded: ${uploadedCount} new files`);
  console.log(`⏭️  Skipped (already uploaded): ${skippedCount} files`);
  console.log(`❌ Failed/Skipped (too large): ${filesToUpload.length - uploadedCount - skippedCount} files`);
  console.log(`📊 Total files in mapping: ${allUploads.length}`);
  console.log(`💾 Updated: cloudinary-uploads.json`);
  
  if (uploadedCount > 0) {
    console.log('');
    console.log('📋 Newly uploaded files:');
    uploadResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.localPath.split('\\').pop()} (${(result.size / (1024 * 1024)).toFixed(2)}MB)`);
    });
  }
}

// Run the upload
uploadMissingFiles().catch(console.error);

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
  // Upload settings
  resource_type: 'auto', // Automatically detect file type
  overwrite: true, // Overwrite existing files
  use_filename: true, // Use original filename
  unique_filename: false, // Don't add random suffix
  // Image optimization
  quality: 'auto',
  fetch_format: 'auto',
  // PDF settings
  pages: false, // Don't extract pages from PDFs
};

// Find all files in communities directory
function findCommunityFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(findCommunityFiles(fullPath));
    } else if (/\.(jpg|jpeg|png|svg|pdf)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Compress large files before upload
async function compressLargeFile(filePath) {
  const fileSize = getFileSize(filePath);
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  
  if (fileSize <= maxSize) {
    return filePath; // No compression needed
  }
  
  console.log(`   📦 File is ${formatBytes(fileSize)} (larger than 50MB), compressing...`);
  
  try {
    const sharp = require('sharp');
    const path = require('path');
    const fs = require('fs');
    
    const ext = path.extname(filePath).toLowerCase();
    const tempPath = filePath + '.compressed';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ 
          quality: 70,
          progressive: true,
          mozjpeg: true
        })
        .toFile(tempPath);
    } else if (ext === '.png') {
      await sharp(filePath)
        .png({ 
          quality: 70,
          compressionLevel: 9
        })
        .toFile(tempPath);
    } else if (ext === '.pdf') {
      // For PDFs, we'll try to use the original file first
      // If it fails due to size, we'll need a different approach
      return filePath;
    } else {
      // For other formats, return original
      return filePath;
    }
    
    const compressedSize = getFileSize(tempPath);
    console.log(`   ✅ Compressed to ${formatBytes(compressedSize)} (${((compressedSize / fileSize) * 100).toFixed(1)}% of original)`);
    
    return tempPath;
  } catch (error) {
    console.log(`   ⚠️  Compression failed: ${error.message}, using original file`);
    return filePath;
  }
}

// Upload single file to Cloudinary
async function uploadFile(filePath, publicId) {
  try {
    // Check file size and compress if needed
    const fileToUpload = await compressLargeFile(filePath);
    
    const result = await cloudinary.uploader.upload(fileToUpload, {
      ...config,
      public_id: publicId,
    });
    
    // Clean up compressed temporary file if it was created
    if (fileToUpload !== filePath && fileToUpload.endsWith('.compressed')) {
      try {
        fs.unlinkSync(fileToUpload);
      } catch (cleanupError) {
        console.log(`   ⚠️  Could not delete temporary file: ${cleanupError.message}`);
      }
    }
    
    return {
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      bytes: result.bytes,
      format: result.format
    };
  } catch (error) {
    // Clean up compressed temporary file if it was created
    if (filePath.endsWith('.compressed')) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate public ID from file path
function generatePublicId(filePath, communitiesDir) {
  // Remove the communities directory path and file extension
  const relativePath = path.relative(communitiesDir, filePath);
  const pathWithoutExt = relativePath.replace(/\.[^/.]+$/, '');
  
  // Convert to Cloudinary-friendly format and maintain exact folder structure
  return `emaar-map/communities/${pathWithoutExt.replace(/\\/g, '/')}`;
}

async function main() {
  try {
    const communitiesDir = path.join(__dirname, '..', 'public', 'communities');
    
    // Check if communities directory exists
    if (!fs.existsSync(communitiesDir)) {
      console.log('❌ Communities directory not found!');
      return;
    }
    
    const files = findCommunityFiles(communitiesDir);
    console.log(`📁 Found ${files.length} files to upload to Cloudinary...\n`);
    
    // Check for large files that need compression
    const largeFiles = files.filter(file => getFileSize(file) > 50 * 1024 * 1024);
    if (largeFiles.length > 0) {
      console.log(`⚠️  Found ${largeFiles.length} files larger than 50MB that will be compressed:`);
      largeFiles.forEach(file => {
        const relativePath = path.relative(communitiesDir, file);
        console.log(`   - ${relativePath} (${formatBytes(getFileSize(file))})`);
      });
      console.log('');
    }
    
    let totalSize = 0;
    let successCount = 0;
    let errorCount = 0;
    const uploadResults = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = path.relative(communitiesDir, file);
      const publicId = generatePublicId(file, communitiesDir);
      const fileSize = getFileSize(file);
      totalSize += fileSize;
      
      process.stdout.write(`[${i + 1}/${files.length}] Uploading ${relativePath}... `);
      
      const result = await uploadFile(file, publicId);
      
      if (result.success) {
        successCount++;
        uploadResults.push({
          localPath: relativePath,
          publicId: result.public_id,
          url: result.secure_url,
          size: result.bytes,
          format: result.format
        });
        console.log(`✅ ${formatBytes(result.bytes)}`);
      } else {
        errorCount++;
        console.log(`❌ Error: ${result.error}`);
      }
    }
    
    // Save upload results to JSON file
    const resultsFile = path.join(__dirname, '..', 'cloudinary-uploads.json');
    fs.writeFileSync(resultsFile, JSON.stringify(uploadResults, null, 2));
    
    console.log(`\n📊 Upload summary:`);
    console.log(`   Files processed: ${files.length}`);
    console.log(`   Successful uploads: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total size: ${formatBytes(totalSize)}`);
    console.log(`   Results saved to: cloudinary-uploads.json`);
    
    if (successCount > 0) {
      console.log(`\n✅ Upload completed! You can now use Cloudinary URLs in your application.`);
      console.log(`\n💡 Next steps:`);
      console.log(`   1. Update your application to use Cloudinary URLs`);
      console.log(`   2. Test that all files are accessible`);
      console.log(`   3. Remove the local communities folder`);
    }
    
  } catch (error) {
    console.error('❌ Error during upload:', error.message);
    process.exit(1);
  }
}

main();

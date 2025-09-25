const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.log('❌ Missing Cloudinary credentials!');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const config = {
  resource_type: 'raw', // Upload as raw files to preserve PDF format
  overwrite: true,
  use_filename: true,
  unique_filename: false,
};

function findPDFFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(findPDFFiles(fullPath));
    } else if (item.isFile() && path.extname(item.name).toLowerCase() === '.pdf') {
      const relativePath = path.relative(path.join(process.cwd(), 'public', 'communities'), fullPath);
      const normalizedRelativePath = relativePath.replace(/\\/g, '/');
      
      // Only consider PDF files in BROCHURE or FLOORPLANS folders
      if (normalizedRelativePath.includes('/BROCHURE/') || normalizedRelativePath.includes('/FLOORPLANS/')) {
        files.push({
          fullPath: fullPath,
          relativePath: normalizedRelativePath,
        });
      }
    }
  }
  return files;
}

async function uploadPDFsAsRaw() {
  console.log('🚀 Starting upload of PDFs as raw files to Cloudinary...');
  const communitiesDir = path.join(process.cwd(), 'public', 'communities');
  if (!fs.existsSync(communitiesDir)) {
    console.error('❌ public/communities directory not found. Please ensure it exists.');
    process.exit(1);
  }

  const allPDFFiles = findPDFFiles(communitiesDir);
  console.log(`📋 Found ${allPDFFiles.length} PDF files to upload`);

  let uploadedCount = 0;
  let errorCount = 0;
  const uploadResults = [];

  for (const file of allPDFFiles) {
    const publicId = `emaar-map/communities/${file.relativePath.replace(/\.pdf$/i, '').toLowerCase().replace(/ /g, '-')}`;
    
    try {
      console.log(`📤 Uploading PDF as raw: ${file.relativePath}`);
      
      const result = await cloudinary.uploader.upload(file.fullPath, {
        ...config,
        public_id: publicId,
        folder: path.dirname(publicId),
      });

      uploadResults.push({
        localPath: file.relativePath.replace(/\//g, '\\'),
        publicId: result.public_id,
        url: result.secure_url,
        size: result.bytes,
        format: result.format
      });

      uploadedCount++;
      console.log(`✅ Uploaded: ${file.relativePath} -> ${result.secure_url}`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${file.relativePath}:`, error.message);
      errorCount++;
    }
  }

  // Save results to a separate file for raw PDFs
  const rawUploadsPath = path.join(process.cwd(), 'cloudinary-raw-uploads.json');
  fs.writeFileSync(rawUploadsPath, JSON.stringify(uploadResults, null, 2));

  console.log('\n--- Upload Summary ---');
  console.log(`✅ Successfully uploaded ${uploadedCount} PDF files as raw`);
  console.log(`❌ Encountered ${errorCount} errors`);
  console.log(`💾 Saved raw uploads to: cloudinary-raw-uploads.json`);
}

uploadPDFsAsRaw().catch(console.error);

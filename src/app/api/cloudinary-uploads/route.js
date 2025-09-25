import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read the regular uploads file
    const filePath = join(process.cwd(), 'cloudinary-uploads.json');
    const fileContent = readFileSync(filePath, 'utf8');
    const cloudinaryUploads = JSON.parse(fileContent);
    
    // Read the raw uploads file if it exists
    const rawFilePath = join(process.cwd(), 'cloudinary-raw-uploads.json');
    let rawUploads = [];
    if (existsSync(rawFilePath)) {
      const rawFileContent = readFileSync(rawFilePath, 'utf8');
      rawUploads = JSON.parse(rawFileContent);
    }
    
    // Return both types of uploads
    return Response.json({
      regular: cloudinaryUploads,
      raw: rawUploads
    });
  } catch (error) {
    console.error('Error serving cloudinary uploads:', error);
    return Response.json({ error: 'Failed to load uploads data' }, { status: 500 });
  }
}

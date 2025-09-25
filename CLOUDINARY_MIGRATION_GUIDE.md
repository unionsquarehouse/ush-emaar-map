# Cloudinary Migration Guide

## Overview
This guide will help you migrate your communities files from local storage to Cloudinary, significantly reducing your repository size and making it GitHub-friendly.

## Prerequisites
- Cloudinary account with API credentials
- Node.js and npm installed
- All dependencies installed (`npm install`)

## Step 1: Set Up Cloudinary API Secret

You need to provide your Cloudinary API secret. You have two options:

### Option A: Environment Variable (Recommended)
```bash
# Windows PowerShell
$env:CLOUDINARY_API_SECRET="your_actual_api_secret_here"

# Windows Command Prompt
set CLOUDINARY_API_SECRET=your_actual_api_secret_here
```

### Option B: Edit the Script
Edit `scripts/upload-to-cloudinary.js` and replace `'your_api_secret_here'` with your actual API secret.

## Step 2: Upload Files to Cloudinary

Run the upload script:
```bash
npm run upload:cloudinary
```

This will:
- Upload all files from `public/communities/` to Cloudinary
- Maintain the same folder structure
- Create a `cloudinary-uploads.json` file with all upload results
- Show progress and summary

## Step 3: Test the Migration

### Test URL Generation
```bash
npm run test:cloudinary
```

### Test Your Application
1. Start your development server: `npm run dev`
2. Navigate to different communities and properties
3. Check that brochures, floor plans, and images load correctly
4. Verify that all files are accessible from Cloudinary

## Step 4: Verify Everything Works

Before removing local files, ensure:
- [ ] All brochures load correctly
- [ ] All floor plans display properly
- [ ] All gallery images show up
- [ ] No broken links or missing files
- [ ] PDFs open and display correctly

## Step 5: Clean Up Local Files

Once everything is working:

### Remove Communities Folder
```bash
# Windows PowerShell
Remove-Item -Recurse -Force "public/communities"

# Windows Command Prompt
rmdir /s /q "public\communities"
```

### Remove Backup Files (if any)
```bash
npm run cleanup:backups
```

## Step 6: Update .gitignore

Add to your `.gitignore` file:
```
# Cloudinary upload results
cloudinary-uploads.json

# Environment variables
.env.local
```

## File Structure in Cloudinary

Your files will be organized in Cloudinary as:
```
emaar-map/communities/
├── dubai-creek-harbour/
│   ├── albero/
│   │   ├── brochure/
│   │   ├── floorplans/
│   │   └── images/
│   ├── altan/
│   └── ...
├── dubai-hills/
├── emaar-south/
├── expo-living/
├── grand-polo/
├── rashid-yachts/
└── the-valley/
```

## Benefits of This Migration

1. **Reduced Repository Size**: Your repo will be much smaller and GitHub-friendly
2. **Better Performance**: Cloudinary provides optimized delivery
3. **Automatic Optimization**: Images are automatically optimized for different devices
4. **CDN Delivery**: Files are served from a global CDN
5. **Easy Management**: All files are managed through Cloudinary dashboard

## Troubleshooting

### Files Not Loading
1. Check that the upload completed successfully
2. Verify the file paths in `cloudinary-uploads.json`
3. Ensure your Cloudinary account has sufficient storage

### API Errors
1. Verify your API credentials are correct
2. Check that your Cloudinary account is active
3. Ensure you have sufficient API quota

### URL Generation Issues
1. Run `npm run test:cloudinary` to verify URL generation
2. Check the console for any JavaScript errors
3. Verify the file naming conventions match

## Support

If you encounter any issues:
1. Check the console output from the upload script
2. Review the `cloudinary-uploads.json` file for any failed uploads
3. Test individual URLs in your browser
4. Check the Cloudinary dashboard for uploaded files

## Next Steps

After successful migration:
1. Commit your changes to Git
2. Push to GitHub (repository will be much smaller)
3. Update your deployment configuration if needed
4. Consider setting up Cloudinary webhooks for future file management

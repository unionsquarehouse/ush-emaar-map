// Test script to verify components can access Cloudinary data
const { getActualCloudinaryUrl, getCommunityFiles } = require('../src/utils/cloudinary-mapping.js');

console.log('🧪 Testing Component Data Access\n');

// Test 1: Individual file lookup
console.log('📄 Test 1: Individual File Lookup');
const testPath = '/communities/dubai-creek-harbour/albero/BROCHURE/ALBERO_DCH_BROCHURE.pdf';
const url = getActualCloudinaryUrl(testPath);
console.log(`Local Path: ${testPath}`);
console.log(`Cloudinary URL: ${url || 'NOT FOUND'}\n`);

// Test 2: Community files
console.log('🏘️ Test 2: Community Files for Dubai Creek Harbour - Albero');
const alberoFiles = getCommunityFiles('dubai-creek-harbour', 'albero');
console.log('Brochures:', alberoFiles.brochures.length);
console.log('Floor Plans:', alberoFiles.floorplans.length);
console.log('Images:', alberoFiles.images.length);

if (alberoFiles.brochures.length > 0) {
  console.log('✅ Brochure found:', alberoFiles.brochures[0].name);
} else {
  console.log('❌ No brochures found');
}

if (alberoFiles.images.length > 0) {
  console.log('✅ Images found:', alberoFiles.images.length);
} else {
  console.log('❌ No images found');
}

console.log('\n✅ Component data access test completed!');

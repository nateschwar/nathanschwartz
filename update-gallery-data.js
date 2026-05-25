import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vaultPath = path.join(__dirname, 'public/vault/events/BAHSSportsPhoto');
const galleryDataPath = path.join(__dirname, 'src/lib/gallery-data.ts');

// Sport folder mapping to display names
const sportMapping = {
  'boys-lacrosse': 'Boys Lacrosse',
  'girls-lacrosse': 'Girls Lacrosse',
  'girls-basketball': 'Girls Basketball',
  'boys-basketball': 'Boys Basketball',
  'baseball': 'Baseball',
  'football': 'Football',
  'softball': 'Softball',
  'track': 'Track',
  'boys-volleyball': 'Boys Volleyball',
  'girls-volleyball': 'Girls Volleyball'
};

function getFilesInDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    .sort();
}

function generateGalleryData() {
  const sportFolders = fs.readdirSync(vaultPath)
    .filter(item => {
      const itemPath = path.join(vaultPath, item);
      return fs.statSync(itemPath).isDirectory() && item !== 'originals';
    })
    .sort();

  let galleriesArray = [];

  sportFolders.forEach(sportFolder => {
    const sportPath = path.join(vaultPath, sportFolder);
    const files = getFilesInDir(sportPath);
    
    if (files.length === 0) return;

    const displayName = sportMapping[sportFolder] || sportFolder;
    const galleryId = `bahs-${sportFolder}`;
    
    // Create a separate gallery for each sport
    let galleryCode = `  {
    id: "${galleryId}",
    title: "${displayName}",
    date: "2026-05-24",
    location: "Bel Air High School",
    folder: bahsSports,
    tags: ["Sports", "High School"],
    isPrivate: false,
    cover: basketballImg,
    images: [
`;
    
    files.forEach(file => {
      // Use the actual image path for both preview and full
      const imagePath = `/vault/events/BAHSSportsPhoto/${sportFolder}/${file}`;
      galleryCode += `      {
        preview: "${imagePath}",
        full: "${imagePath}",
        name: "${file}",
        title: "${displayName}",
        ratio: "aspect-[3/4]"
      },\n`;
    });
    
    galleryCode += `    ],
  },`;
    
    galleriesArray.push(galleryCode);
  });

  return galleriesArray;
}

function updateGalleryDataFile() {
  // Read the current gallery-data.ts
  let content = fs.readFileSync(galleryDataPath, 'utf8');

  // Generate the new galleries
  const newGalleries = generateGalleryData();

  // Find the start and end of the BAHSSportsPhoto gallery
  const startMarker = '  {\n    id: bahsSports,';
  const endMarker = '  },\n  {\n    id: sidelineSports,';
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find the BAHSSportsPhoto gallery in gallery-data.ts');
    return;
  }

  // Build the new content
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newContent = before + newGalleries.join('\n') + '\n' + after;

  // Write the updated content
  fs.writeFileSync(galleryDataPath, newContent, 'utf8');
  
  console.log(`Updated gallery-data.ts with ${newGalleries.length} separate sport galleries`);
}

updateGalleryDataFile();

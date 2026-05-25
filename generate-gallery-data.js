import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VAULT_PATH = path.join(__dirname, 'public', 'vault', 'events');
const OUTPUT_PATH = path.join(__dirname, 'src', 'lib', 'gallery-data.ts');

// Gallery metadata configuration
const galleryConfig = {
  'BAHSSportsPhoto': {
    title: 'Bel Air High School Sports Photography',
    date: '2026-05-24',
    location: 'Bel Air High School',
    tags: ['Sports', 'High School'],
    isPrivate: false,
    cover: 'basketballImg',
  },
  'sideline-sports': {
    title: 'Sideline Sports Collection',
    date: '2026-05-24',
    location: 'Fieldhouse',
    tags: ['Sports'],
    isPrivate: false,
    cover: 'basketballImg',
  },
  'apex-racing-delivery': {
    title: 'Apex Racing Delivery',
    date: '2026-05-24',
    location: 'Private Client',
    tags: ['GFX', 'Sports'],
    isPrivate: true,
    passcode: 'apex',
    cover: 'posterImg',
  },
  'concert-night-sample': {
    title: 'Concert Night Sample',
    date: '2026-05-24',
    location: 'Backstage',
    tags: ['Concerts'],
    isPrivate: false,
    cover: 'heroImg',
  },
};

function getImageFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getRelativePath(fullPath, vaultPath) {
  return fullPath.replace(vaultPath + path.sep, '').replace(/\\/g, '/');
}

function generateEventImageCall(folder, fileName, preview, title, ratio, sportFolder) {
  // Map folder names to their variable names
  const folderVarMap = {
    'BAHSSportsPhoto': 'bahsSports',
    'sideline-sports': 'sidelineSports',
    'apex-racing-delivery': 'apexRacing',
    'concert-night-sample': 'concertNight',
  };
  
  const folderVar = folderVarMap[folder] || `"${folder}"`;
  
  if (sportFolder) {
    return `eventImage(${folderVar}, "${fileName}", ${preview}, "${title}", "${ratio}", "${sportFolder}")`;
  }
  return `eventImage(${folderVar}, "${fileName}", ${preview}, "${title}", "${ratio}")`;
}

function generateGalleryData() {
  let output = `import basketballImg from "@/assets/optimized/work-basketball-preview.jpg";
import posterImg from "@/assets/optimized/work-poster-preview.jpg";
import soccerImg from "@/assets/optimized/work-soccer-preview.jpg";
import brandImg from "@/assets/optimized/work-brand-preview.jpg";
import swimmerImg from "@/assets/optimized/work-swimmer-preview.jpg";
import heroImg from "@/assets/optimized/hero-action-preview.jpg";
import portraitImg from "@/assets/optimized/about-portrait-preview.jpg";

export type GalleryImage = {
  preview: string;
  full: string;
  name: string;
  title: string;
  ratio: string;
};

export type Gallery = {
  id: string;
  title: string;
  date: string;
  location: string;
  folder: string;
  tags: string[];
  isPrivate: boolean;
  passcode?: string;
  cover: string;
  images: GalleryImage[];
};

function eventImage(
  folder: string,
  fileName: string,
  preview: string,
  title: string,
  ratio: string,
  sportFolder?: string,
): GalleryImage {
  const path = sportFolder
    ? \`/vault/events/\${folder}/\${sportFolder}/\${fileName}\`
    : \`/vault/events/\${folder}/originals/\${fileName}\`;
  return {
    preview,
    full: path,
    name: fileName,
    title,
    ratio,
  };
}

const sidelineSports = "sideline-sports";
const apexRacing = "apex-racing-delivery";
const concertNight = "concert-night-sample";
const bahsSports = "BAHSSportsPhoto";

export const galleries: Gallery[] = [
`;

  const folders = fs.readdirSync(VAULT_PATH, { withFileTypes: true });
  
  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    
    const folderName = folder.name;
    const config = galleryConfig[folderName];
    
    if (!config) {
      console.log(`Skipping ${folderName} - no configuration found`);
      continue;
    }
    
    const folderPath = path.join(VAULT_PATH, folderName);
    const imageFiles = getImageFiles(folderPath);
    
    if (imageFiles.length === 0) {
      console.log(`Skipping ${folderName} - no images found`);
      continue;
    }
    
    output += `  {
    id: "${folderName}",
    title: "${config.title}",
    date: "${config.date}",
    location: "${config.location}",
    folder: "${folderName}",
    tags: ${JSON.stringify(config.tags)},
    isPrivate: ${config.isPrivate},
    ${config.passcode ? `passcode: "${config.passcode}",` : ''}
    cover: ${config.cover},
    images: [
`;
    
    // Group images by subfolder
    const imagesBySubfolder = {};
    
    for (const imagePath of imageFiles) {
      const relativePath = getRelativePath(imagePath, folderPath);
      const parts = relativePath.split('/');
      
      if (parts.length > 1) {
        const subfolder = parts[0];
        const fileName = parts.slice(1).join('/');
        if (!imagesBySubfolder[subfolder]) {
          imagesBySubfolder[subfolder] = [];
        }
        imagesBySubfolder[subfolder].push(fileName);
      } else {
        if (!imagesBySubfolder['originals']) {
          imagesBySubfolder['originals'] = [];
        }
        imagesBySubfolder['originals'].push(relativePath);
      }
    }
    
    // Generate eventImage calls for each image
    for (const [subfolder, files] of Object.entries(imagesBySubfolder)) {
      const title = subfolder.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      for (const fileName of files) {
        const preview = config.cover; // Use the configured cover as preview
        const ratio = 'aspect-[3/4]'; // Default ratio
        
        const eventCall = generateEventImageCall(
          folderName,
          fileName,
          preview,
          title,
          ratio,
          subfolder !== 'originals' ? subfolder : undefined
        );
        
        output += `      ${eventCall},\n`;
      }
    }
    
    output += `    ],
  },
`;
  }
  
  output += `];

export function getGallery(galleryId: string) {
  return galleries.find((gallery) => gallery.id === galleryId);
}

export function getGalleryTags() {
  return ["All", ...Array.from(new Set(galleries.flatMap((gallery) => gallery.tags)))];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
`;
  
  return output;
}

// Generate and write the file
const galleryData = generateGalleryData();
fs.writeFileSync(OUTPUT_PATH, galleryData, 'utf-8');
console.log(`Generated gallery data at ${OUTPUT_PATH}`);

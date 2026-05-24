import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const inPath = path.join(root, 'src', 'assets', 'logo.png');
const outPath = path.join(root, 'src', 'assets', 'logo.webp');

if (!fs.existsSync(inPath)) {
  console.error('Input file not found:', inPath);
  process.exit(1);
}

sharp(inPath)
  .webp({ quality: 90 })
  .toFile(outPath)
  .then(() => {
    console.log('Converted', inPath, '→', outPath);
  })
  .catch((err) => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });

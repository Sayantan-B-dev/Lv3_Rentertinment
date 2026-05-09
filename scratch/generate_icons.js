const sharp = require('sharp');
const path = require('path');

const source = path.join(__dirname, '../public/icon.png');
const publicDir = path.join(__dirname, '../public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

async function generateIcons() {
  // Read into buffer to avoid file lock
  const inputBuffer = require('fs').readFileSync(source);
  const original = sharp(inputBuffer).ensureAlpha();
  
  // Get raw data to manipulate transparency
  const { data, info } = await original.raw().toBuffer({ resolveWithObject: true });
  
  // Replace "near-white" pixels with transparency
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    
    // If pixel is very bright (near white), make it transparent
    if (r > 245 && g > 245 && b > 245) {
      data[i+3] = 0; // set alpha to 0
    }
  }

  const transparentSource = sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  });

  for (const item of sizes) {
    try {
      await transparentSource
        .clone()
        .resize(item.size, item.size)
        .toFile(path.join(publicDir, item.name));
      console.log(`Generated transparent ${item.name}`);
    } catch (err) {
      console.error(`Error generating ${item.name}:`, err);
    }
  }

  // Also update the main icon.png and app/icon.png
  try {
    await transparentSource.toFile(source);
    await transparentSource.toFile(path.join(__dirname, '../app/icon.png'));
    console.log('Updated main icon.png and app/icon.png with transparency');
  } catch (err) {
    console.error('Error updating main icons:', err);
  }
}

generateIcons();

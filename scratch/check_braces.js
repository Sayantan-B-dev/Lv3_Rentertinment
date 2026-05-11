import fs from 'fs';

const content = fs.readFileSync('g:\\code\\Web techs\\projects\\ArtistHub\\BlueEye\\styles\\components\\home.css', 'utf8');
let openBraces = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
  }
  if (openBraces < 0) {
    console.log(`Extra closing brace at line ${i + 1}`);
    openBraces = 0; // reset
  }
}

if (openBraces > 0) {
  console.log(`Missing ${openBraces} closing braces at the end of the file`);
} else {
  console.log('Braces are balanced');
}

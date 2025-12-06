const fs = require('fs');
const path = require('path');

const browserDist = './dist/demoSSR/browser'; // your browser output folder
const projectName = 'bookone';

// Files to rename
const filesToRename = [
  'main.js',
  'polyfills.js',
  'runtime.js',
  'styles.css'
];

// Rename files
filesToRename.forEach(file => {
  const oldPath = path.join(browserDist, file);
  if (fs.existsSync(oldPath)) {
    const newPath = path.join(browserDist, `${projectName}-${file}`);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} → ${projectName}-${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

// Update index.html references
const indexPath = path.join(browserDist, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  filesToRename.forEach(file => {
    const regex = new RegExp(file, 'g'); // replace all occurrences
    indexContent = indexContent.replace(regex, `${projectName}-${file}`);
  });
  fs.writeFileSync(indexPath, indexContent);
  console.log('Updated index.html references.');
} else {
  console.log('index.html not found!');
}

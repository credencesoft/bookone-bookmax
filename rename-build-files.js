const fs = require('fs');
const path = require('path');

const projectName = 'bookone';

// ------------------------------------------------------
// PATHS
// ------------------------------------------------------
const browserDist = './dist/demoSSR/browser';
const serverDist = './dist/demoSSR/server';

// ------------------------------------------------------
// FILES
// ------------------------------------------------------
const browserFiles = [
  'main.js',
  'polyfills.js',
  'runtime.js',
  'styles.css'
];

const serverFiles = [
  'main.js',       // Node SSR bundle
  'server.mjs'     // optional if Angular generates it
];

// ------------------------------------------------------
// 1️⃣ RENAME BROWSER FILES
// ------------------------------------------------------
browserFiles.forEach(file => {
  const oldPath = path.join(browserDist, file);
  if (fs.existsSync(oldPath)) {
    const newPath = path.join(browserDist, `${projectName}-${file}`);
    fs.renameSync(oldPath, newPath);
    console.log(`Browser: ${file} → ${projectName}-${file}`);
  }
});

// ------------------------------------------------------
// 2️⃣ UPDATE index.html REFERENCES
// ------------------------------------------------------
const indexPath = path.join(browserDist, 'index.html');

if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  browserFiles.forEach(file => {
    const regex = new RegExp(file, 'g');
    indexContent = indexContent.replace(regex, `${projectName}-${file}`);
  });

  fs.writeFileSync(indexPath, indexContent);
  console.log('Updated index.html');
}

// ------------------------------------------------------
// 3️⃣ RENAME SERVER FILES
// ------------------------------------------------------
serverFiles.forEach(file => {
  const oldPath = path.join(serverDist, file);
  if (fs.existsSync(oldPath)) {
    const newPath = path.join(serverDist, `${projectName}-${file}`);
    fs.renameSync(oldPath, newPath);
    console.log(`Server: ${file} → ${projectName}-${file}`);
  }
});

// ------------------------------------------------------
// 4️⃣ UPDATE SERVER main.js IMPORT REFERENCES
// ------------------------------------------------------
const possibleServerFiles = [
  path.join(serverDist, 'main.js'),
  path.join(serverDist, `${projectName}-main.js`)
];

let serverEntryFile = null;

possibleServerFiles.forEach(file => {
  if (fs.existsSync(file)) serverEntryFile = file;
});

if (serverEntryFile) {
  let serverContent = fs.readFileSync(serverEntryFile, 'utf8');

  browserFiles.forEach(file => {
    const regex = new RegExp(file, 'g');
    serverContent = serverContent.replace(regex, `${projectName}-${file}`);
  });

  fs.writeFileSync(serverEntryFile, serverContent);
  console.log('Updated server main.js references');
} else {
  console.log('No server main.js found to update.');
}

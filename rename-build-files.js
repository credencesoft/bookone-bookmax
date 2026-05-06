
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
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname);
const CONTENT_DIR = path.join(ROOT, 'content');
const BUILD_SCRIPT = path.join(ROOT, 'build.js');
const DEBOUNCE_MS = 300;

let debounceTimer = null;

function runBuild() {
  const child = spawn('node', [BUILD_SCRIPT], {
    stdio: 'inherit',
    cwd: ROOT,
  });
  child.on('error', (err) => console.error('Build failed:', err));
}

function scheduleBuild() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runBuild();
  }, DEBOUNCE_MS);
}

function watch() {
  runBuild();
  console.log('Watching content/ — edits will rebuild index.html automatically.\n');

  fs.watch(CONTENT_DIR, (eventType, filename) => {
    if (!filename) return;
    const ext = path.extname(filename);
    if (ext === '.md' || filename === 'meta.json') {
      scheduleBuild();
    }
  });
}

watch();

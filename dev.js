const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname);

function run(name, script) {
  const child = spawn('node', [script], {
    stdio: 'inherit',
    cwd: ROOT,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exit(code ?? 1);
    }
  });

  return child;
}

const watch = run('watch', 'watch.js');
const serve = run('serve', 'serve.js');

function shutdown() {
  watch.kill();
  serve.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

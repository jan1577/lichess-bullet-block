const fs = require('fs');
const path = require('path');
const readline = require('readline');
const archiver = require('archiver');

// --- Configuration & Validation ---
const platform = process.argv[2];
if (!platform || (platform !== 'chrome' && platform !== 'firefox')) {
  console.error('Usage: node build.js <platform>');
  console.error('Platform must be either "chrome" or "firefox"');
  process.exit(1);
}

const rootDir = __dirname;
const sourceDir = path.join(rootDir, 'src');
const platformDir = path.join(rootDir, platform);
const distBase = path.join(rootDir, 'dist');
const manifestPath = path.join(platformDir, 'manifest.json');

// Validation
if (!fs.existsSync(sourceDir)) fail(`Source directory not found: ${sourceDir}`);
if (!fs.existsSync(manifestPath)) fail(`Manifest not found: ${manifestPath}`);

// --- Helpers ---
function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function ensureCleanDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (e) {
      console.warn(`Warning: Could not clear ${dirPath}: ${e.message}`);
    }
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function loadEnvFile(filePath, envObject) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Loading env from ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] ? match[2].trim() : '';
      // Remove quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      envObject[match[1]] = val;
    }
  });
}

function createZip(sourcePath, outPath) {
  return new Promise((resolve, reject) => {
    // Delete existing zip
    if (fs.existsSync(outPath)) {
      try { fs.unlinkSync(outPath); } catch (e) {}
    }

    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Zip created: ${path.basename(outPath)} (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('warning', err => {
      if (err.code === 'ENOENT') console.warn(err);
      else reject(err);
    });
    archive.on('error', err => reject(err));

    archive.pipe(output);
    archive.directory(sourcePath, false); // false = append files at root of zip, not inside subdir
    archive.finalize();
  });
}

// --- Main Process ---
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

async function start() {
  try {
    // 1. Version Management
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    const currentVersion = manifest.version;

    console.log(`Platform: ${platform} | Current Version: ${currentVersion}`);
    const answer = await ask('Bump version? (M)ajor, (m)inor, (p)atch, (N)o: ');
    rl.close();

    const parts = currentVersion.split('.').map(Number);
    let bumped = false;

    if (answer === 'M' || answer.toLowerCase() === 'major') {
      parts[0]++; parts[1] = 0; parts[2] = 0; bumped = true;
    } else if (answer === 'm' || answer.toLowerCase() === 'minor') {
      parts[1]++; parts[2] = 0; bumped = true;
    } else if (answer.toLowerCase().startsWith('p')) {
      parts[2]++; bumped = true;
    }

    if (bumped) {
      manifest.version = parts.join('.');
      console.log(`Bumping to ${manifest.version}`);
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
    } else {
      console.log('Keeping version specific to this platform.');
    }

    // 2. Prepare Output Directory
    if (!fs.existsSync(distBase)) fs.mkdirSync(distBase, { recursive: true });

    // Define staging directory
    // Chrome needs a persistent folder for "Load Unpacked",
    // Firefox needs a zip, using a temp folder then zip it
    let targetDirName;
    if (platform === 'chrome') {
      targetDirName = `${platform}-v${manifest.version}`;
    } else {
      targetDirName = `${platform}-temp-build`; 
    }
    const targetDir = path.join(distBase, targetDirName);

    ensureCleanDir(targetDir);

    // 3. Copy Files
    fs.cpSync(sourceDir, targetDir, { recursive: true });
    // Copy platform-specific manifest
    fs.copyFileSync(manifestPath, path.join(targetDir, 'manifest.json'));

    // 4. Evironment Variable Injection
    const env = {};
    loadEnvFile(path.join(rootDir, '.env'), env);
    loadEnvFile(path.join(platformDir, `.env.${platform}`), env);

    if (Object.keys(env).length > 0) {
      const optsPath = path.join(targetDir, 'options.html');
      if (fs.existsSync(optsPath)) {
        let content = fs.readFileSync(optsPath, 'utf8');
        for (const [key, val] of Object.entries(env)) {
          content = content.replace(new RegExp(`__${key}__`, 'g'), val);
        }
        fs.writeFileSync(optsPath, content);
        console.log('Environment variables injected.');
      }
    }

    // 5. Final Packaging
    if (platform === 'firefox') {
      const zipName = `${platform}-v${manifest.version}.zip`;
      const zipPath = path.join(distBase, zipName);
      
      console.log('Zipping for Firefox...');
      await createZip(targetDir, zipPath);
      
      // Clean up temp folder for Firefox
      try {
        fs.rmSync(targetDir, { recursive: true, force: true });
      } catch (e) {
        console.warn(`Could not remove temp dir ${targetDir}`);
      }
      console.log(`Build Complete: ${zipPath}`);
    } else {
      console.log(`Build Complete: ${targetDir}`);
    }

  } catch (err) {
    fail(`Unexpected error: ${err.message}`);
  }
}

start();
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname);
const CONTENT_DIR = path.join(ROOT, 'content');
const TEMPLATE_PATH = path.join(ROOT, 'index.template.html');
const OUTPUT_PATH = path.join(ROOT, 'index.html');
const META_PATH = path.join(CONTENT_DIR, 'meta.json');
const IMAGES_OUT = path.join(ROOT, 'images');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadMeta() {
  if (!fs.existsSync(META_PATH)) return {};
  const raw = fs.readFileSync(META_PATH, 'utf8');
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// Section discovery — reads numbered folders, parses frontmatter
// ---------------------------------------------------------------------------

function discoverSections() {
  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const sectionDirs = entries
    .filter((d) => d.isDirectory() && /^\d+-/.test(d.name))
    .sort((a, b) => {
      const numA = parseInt(a.name, 10);
      const numB = parseInt(b.name, 10);
      return numA - numB;
    });

  const sections = [];
  const warnings = [];

  for (const dir of sectionDirs) {
    const dirPath = path.join(CONTENT_DIR, dir.name);
    const mdPath = path.join(dirPath, 'index.md');
    const slug = dir.name.replace(/^\d+-/, '');

    if (!fs.existsSync(mdPath)) {
      warnings.push(`Warning: ${dir.name}/ has no index.md — skipping`);
      continue;
    }

    const raw = fs.readFileSync(mdPath, 'utf8');
    const { data: frontmatter, content } = matter(raw);

    if (!frontmatter.title) {
      warnings.push(`Warning: ${dir.name}/index.md has no "title" in frontmatter`);
    }

    sections.push({
      id: slug,
      dirName: dir.name,
      dirPath,
      title: frontmatter.title || slug,
      content,
    });
  }

  return { sections, warnings };
}

// ---------------------------------------------------------------------------
// Image pipeline — resize with sharp, copy SVGs
// ---------------------------------------------------------------------------

function collectImages(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));
}

function imageRefsInMarkdown(mdContent) {
  const refs = new Set();
  const pattern = /!\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = pattern.exec(mdContent)) !== null) {
    const href = m[1].split(/[?#]/)[0];
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      refs.add(href);
    }
  }
  return refs;
}

async function processImages(sections) {
  let totalProcessed = 0;
  const warnings = [];
  const dimensions = {};

  for (const section of sections) {
    const imageFiles = collectImages(section.dirPath);
    const referencedImages = imageRefsInMarkdown(section.content);

    // Warn about images referenced in markdown but missing from folder
    for (const ref of referencedImages) {
      if (!imageFiles.includes(ref)) {
        warnings.push(`Warning: ${section.dirName}/index.md references "${ref}" but file is missing`);
      }
    }

    // Warn about orphan images (in folder but never referenced)
    for (const file of imageFiles) {
      if (!referencedImages.has(file)) {
        warnings.push(`Notice: ${section.dirName}/${file} exists but is not referenced in index.md`);
      }
    }

    if (imageFiles.length === 0) continue;

    const outDir = path.join(IMAGES_OUT, section.id);
    fs.mkdirSync(outDir, { recursive: true });

    for (const file of imageFiles) {
      const srcPath = path.join(section.dirPath, file);
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);

      if (ext === '.svg') {
        fs.copyFileSync(srcPath, path.join(outDir, file));
        totalProcessed++;
        continue;
      }

      const meta = await sharp(srcPath).metadata();

      // Lossless PNG copy at full resolution — no downscaling so
      // scientific figures with fine text/gridlines stay crisp.
      await sharp(srcPath).png().toFile(path.join(outDir, `${baseName}-full.png`));

      const outKey = `images/${section.id}/${baseName}-full.png`;
      dimensions[outKey] = { width: meta.width, height: meta.height };

      totalProcessed++;
    }
  }

  return { totalProcessed, warnings, dimensions };
}

// ---------------------------------------------------------------------------
// Custom Marked renderer — images become <figure> with lightbox hooks
// ---------------------------------------------------------------------------

function createRenderer(sectionId, dimensions) {
  const renderer = new marked.Renderer();

  renderer.image = function ({ href, title, text }) {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy" />`;
    }

    const ext = path.extname(href).toLowerCase();
    const baseName = path.basename(href, ext);
    const isSvg = ext === '.svg';

    const fullPath = isSvg
      ? `images/${sectionId}/${href}`
      : `images/${sectionId}/${baseName}-full.png`;

    const alt = escapeHtml(text || '');
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const caption = text || '';
    const figureClass = caption ? 'img-figure has-caption' : 'img-figure no-caption';

    const dim = dimensions[fullPath];
    const widthAttr = dim ? ` data-pswp-width="${dim.width}"` : '';
    const heightAttr = dim ? ` data-pswp-height="${dim.height}"` : '';

    const ariaLabel = escapeHtml(caption ? `Open image: ${caption}` : 'Open image');

    return (
      `<figure class="${figureClass}">\n` +
      `  <a href="${fullPath}"${widthAttr}${heightAttr} target="_blank" aria-label="${ariaLabel}">\n` +
      `    <img src="${fullPath}" alt="${alt}"${titleAttr} loading="lazy" />\n` +
      `  </a>\n` +
      (caption ? `  <figcaption>${escapeHtml(caption)}</figcaption>\n` : '') +
      `</figure>`
    );
  };

  return renderer;
}

// ---------------------------------------------------------------------------
// Build HTML
// ---------------------------------------------------------------------------

// Fenced block: opening line "::: details Title" (optional space after colons), body until closing ":::"
const DETAILS_OPEN_RE = /(?:^|\n)(:::+\s*details\s+([^\n]*))\s*\n/im;
const DETAILS_CLOSE_RE = /\n:::+\s*(?=\n|$)/;

/**
 * Extract ::: details Title ... ::: blocks from content. Returns modified content
 * with placeholders and an array of { title, body }. Supports multiple blocks.
 */
function extractDetailsBlocks(content) {
  const blocks = [];
  let modified = content;
  let index = 0;

  while (true) {
    const openMatch = modified.match(DETAILS_OPEN_RE);
    if (!openMatch) break;

    const blockStart = openMatch.index;
    const bodyStart = blockStart + openMatch[0].length;
    const tail = modified.slice(bodyStart);
    const closeMatch = tail.match(DETAILS_CLOSE_RE);

    let body;
    let blockEnd;

    if (closeMatch) {
      body = tail.slice(0, closeMatch.index).trim();
      blockEnd = bodyStart + closeMatch.index + closeMatch[0].length;
    } else {
      body = tail.trim();
      blockEnd = modified.length;
    }

    const title = (openMatch[2] || '').trim() || 'Details';
    blocks.push({ title, body });
    const placeholder = `\n<!--DETAILS_${index}-->\n`;
    modified = modified.slice(0, blockStart) + placeholder + modified.slice(blockEnd);
    index += 1;
  }

  return { content: modified, blocks };
}

function buildSectionsHtml(sections, dimensions) {
  const parts = [];
  for (const section of sections) {
    const renderer = createRenderer(section.id, dimensions);
    const { content: contentWithoutBlocks, blocks } = extractDetailsBlocks(section.content);
    let bodyHtml = marked.parse(contentWithoutBlocks, { renderer });

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      let detailedHtml = marked.parse(block.body, { renderer });
      if (section.id === 'about' && block.title === 'How to cite?') {
        detailedHtml = detailedHtml.replace(
          /<blockquote>([\s\S]*?)<\/blockquote>/,
          '<div class="citation-blockquote-wrapper"><blockquote>$1<button type="button" class="citation-copy-btn" aria-label="Copy citation">Copy</button></blockquote></div>'
        );
      }
      const detailsHtml =
        '\n<details class="detailed-explanation">\n<summary>' +
        '<span class="details-summary-text">' + escapeHtml(block.title) + '</span>' +
        '<svg class="details-chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>' +
        '</summary>\n' +
        detailedHtml +
        '\n</details>\n';
      bodyHtml = bodyHtml.replace(`<!--DETAILS_${i}-->`, detailsHtml);
    }

    parts.push(`      <section id="${section.id}">\n${bodyHtml}\n      </section>`);
  }
  return parts.join('\n\n');
}

function buildNavHtml(sections) {
  return sections
    .map(({ id, title }) => `          <li><a href="#${id}">${escapeHtml(title)}</a></li>`)
    .join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  const meta = loadMeta();
  const siteTitle = meta.siteTitle != null ? meta.siteTitle : '[Site Title]';

  const { sections, warnings: discoverWarnings } = discoverSections();
  const allWarnings = [...discoverWarnings];

  // Process images
  const { totalProcessed, warnings: imageWarnings, dimensions } = await processImages(sections);
  allWarnings.push(...imageWarnings);

  // Build HTML
  const sectionsHtml = buildSectionsHtml(sections, dimensions);
  const navHtml = buildNavHtml(sections);

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  template = template.replace(/\{\{siteTitle\}\}/g, escapeHtml(siteTitle));
  template = template.replace('{{nav}}', navHtml);
  template = template.replace('{{sections}}', sectionsHtml);

  fs.writeFileSync(OUTPUT_PATH, template, 'utf8');

  // Print summary
  for (const w of allWarnings) console.warn(w);
  console.log(
    `Built ${sections.length} section${sections.length !== 1 ? 's' : ''}, ` +
    `processed ${totalProcessed} image${totalProcessed !== 1 ? 's' : ''}, ` +
    `${allWarnings.length} warning${allWarnings.length !== 1 ? 's' : ''}.`
  );
}

run().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

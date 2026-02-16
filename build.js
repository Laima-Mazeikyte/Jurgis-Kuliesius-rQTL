const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname);
const CONTENT_DIR = path.join(ROOT, 'content');
const TEMPLATE_PATH = path.join(ROOT, 'index.template.html');
const OUTPUT_PATH = path.join(ROOT, 'index.html');
const META_PATH = path.join(CONTENT_DIR, 'meta.json');

function loadMeta() {
  const raw = fs.readFileSync(META_PATH, 'utf8');
  return JSON.parse(raw);
}

function buildSections(meta) {
  const sections = meta.sections || [];
  const sectionHtml = [];

  for (const { id, label } of sections) {
    const mdPath = path.join(CONTENT_DIR, `${id}.md`);
    if (!fs.existsSync(mdPath)) {
      console.warn(`Missing ${id}.md, skipping section "${id}"`);
      continue;
    }
    const md = fs.readFileSync(mdPath, 'utf8');
    const bodyHtml = marked.parse(md);
    sectionHtml.push(`      <section id="${id}">\n${bodyHtml}\n      </section>`);
  }

  return sectionHtml.join('\n\n');
}

function buildNav(meta) {
  const sections = meta.sections || [];
  return sections
    .map(({ id, label }) => `          <li><a href="#${id}">${escapeHtml(label)}</a></li>`)
    .join('\n');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function run() {
  const meta = loadMeta();
  const siteTitle = meta.siteTitle != null ? meta.siteTitle : '[Site Title]';
  const sectionsHtml = buildSections(meta);
  const navHtml = buildNav(meta);

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  template = template.replace('{{siteTitle}}', escapeHtml(siteTitle));
  template = template.replace('{{nav}}', navHtml);
  template = template.replace('{{sections}}', sectionsHtml);

  fs.writeFileSync(OUTPUT_PATH, template, 'utf8');
  console.log('Built index.html');
}

run();

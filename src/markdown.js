/**
 * Markdown Viewer - Parser Module
 * Loads markdown-it + highlight.js + KaTeX from CDN
 */

let markdownit = null;
let hljs = null;
let katex = null;

/**
 * Load a script from a URL and wait for it to execute
 * @param {string} src - CDN URL
 * @returns {Promise<void>}
 */
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Escape a string for safe HTML insertion
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

/**
 * Render a LaTeX string using KaTeX
 * @param {string} latex
 * @param {boolean} displayMode
 * @returns {string} HTML string
 */
function renderLatex(latex, displayMode) {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      errorColor: '#cf222e',
    });
  } catch (err) {
    console.error('KaTeX render error:', err);
    return `<span class="katex-error" style="color:#cf222e">${escapeHtml(latex)}</span>`;
  }
}

/**
 * Preprocess content to extract and render LaTeX math before markdown parsing
 * Handles $$display$$ and $inline$ syntax
 * @param {string} content - Raw markdown content
 * @returns {string} HTML with math rendered
 */
function preprocessMath(content) {
  // Block math: $$...$$
  content = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `<div class="katex-display">${renderLatex(math, true)}</div>`;
  });

  // Inline math: $...$
  // Be careful not to match $$ or things that look like currency
  // Match $...$ where ... doesn't contain unescaped $ or newlines adjacent to $
  content = content.replace(/(?<!\$)\$(?!\$)((?:[^$\n]|\\\$)+?)\$/g, (_, math) => {
    return `<span class="katex-inline">${renderLatex(math, false)}</span>`;
  });

  return content;
}

/**
 * Postprocess HTML to handle inline math that markdown-it may have escaped
 * Inline $...$ inside text paragraphs
 * @param {string} html
 * @returns {string}
 */
function postprocessInlineMath(html) {
  return html;
}

async function loadDeps() {
  if (markdownit && hljs && katex) return;

  // Load markdown-it
  await loadScript('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js');

  // Load full highlight.js from cdnjs (has all languages bundled)
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');

  // Load KaTeX
  await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js');

  hljs = window.hljs;
  katex = window.katex;
  markdownit = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    gfm: true,
  });

  markdownit.set({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + markdownit.utils.escapeHtml(str) + '</code></pre>';
    }
  });
}

export async function initDeps() {
  await loadDeps();
}

export async function renderMarkdown(content) {
  await loadDeps();

  // Preprocess: extract and render math before markdown parsing
  const withMath = preprocessMath(content);

  // Render markdown
  let html = markdownit.render(withMath);

  return html;
}
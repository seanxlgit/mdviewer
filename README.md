# mdviewer

A lightweight, browser-based markdown viewer with GitHub Flavored Markdown support, syntax highlighting, and LaTeX math rendering.

## Features

- **Drag & drop** — drop any `.md` file directly into the viewer
- **File picker** — click to open the file browser
- **GitHub Flavored Markdown** — tables, task lists, strikethrough, and more
- **Syntax highlighting** — full code block highlighting via highlight.js
- **LaTeX math** — renders `$$display$$` and `$inline$` math via KaTeX
- **Dark / light theme** — toggle with the sun/moon button, respects system preference

## Usage

### Serve locally

```bash
python3 serve.py
```

This opens `http://localhost:8080` in your browser automatically.

Alternatively, open `src/index.html` directly in a browser.

### Drop a file

Drag any markdown file onto the drop zone, or click **Open File** to browse.

### Math rendering

Display math (block, centered):

```
$$
\frac{103 \times 17}{136} - \frac{65 \times 8}{136} = \frac{1231}{136}
$$
```

Inline math:

```
The fraction is $\frac{a}{b}$.
```

### Theme toggle

Click the sun/moon icon in the top-right corner to switch between light and dark mode. Preference is saved automatically.

## Tech stack

| | |
|---|---|
| Parser | [markdown-it](https://markdown-it.github.io/) |
| Syntax highlighting | [highlight.js](https://highlightjs.org/) |
| Math rendering | [KaTeX](https://katex.org/) |
| Server | Python `http.server` |

## License

MIT
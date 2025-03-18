# Minier 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Minify](https://img.shields.io/badge/Minify-Enabled-brightgreen.svg)](https://www.npmjs.com/package/minify)

## Description

Minier is a GitHub Action that minifies JS, CSS, and HTML files using the [Minify](https://www.npmjs.com/package/minify) library. It helps reduce the size of your files, improving website loading times and overall performance. ⚡

## Inputs

| Input       | Description                                                                                                                               | Required |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `path`      | The path to a directory or a single file to minify.                                                                                       | false    |
| `types`     | Comma-separated list of file types to minify (e.g., `js,css,html`). If `path` is a directory, these types will be minified.                | false    |
| `type`      | A single file type to minify (`js`, `css`, or `html`). This takes precedence over `types`.                                                | false    |
| `file_list` | Comma-separated list of specific files to minify. This takes precedence over `path` and `types`.                                         | false    |
| `options`   | JSON string of options to pass to Minify. See [Minify Options](https://www.npmjs.com/package/minify#options) for available options. | false    |

## Usage

### Basic Example (Minify all JS, CSS, and HTML files in a directory)

```yaml
- uses: actions/checkout@v4
- uses: UsSubDidIt/Minier@main
  with:
    path: 'src'
```

### Example (Minify specific files)

```yaml
- uses: actions/checkout@v4
- uses: UsSubDidIt/Minier@main
  with:
    file_list: 'src/index.js,src/style.css'
```
### Example (Minify with options)

```yaml
- uses: actions/checkout@v4
- uses: UsSubDidIt/Minier@main
  with:
    path: 'src'
    options: '{ "js": { "mangle": false } }'
```

## Installation (For Local Development)

```bash
npm install
```

## Run Locally

```bash
node index.js
```

## Repository

[https://github.com/UsSubDidIt/Minier](https://github.com/UsSubDidIt/Minier)

## License

MIT
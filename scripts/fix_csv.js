const fs = require('fs');
const path = 'docs/project_changelog.csv';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');
const lastLineIndex = lines.length - 1 - (lines[lines.length-1] === '' ? 1 : 0);
if (lines[lastLineIndex].includes('Fix ESLint errors and unescaped entities to resolve build failures')) {
  lines[lastLineIndex] = `2026-06-11,"Fix ESLint errors and unescaped entities to resolve build failures","🚀 FastLearners production build is officially green! Cleaned up code layout, escaped JSX characters, and squashed linter warnings so we compile flawlessly. Smooth deployments ahead! ✨ #NextJS #BuildInPublic #CleanCode"`;
}
fs.writeFileSync(path, lines.join('\n'));
console.log('Fixed CSV');

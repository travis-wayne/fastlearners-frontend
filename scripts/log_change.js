const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'docs', 'project_changelog.csv');

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split('T')[0];
const technicalChange = "Resolved platform-wide build errors including unescaped React entities, Tailwind CSS class order/shorthands, and TypeScript type mismatches.";
const socialMediaContent = "🚀 Clean build unlocked! We just polished FastLearners by resolving platform-wide Tailwind CSS order issues, fixing React entity bugs, and tightening our TypeScript types. The dashboard is now building faster and smoother than ever! 📈 #BuildInPublic #NextJS #TypeScript #CleanCode";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

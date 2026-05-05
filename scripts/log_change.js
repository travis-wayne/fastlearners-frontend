const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'docs', 'project_changelog.csv');

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split('T')[0];
const technicalChange = "Resolved Tailwind CSS classname order lint error in settings layout to fix build failure.";
const socialMediaContent = "🚀 Build fixed! Just resolved a Tailwind CSS class ordering issue in the FastLearners settings layout to keep our deployments smooth and error-free. Quality and consistency first! ✅📈 #BuildInPublic #NextJS #TailwindCSS #BugFix";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

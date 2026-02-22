const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'docs', 'project_changelog.csv');

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split('T')[0];
const technicalChange = "Fixed React compilation error by escaping > character in Teacher Performance page.";
const socialMediaContent = "🔧 Quick fix: Resolved a React compilation error in the Teacher Performance page to keep our analytics dashboards running smoothly! ✨ #BuildInPublic #NextJS #BugFix";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

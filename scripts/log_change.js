const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'docs', 'project_changelog.csv');

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split('T')[0];
const technicalChange = "Restored settings subpage navigation with horizontal tabs in layout, added missing Separator, and reverted Guardians/Children settings routes to render forms instead of redirects.";
const socialMediaContent = "🚀 Refined FastLearners settings! 🛠️ Restored full navigation between settings subpages with a sleek new tab bar, fixed header spacing, and brought back dedicated management for Guardians and Children. Smooth and complete. #BuildInPublic #NextJS #UIUX #EdTech";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

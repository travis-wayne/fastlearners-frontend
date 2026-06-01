const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "docs", "project_changelog.csv");

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split("T")[0];
const technicalChange =
  "Fixed a build error by excluding the docs/ directory from tsconfig.json, preventing type checking failures on old codebase files.";
const socialMediaContent =
  "🚀 Build fixed! Excluded old docs files from our TypeScript configuration, ensuring a smooth and error-free build process for FastLearners. Keeping our codebase clean and deployment-ready! ✅📈 #BuildInPublic #NextJS #TypeScript #BugFix";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

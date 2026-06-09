const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "docs", "project_changelog.csv");

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split("T")[0];
const technicalChange = process.argv[2] || "Updated subscription and transaction types, unified tables with serial columns, updated statuses";
const socialMediaContent = process.argv[3] || "🚀 Enhanced FastLearners subscription tracking! Added processing status, discount columns, unified tables with serial numbers, and squashed status badge issues. Tables are perfectly synced with backend types! 💯 #NextJS #BuildInPublic #Typescript";

const newRow = `${date},"${technicalChange.replace(/"/g, '""')}","${socialMediaContent.replace(/"/g, '""')}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "docs", "project_changelog.csv");

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split("T")[0];
const technicalChange =
  "Resolved production build failures by fixing Tailwind CSS classname ordering and enforce-shorthand rules, escaping JSX apostrophes in components/records/GuardianRecordsPage.tsx and app/(protected)/dashboard/subscriptions/transactions/page.tsx, and resolving missing useEffect dependency warnings.";
const socialMediaContent =
  "🚀 FastLearners production build is officially green! Cleaned up code layout, escaped JSX characters, and squashed linter warnings so we compile flawlessly. Smooth deployments ahead! ✨ #NextJS #BuildInPublic #CleanCode";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

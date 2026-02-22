const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'docs', 'project_changelog.csv');

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "Date,Technical_Change,Social_Media_Content\n");
}

const date = new Date().toISOString().split('T')[0];
const technicalChange = "Replaced legacy WAEC grading logic with dynamic A=90+ grading scale across SubjectDashboard and SubjectCard.";
const socialMediaContent = "✨ Even more Polish: we've unified the FastLearners grading system site-wide! A uniform grading scale for your performance. Keep excelling! 🚀 #BuildInPublic #NextJS";

const newRow = `${date},"${technicalChange}","${socialMediaContent}"\n`;

fs.appendFileSync(logFile, newRow);
console.log("Change logged successfully to docs/project_changelog.csv");

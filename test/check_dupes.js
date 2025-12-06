const fs = require("fs");
const css = fs.readFileSync("dist/kf.css", "utf8");

// Primitive regex to find selectors
// Matches "selector {" or "selector,"
const selectorRegex = /([^{,]+)(?=\{|,)/g;

const matches = css.match(selectorRegex);
const counts = {};

if (matches) {
  matches.forEach((sel) => {
    let s = sel.trim();
    // Ignore media queries and keyframes
    if (s.startsWith("@") || s.includes("0%") || s.includes("100%")) return;

    // Normalize spaces
    s = s.replace(/\s+/g, " ");

    if (s) {
      counts[s] = (counts[s] || 0) + 1;
    }
  });
}

console.log("--- DUPLICATE SELECTORS ---");
let found = false;
Object.entries(counts).forEach(([sel, count]) => {
  if (count > 1) {
    console.log(`${sel}: ${count} times`);
    found = true;
  }
});
if (!found) console.log("None found.");

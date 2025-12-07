const fs = require("fs");
const path = require("path");

const INPUT_FILE = process.argv[2] || "dist/kf.css";
const OUTPUT_FILE = process.argv[3] || "dist/kf-responsive.css";

// Regex to find CSS variables: --breakpoint-m: 768px;
// Matches: --breakpoint-(name): (value);
const VAR_REGEX = /--breakpoint-([a-zA-Z0-9_-]+):\s*([^;]+);/g;

// Rules to Ignore (Exact class names, no dot)
const IGNORED_CLASSES = new Set([
  "container",
  "block",
  // Add other static layout classes here if needed
]);

// Regex to capture complete CSS rules: .classname { ... }
const RULE_REGEX =
  /(^\s*\.[a-zA-Z0-9_\-]+(?::[a-zA-Z0-9_\-]+)*)\s*\{([^}]+)\}/gm;

function main() {
  const inputPath = path.resolve(INPUT_FILE);
  const outputPath = path.resolve(OUTPUT_FILE);

  console.log(`Reading CSS from: ${inputPath}`);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(inputPath, "utf8");

  // 1. Extract Breakpoints from CSS Variables
  const breakpoints = [];
  let varMatch;
  while ((varMatch = VAR_REGEX.exec(cssContent)) !== null) {
    breakpoints.push({
      prefix: varMatch[1].trim(),
      minWidth: varMatch[2].trim(),
    });
  }

  // Fallback / Safety
  if (breakpoints.length === 0) {
    console.warn(
      "Warning: No --breakpoint- variables found in CSS. Using defaults."
    );
    breakpoints.push(
      { prefix: "m", minWidth: "768px" },
      { prefix: "l", minWidth: "992px" },
      { prefix: "xl", minWidth: "1400px" }
    );
  } else {
    console.log(
      "Detected Breakpoints:",
      breakpoints.map((b) => `${b.prefix} (${b.minWidth})`).join(", ")
    );
  }

  // 2. Prepare Output
  let responsiveCSS = cssContent + "\n\n/* Generated Responsive Utilities */\n";

  // 3. Generate Variants
  breakpoints.forEach((bp) => {
    responsiveCSS += `\n/* --- Breakpoint: ${bp.prefix} (${bp.minWidth}) --- */\n`;
    responsiveCSS += `@media (min-width: ${bp.minWidth}) {\n`;

    let match;
    let count = 0;
    RULE_REGEX.lastIndex = 0; // Reset regex

    while ((match = RULE_REGEX.exec(cssContent)) !== null) {
      const originalSelector = match[1].trim(); // e.g. ".p-4"
      const body = match[2].trim(); // e.g. "padding: 1rem;"

      const className = originalSelector.substring(1); // remove dot

      // Skip Ignored Classes
      if (IGNORED_CLASSES.has(className)) {
        continue;
      }

      const newSelector = `.${bp.prefix}\\:${className}`; // .m:p-4

      responsiveCSS += `  ${newSelector} { ${body} }\n`;
      count++;
    }

    responsiveCSS += `}\n`;
    console.log(`  Generated ${count} classes for '${bp.prefix}'`);
  });

  fs.writeFileSync(outputPath, responsiveCSS);
  console.log(`\nSuccess! Wrote responsive variants to: ${outputPath}`);
}

main();

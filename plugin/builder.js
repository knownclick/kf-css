const sass = require("sass");
const fs = require("fs-extra");
const path = require("path");

// Function to extract breakpoints from CSS variables
// Matches: --breakpoint-([name]): (value);
const VAR_REGEX = /--breakpoint-([a-zA-Z0-9_-]+):\s*([^;]+);/g;

// Regex to capture complete CSS rules for mirroring
const RULE_REGEX =
  /(^\s*\.[a-zA-Z0-9_\-]+(?::[a-zA-Z0-9_\-]+)*)\s*\{([^}]+)\}/gm;

// Classes to ignore during responsive generation
const IGNORED_CLASSES = new Set([
  "container",
  "block",
  // Add other static layout classes here if needed
]);

/**
 * reliableBuild function
 * Combines Sass Compilation + Responsive Generation (Mirroring)
 *
 * @param {string} entryPoint - Path to main.scss (e.g. src/lib/kf-css/src/main.scss)
 * @param {string} outputDir - Directory to output kf.css and kf-responsive.css
 * @param {boolean} silent - Whether to suppress logs
 */
async function build(entryPoint, outputDir, silent = false) {
  const start = Date.now();
  if (!silent) console.log(`[kf-css] Building from ${entryPoint}...`);

  // 1. Compile Sass
  let cssResult;
  try {
    cssResult = sass.compile(entryPoint, {
      style: "expanded", // Easier to parse for regex
      loadPaths: [path.dirname(entryPoint)], // Allow imports relative to main.scss
    });
  } catch (err) {
    console.error("[kf-css] Sass Compilation Error:", err.message);
    throw err;
  }

  const cssContent = cssResult.css;
  const kfCssPath = path.join(outputDir, "kf.css");

  // Ensure output dir exists
  await fs.ensureDir(outputDir);
  await fs.writeFile(kfCssPath, cssContent);

  // 2. Generate Responsive Variants (The "Mirror" Logic)

  // 2a. Extract Breakpoints
  const breakpoints = [];
  let varMatch;
  while ((varMatch = VAR_REGEX.exec(cssContent)) !== null) {
    breakpoints.push({
      prefix: varMatch[1].trim(),
      minWidth: varMatch[2].trim(),
    });
  }

  // Fallback defaults if no breakpoints found
  if (breakpoints.length === 0) {
    breakpoints.push(
      { prefix: "m", minWidth: "768px" },
      { prefix: "l", minWidth: "992px" },
      { prefix: "xl", minWidth: "1400px" }
    );
  }

  // 2b. Generate Variants
  let responsiveCSS = cssContent + "\n\n/* Generated Responsive Utilities */\n";

  breakpoints.forEach((bp) => {
    responsiveCSS += `\n/* --- Breakpoint: ${bp.prefix} (${bp.minWidth}) --- */\n`;
    responsiveCSS += `@media (min-width: ${bp.minWidth}) {\n`;

    let match;
    let count = 0;
    RULE_REGEX.lastIndex = 0; // Reset regex

    while ((match = RULE_REGEX.exec(cssContent)) !== null) {
      const originalSelector = match[1].trim();
      const body = match[2].trim();
      const className = originalSelector.substring(1); // remove dot

      if (IGNORED_CLASSES.has(className)) continue;

      const newSelector = `.${bp.prefix}\\:${className}`; // e.g. .m:p-4
      responsiveCSS += `  ${newSelector} { ${body} }\n`;
      count++;
    }
    responsiveCSS += `}\n`;
  });

  const finalPath = path.join(outputDir, "kf-responsive.css");
  await fs.writeFile(finalPath, responsiveCSS);

  if (!silent) {
    console.log(`[kf-css] Build complete in ${Date.now() - start}ms.`);
    console.log(`         - Base: ${kfCssPath}`);
    console.log(`         - Responsive: ${finalPath}`);
  }

  return responsiveCSS;
}

module.exports = { build };

#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");
// Parsing arguments or other setup could go here.

async function init() {
  console.log(
    `\n  ${bold("kf-css")}  ${gray("v" + require("../package.json").version)}\n`
  );

  const cwd = process.cwd();

  // 1. Detect Project Type
  const isSvelteKit = fs.existsSync(path.join(cwd, "svelte.config.js"));
  const defaultTarget = isSvelteKit ? "src/lib/kf-css" : "kf-css";

  // 2. Confirm Target Directory
  const response = await prompts({
    type: "text",
    name: "targetDir",
    message: "Where would you like to install kf-css?",
    initial: defaultTarget,
  });

  if (!response.targetDir) {
    console.log("Operation cancelled.");
    process.exit(1);
  }

  const targetPath = path.resolve(cwd, response.targetDir);
  const targetDisplay = path.relative(cwd, targetPath);

  // 3. Confirm Overwrite
  if (fs.existsSync(targetPath)) {
    const overwrite = await prompts({
      type: "confirm",
      name: "value",
      message: `Directory "${targetDisplay}" already exists. Overwrite?`,
      initial: false,
    });

    if (!overwrite.value) {
      console.log("Operation cancelled.");
      process.exit(1);
    }
  }

  // 4. Copy Files
  const srcDir = path.resolve(__dirname, "../src");
  const binDir = path.resolve(__dirname, "../bin");

  try {
    // Copy src/
    await fs.copy(srcDir, path.join(targetPath, "src"));
    // Copy bin/ (mirror.js, vite-plugin.js)
    await fs.copy(binDir, path.join(targetPath, "bin"));

    console.log(
      `\n${green("Success!")} kf-css initialized in ${bold(targetDisplay)}.\n`
    );

    if (isSvelteKit) {
      console.log("Next steps:");
      console.log(`1. Install Sass: ${cyan("npm i -D sass")}`);
      console.log(`2. Update ${bold("vite.config.js")}:`);
      console.log(
        `     ${cyan(
          `import { kfCss } from './${targetDisplay}/bin/vite-plugin.js';`
        )}`
      );
      console.log(`     plugins: [..., kfCss()]`);
      console.log(`3. Import CSS in ${bold("+layout.svelte")}:`);
      console.log(`     ${cyan(`import '$lib/kf-css/kf-responsive.css';`)}\n`);
    } else {
      console.log("Next steps:");
      console.log(`  See README for setup instructions.\n`);
    }
  } catch (err) {
    console.error(red("Error copying files:"), err);
    process.exit(1);
  }
}

// Simple color helpers to avoid extra dependency
function bold(msg) {
  return `\x1b[1m${msg}\x1b[0m`;
}
function gray(msg) {
  return `\x1b[90m${msg}\x1b[0m`;
}
function green(msg) {
  return `\x1b[32m${msg}\x1b[0m`;
}
function red(msg) {
  return `\x1b[31m${msg}\x1b[0m`;
}
function cyan(msg) {
  return `\x1b[36m${msg}\x1b[0m`;
}

init().catch((e) => {
  console.error(e);
});

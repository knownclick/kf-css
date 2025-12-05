#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");
// Parsing arguments or other setup could go here.

async function init() {
  console.log(
    `\n  ${bold("kc-css")}  ${gray("v" + require("../package.json").version)}\n`
  );

  const cwd = process.cwd();

  // 1. Detect Project Type
  const isSvelteKit = fs.existsSync(path.join(cwd, "svelte.config.js"));
  const defaultTarget = isSvelteKit ? "src/lib/kc-css" : "kc-css";

  // 2. Confirm Target Directory
  const response = await prompts({
    type: "text",
    name: "targetDir",
    message: "Where would you like to install kc-css?",
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
  const sourceDir = path.resolve(__dirname, "../src");

  try {
    await fs.copy(sourceDir, targetPath);

    console.log(
      `\n${green("Success!")} kc-css initialized in ${bold(targetDisplay)}.\n`
    );

    if (isSvelteKit && targetDisplay.includes("lib")) {
      console.log("Next steps:");
      console.log(
        `  Import the styles in your ${bold("src/routes/+layout.svelte")}:`
      );
      console.log(`  ${cyan("import '$lib/kc-css/main.scss';")}\n`);
    } else {
      console.log("Next steps:");
      console.log(`  Import the styles in your main entry file:`);
      console.log(`  ${cyan(`@use "./${targetDisplay}/main";`)}\n`);
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

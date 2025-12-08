#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");
const { build } = require("../plugin/builder");
const { injectViteConfig } = require("./injector");

// Parsing arguments
const args = process.argv.slice(2);
const command = args[0];

async function init() {
  console.log(
    `\n  ${bold("kf-css")}  ${gray("v" + require("../package.json").version)}\n`
  );

  if (command === "build") {
    // MANUAL BUILD COMMAND
    // npx kf-css build [entry] [outDir]
    const cwd = process.cwd();
    // Default paths based on standard scaffold
    const entry = args[1] || "src/lib/kf-css/src/main.scss";
    const outDir = args[2] || "src/lib/kf-css/dist";

    const entryPath = path.resolve(cwd, entry);
    const outPath = path.resolve(cwd, outDir);

    try {
      if (!fs.existsSync(entryPath)) {
        console.error(red(`Error: Entry file not found at ${entry}`));
        process.exit(1);
      }
      await build(entryPath, outPath);
      process.exit(0);
    } catch (e) {
      console.error(red("Build failed:"), e.message);
      process.exit(1);
    }
  }

  // SCAFFOLD COMMAND (Default)
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
  // NOTE: We no longer copy the 'bin' folder. Automation is handled by the package plugin.

  try {
    // Copy src/ (The Editable Config/Components)
    await fs.copy(srcDir, path.join(targetPath, "src"));

    console.log(
      `\n${green("Success!")} kf-css initialized in ${bold(targetDisplay)}.\n`
    );

    if (isSvelteKit) {
      console.log("Next steps:");
      console.log(`1. Install Sass: ${cyan("npm i -D sass")}`);

      // AUTO-INJECT LOGIC
      const defaultPath = "src/lib/kf-css";
      const relativeTarget = targetDisplay.split(path.sep).join("/");

      let injected = false;
      let injectionResult = { success: false, reason: "Skipped" };

      if (relativeTarget === defaultPath) {
        console.log(`2. Configuring Vite...`);
        injectionResult = injectViteConfig(cwd); // injectViteConfig must be imported
        if (injectionResult.success) {
          injected = true;
          console.log(
            `   ${green("✓")} Added kfCss() to ${bold(injectionResult.file)}`
          );
        } else if (injectionResult.alreadyExists) {
          injected = true;
          console.log(`   ${green("✓")} kfCss() already present in config.`);
        } else {
          console.log(
            `   ${red("!")} Could not auto-configure Vite: ${
              injectionResult.reason
            }`
          );
        }
      }

      if (!injected) {
        console.log(`2. Update ${bold("vite.config.js")}:`);
        console.log(`     ${cyan(`import { kfCss } from 'kf-css';`)}`);
      }

      console.log(`3. Import CSS in ${bold("+layout.svelte")}:`);
      console.log(`     ${cyan(`import 'virtual:kf-css';`)}\n`);
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

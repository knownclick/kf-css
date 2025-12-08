const fs = require("fs-extra");
const path = require("path");
const { injectViteConfig } = require("./bin/injector");

const MOCK_DIR = path.resolve(__dirname, "mock-project");
const MOCK_CONFIG = `import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});`;

async function runTest() {
  await fs.ensureDir(MOCK_DIR);
  const configFile = path.join(MOCK_DIR, "vite.config.js");
  await fs.writeFile(configFile, MOCK_CONFIG);

  console.log("--- Initial Config ---");
  console.log(MOCK_CONFIG);

  console.log("\n--- Injecting ---");
  const result = injectViteConfig(MOCK_DIR);
  console.log("Result:", result);

  const newContent = await fs.readFile(configFile, "utf8");
  console.log("\n--- Updated Config ---");
  console.log(newContent);

  if (
    newContent.includes("import { kfCss } from 'kf-css';") &&
    newContent.includes("kfCss({})")
  ) {
    console.log("\nSUCCESS: Config injected.");
    await fs.remove(MOCK_DIR);
    process.exit(0);
  } else {
    console.error("\nFAILURE: Injection failed.");
    await fs.remove(MOCK_DIR);
    process.exit(1);
  }
}

runTest();

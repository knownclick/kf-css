const { kfCss } = require("./");
// In a real scenario this would be require('kf-css') but we are inside the package.
// We require '.' because package.json main points to plugin/index.js

console.log("Resolved kf-css export type:", typeof kfCss);
console.log("Plugin Name:", kfCss().name);

if (typeof kfCss === "function" && kfCss().name === "kf-css-automator") {
  console.log("SUCCESS: kf-css correctly exports the plugin.");
} else {
  console.error("FAILURE: Export validation failed.");
  process.exit(1);
}

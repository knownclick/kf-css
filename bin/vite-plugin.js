import { exec } from "child_process";
import path from "path";

/**
 * Vite Plugin for kf-css
 * Automatically watches and rebuilds kf-css styles during development.
 *
 * Usage in vite.config.js:
 * import { kfCss } from './src/lib/kf-css/bin/vite-plugin.js';
 * plugins: [kfCss()]
 */
export function kfCss(options = {}) {
  // Default to assuming we are in src/lib/kf-css if not specified
  const {
    watchPattern = "src/lib/kf-css/src/**/*.scss",
    buildCommand = "sass src/lib/kf-css/src/main.scss src/lib/kf-css/dist/kf.css && node src/lib/kf-css/bin/mirror.js src/lib/kf-css/dist/kf.css src/lib/kf-css/kf-responsive.css",
  } = options;

  return {
    name: "kf-css-automator",

    // Run build on startup
    buildStart() {
      console.log("\x1b[36m%s\x1b[0m", "[kf-css] Starting initial build...");
      this.runBuild(buildCommand);
    },

    // Hook into Vite's watcher
    configureServer(server) {
      const watcher = server.watcher;

      // Add our pattern to watcher
      watcher.add(path.resolve(process.cwd(), watchPattern));

      // Watch for changes
      watcher.on("change", (file) => {
        // Normalize path separators for Windows compatibility
        const normalizedFile = file.split(path.sep).join("/");

        // Check if the changed file matches our internal SCSS
        // Note: simplified check, assuming standard scaffolding structure
        if (
          normalizedFile.includes("kf-css/src") &&
          normalizedFile.endsWith(".scss")
        ) {
          console.log(
            "\x1b[36m%s\x1b[0m",
            `[kf-css] Change detected: ${path.basename(file)}`
          );
          this.runBuild(buildCommand);
        }
      });
    },

    // Helper to run the command
    runBuild(cmd) {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error("\x1b[31m%s\x1b[0m", "[kf-css] Build failed:");
          console.error(stderr);
        } else {
          console.log("\x1b[32m%s\x1b[0m", "[kf-css] Styles updated.");
        }
      });
    },
  };
}

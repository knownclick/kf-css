import type { Plugin } from "vite";

export interface KfCssOptions {
  // No options needed as paths are auto-configured based on environment.
  // Advanced overrides can still be passed but are not typed/supported officially.
}

export function kfCss(options?: KfCssOptions): Plugin;

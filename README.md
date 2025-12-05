# kc-css

A modern, efficient CSS framework tailored for SvelteKit.

## Usage

**kc-css** is designed to be fully owned by you. Instead of importing from `node_modules`, you scaffold the entire source code into your project. usage is simple:

### 1. Initialize

Run the following command in your project root:

```bash
npx kc-css init
```

- **SvelteKit**: Automatically detects SvelteKit and installs to `src/lib/kc-css`.
- **Other Projects**: Installs to `./kc-css`.

### 2. Import

Import the main SCSS file.

**SvelteKit** (`src/routes/+layout.svelte`):

```svelte
<script>
  import '$lib/kc-css/main.scss';
</script>
```

**Other Javascript/Bundlers**:

```js
import "./kc-css/main.scss"; // Adjust path as needed
```

## Customization

You now own the code! Explore the `kc-css` folder:

- `src/config/`: Update colors, typography, and spacing variables here.
- `src/components/`: Add or modify component styles.
- `src/main.scss`: Toggle modules on or off.

## Post-Processing (Optimization)

Since `kc-css` is compiled by your project's bundler (Vite), you get automatic optimizations.

### Purging Unused CSS

To remove unused CSS in production, we recommend `vite-plugin-purgecss`.

**Install:**

```bash
npm install -D vite-plugin-purgecss
```

**Configure (`vite.config.js`):**

```js
import { purgeCss } from "vite-plugin-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), purgeCss()],
});
```

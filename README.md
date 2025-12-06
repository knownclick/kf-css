# kf-css

A modern, efficient CSS framework tailored for SvelteKit.

## Usage

**kf-css** is designed to be fully owned by you. Instead of importing from `node_modules`, you scaffold the entire source code into your project.

### 1. Initialize

Run the following command in your project root:

```bash
npx kf-css
```

- **SvelteKit**: Automatically detects SvelteKit and installs to `src/lib/kf-css`.
- **Other Projects**: Installs to `./kf-css`.

### 2. Import

Import the main SCSS file.

**SvelteKit** (`src/routes/+layout.svelte`):

```svelte
<script>
  import '$lib/kf-css/main.scss';
</script>
```

**Other Javascript/Bundlers**:

```js
import "./kf-css/main.scss"; // Adjust path as needed
```

## Customization

You now own the code! Explore the `kf-css` folder:

### 1. Configuration (`src/config/`)

Ideally, you only need to touch files in this folder to theme your site.

- **`_colors.scss`**: Define your color palette and theme generation settings.
- **`_typography.scss`**: Font families, sizes, and scale settings.
- **`_layout.scss`**: Breakpoints, container widths, and generic layout settings.
- **`_forms.scss`**: Input sizing, border widths, and focus ring settings.
- **`_custom.scss`**: **<-- Start here!** Define variables for your own custom components effectively extending the system.

### 2. Components (`src/components/`)

- **`_custom.scss`**: Write your own component styles here using variables from `config/_custom.scss`.
- `_buttons.scss`, `_forms.scss`: Core framework components (feel free to modify, but standard practice is to leave them be).

### 3. Main Entry

- **`main.scss`**: implementation loop. Toggle specific modules on/off if you don't need them.

## Handling Collisions (Known Issues)

- **`.block` Class**: The framework defines a semantic layout component `.block` (display: flex) AND a utility class `.block` (display: block).
  - **Advice**: If you use `<div class="block">`, the utility usually wins. If you need the semantic flex behavior, ensure the utility isn't overriding it, or use valid utility alternatives like `.flex` or specific `d-flex` classes if you add them.

## Post-Processing (Optimization)

Since `kf-css` is compiled by your project's bundler (Vite), you get automatic optimizations.

### Purging Unused CSS

To remove unused CSS in production, we recommend `vite-plugin-purgecss`.

**Install:**

```bash
npm install -D vite-plugin-purgecss
```

**Configure (`vite.config.js`):**

```js
import purgeCss from "vite-plugin-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), purgeCss({})],
});
```

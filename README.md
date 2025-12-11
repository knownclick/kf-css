<div align="center">

# kf-css

**A modern, efficient CSS framework tailored for SvelteKit.**  
_Semantic. Customizable. Lightweight (with PurgeCSS)._

[GitHub Repository](https://github.com/knownclick/kf-css)

</div>

---

## 🚀 Features

- **SvelteKit First**: Designed with SvelteKit's architecture in mind.
- **Automated Build**: Custom Vite plugin compiles your Sass automatically on server start.
- **Responsive**: Mirror utility that automatically generates responsive variants (e.g. `.m:p-m`).
- **Semantic**: Built on a solid design system of colors, typography, and spacing.
- **Customizable**: Built with Sass, easily configured via variables.

---

## 🏁 Complete Workflow

### 1. Install & Setup

Run these commands:

```bash
npm install kf-css
npx kf-css
```

- `npm install`: Downloads the framework.
- `npx kf-css`: Scaffolds `src/lib/kf-css` and **automatically updates** `vite.config.js`.

> **Note:** If `vite.config.js` is missing, it will be automatically created with the default configuration:
>
> ```javascript
> import { defineConfig } from 'vite';
> import { kfCss } from 'kf-css';
>
> export default defineConfig({
>   plugins: [kfCss()],
> });
> ```

### 2. Import

Add this single line to the top of your `src/routes/+layout.svelte` (or specific layout group):

```javascript
import 'virtual:kf-css';
```

### 3. Develop

Start your server:

```bash
npm run dev
```

The plugin compiles your `src/lib/kf-css` settings into CSS **once** when the server starts.
**Note:** If you change your Sass configuration (colors, spacing, etc.), you must **restart the server** to see the changes.

### 4. Build (Production)

When you deploy:

```bash
npm run build
```

The plugin automatically generates the final CSS files.

### 5. Optimize (PurgeCSS)

To remove unused CSS (highly recommended for production):

1.  **Install**: `npm install -D @fullhuman/postcss-purgecss`
2.  **Config**: Create `postcss.config.cjs` in your **project root**:

    ```javascript
    const purgecss = require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.{html,js,svelte,ts}'],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    });

    module.exports = {
      plugins: [...(process.env.NODE_ENV === 'production' ? [purgecss] : [])],
    };
    ```

---

## 🛠 Manual Build

If you need to build the CSS manually (e.g. for deployment inspection), you can run:

```bash
npx kf-css build
```

This generates `dist/kf.css` and `dist/kf-responsive.css` in your library folder.

---

## 🎨 Customization

The framework is configured via Sass variables in `src/config/`.

1.  **Colors**: Edit `config/colors.scss` to define your palette.
2.  **Typography**: Adjust `config/typography.scss` for font stacks and scales.
3.  **Breakpoints**: Modify `config/layout.scss`.

The `plugin/builder.js` logic reads your CSS variables (specifically `--breakpoint-*`) to generate responsive classes.

## ✨ New in v1.7.3

### 🖱️ Interactive States

We now support `hover:`, `focus:`, and `active:` prefixes for colors, shadows, and opacity!
This is **opt-in** to keep file sizes small. Enable it in your config:
`$defaults: ( "generate-interactive": true );` or specifically for a color map.

```html
<button class="bg-primary hover:bg-primary-d-1 hover:shadow-m">Hover Me</button>
```

### 📐 Gap Directionals

Control row and column gaps independently:

- `gap-x-*` (e.g. `gap-x-m` for horizontal gap)
- `gap-y-*` (e.g. `gap-y-s` for vertical gap)

### 🔲 Corner Radius

Target specific corners:

- `radius-tl-*` (Top Left)
- `radius-tr-*` (Top Right)
- `radius-bl-*` (Bottom Left)
- `radius-br-*` (Bottom Right)

### 🔄 Transforms

We now support individual transform properties:

- **Scale**: `scale-90`, `scale-105`, `scale-150`, etc.
- **Rotate**: `rotate-45`, `rotate-90`, `rotate-180`.
- **Translate**: `translate-x-full`, `translate-y-half`.
- _Note: X and Y translations can be used together._

---

## 📄 License

MIT

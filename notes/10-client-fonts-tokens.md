# 10 — Client fonts, assets, and design tokens

**Code / folders:**

- `client/src/index.css`  
- `client/src/assets/`  
- Design rules: `documentation/ui/design.md`

---

## 1. What is this?

Before building fancy screens, we set the **look**:

- brand colors  
- fonts  
- logo and decorative images  

These are called **design tokens** when stored as reusable values (especially CSS variables).

---

## 2. Why do this early?

If every screen invents its own green and font, the product looks messy and is hard to change later.

One source of truth:

- doc: `documentation/ui/design.md`  
- runtime: `client/src/index.css` + `client/src/assets/`

---

## 3. How it is implemented in this project

### Colors as CSS variables

In `index.css`:

```css
--color-primary: #34b17f;
--color-secondary: #0e3b35;
--color-surface: #f6f6f5;
...
```

Screens should use `var(--color-primary)` instead of random hex codes.

### Fonts self-hosted

Font files live under:

```text
client/src/assets/fonts/satoshi/
client/src/assets/fonts/plus-jakarta-sans/
```

`@font-face` in CSS tells the browser which file belongs to which family.

- **Satoshi** → brand / titles  
- **Plus Jakarta Sans** → normal UI text  

We do not depend on Google Fonts CDN for this setup.

### Images / SVG

```text
client/src/assets/logo/
client/src/assets/decor/
```

`App.jsx` imports them and shows the starter page.

### Staging folders at repo root

`Assets/` and `Fonts/` are archives/copies.  
App code should import only from `client/src/assets/`.

---

## 4. What you see

Open http://localhost:5173  

You should see PARKAR title with brand font + logo, on the surface background color.

---

## 5. Mental picture

> Design tokens = brand recipe.  
> `src/assets` = pantry the chef (React) is allowed to cook from.

---

## 6. What to read next

[11-client-api-layer.md](11-client-api-layer.md) (coming next work)

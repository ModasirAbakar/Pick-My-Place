
# Deploy checklist (Pick My Place)

Use this before you share a **public URL** (GitHub Pages, Netlify, school host, etc.).

## 1. Set your site origin (required for sharing / SEO)

In `**index.html`**, `**results.html**`, and `**about.html**`, find the token:

`__PICKMYPLACE_SITE__`

Replace **every** occurrence with your real **origin** (scheme + host, and **path** if the site is not at the domain root).

**No trailing slash** on the origin.


| Where you host              | Example replacement                             |
| --------------------------- | ----------------------------------------------- |
| GitHub Pages (project site) | `https://yourusername.github.io/your-repo-name` |
| GitHub Pages (user site)    | `https://yourusername.github.io`                |
| Custom domain (root)        | `https://www.yoursite.com`                      |


After replacement, these tags must be real URLs:

- `link rel="canonical"`
- `meta property="og:url"`
- `meta property="og:image"` and `meta name="twitter:image"`

**Validate:** paste a deployed page into [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [opengraph.xyz](https://www.opengraph.xyz/) after the first deploy (you may need to click "Scrape Again" once files are live).

### Optional: better social preview image

Some networks prefer a **PNG or JPEG** around **1200x630** instead of SVG. If previews look wrong, add `social.png` to the repo and change `og:image` / `twitter:image` to `__PICKMYPLACE_SITE__/social.png` (after you replace the token).

## 2. Lighthouse (Chrome)

1. Open your **deployed** `https://.../index.html` (not `file://`).
2. DevTools -> **Lighthouse** (or **Lighthouse** panel in Edge).
3. Mode: **Navigation**; Device: **Mobile** and again **Desktop**.
4. Categories: at least **Performance**, **Accessibility**, **Best Practices**, **SEO**.
5. Fix easy wins it lists (contrast, labels, tap targets, etc.).

This project already respects `**prefers-reduced-motion`** for long animations (hero glow, chip float, pulse).

## 3. Device QA (broader than one laptop)

Run through on **real devices** or browser device mode where it matters:


| Check                                   | Why                                                               |
| --------------------------------------- | ----------------------------------------------------------------- |
| **Submit form** -> results               | Core path                                                         |
| **Surprise me** -> results               | Second path                                                       |
| **Save pick** / remove / clear lists    | `localStorage`                                                    |
| **Copy results** on **HTTPS**           | Clipboard APIs often need a secure context                        |
| **iOS Safari** (or Safari on Mac)       | Different font/CSS behavior                                       |
| **Chrome Android** (or Android WebView) | Same                                                              |
| **Small phone width** (~360px)          | Form actions + results grid                                       |
| **Private / incognito**                 | Still works; note some mobile browsers clear storage aggressively |


## 4. GitHub Pages path reminder

If the live site is `https://user.github.io/repo-name/`, your replaced origin **must include** `/repo-name`. Assets like `styles.css` and `favicon.svg` are loaded relative to the HTML file, so they should keep working as long as you upload the whole folder unchanged.

## 5. After you change the token

Search the repo for `__PICKMYPLACE_SITE__` - there should be **zero** matches before you tell people the link.

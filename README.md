# Kirana Supply Hub

A prototype static web app for B2B kirana supply chain workflows.

## Files
- `index.html` — app UI and content
- `style.css` — styling and layout
- `script.js` — interactive ordering, supplier search, and finance mock logic

## Preview locally
1. Open `index.html` in your browser.
2. Or run a local HTTP server if you have Python:
   - `python -m http.server 8000`
   - open `http://localhost:8000`

## Publish options

### GitHub Pages
1. Install Git: https://git-scm.com/downloads
2. Create a GitHub repo.
3. From this folder:
   ```powershell
   git init
   git add .
   git commit -m "Initial kirana supply hub prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
4. In GitHub repo settings, enable **Pages** from `main` branch and root.

### Netlify
1. Create a Netlify account.
2. Connect the GitHub repo or drag-and-drop this folder.
3. Netlify will publish the static site with a live URL.

### Vercel
1. Create a Vercel account.
2. Import this repository.
3. Deploy the static site.

## Notes
- This is a static site, so no backend is required.
- If you want a custom domain later, GitHub Pages / Netlify / Vercel all support it.

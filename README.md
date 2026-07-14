# Daily Ledger — setup

This is a static web app: no server, no build step, your data never leaves your phone.

## 1. Put it online (free, ~5 minutes)

You need HTTPS hosting for "Add to Home Screen" to give you full offline support. Easiest free option: **GitHub Pages**.

1. Create a free GitHub account if you don't have one (github.com).
2. Create a new repository, e.g. `ledger` (can be public).
3. Upload every file in this folder (keep the `icons/` folder as a folder) — either drag-and-drop on github.com, or via git:
   ```
   git init
   git add .
   git commit -m "ledger app"
   git branch -M main
   git remote add origin https://github.com/ramin711711/Budget-Manager-For-College.git
   git push -u origin main
   ```
4. In the repo, go to **Settings → Pages**, set Source to `main` branch, root folder. Save.
5. Wait ~1 minute, then your app is live at:
   `https://ramin711711.github.io/Budget-Manager-For-College/`

Alternatives that also work and are free: Netlify Drop (netlify.com/drop — drag the folder in, done), Vercel, Cloudflare Pages.

## 2. Install it on your phone

**iPhone (Safari):** open the link → tap Share → **Add to Home Screen**.
**Android (Chrome):** open the link → tap the ⋮ menu → **Add to Home screen** / **Install app**.

Once installed, it opens full-screen like a real app and works with no internet connection.

## 3. Your data

Everything (budget, transactions, categories) is stored only in your phone's browser storage for that installed app. It is not sent anywhere.

- **Back up:** Settings → Export backup (JSON) — saves a file you can keep in iCloud/Drive/email to yourself.
- **Restore:** Settings → Import backup, or use "Restore from backup file" on first launch if you reinstall or switch phones.

Do this occasionally, especially before offloading the app or getting a new phone — reinstalling the PWA fresh does not carry old data over automatically.

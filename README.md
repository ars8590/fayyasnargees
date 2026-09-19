# Nikkah Invitation | Fayyas & Nargees 💍

An editorial, luxury mobile-first wedding invitation web application built for the Nikkah ceremony of Fayyas & Nargees on **Sunday, 27 September 2026**.

## Features

- **Editorial Opening Experience**: Silk curtain video animation with smooth transition into the invitation.
- **Interactive Audio**: Atmospheric background score with floating toggle and smart tab-visibility handling.
- **Scratch-to-Reveal**: Metallic antique gold foil scratch card revealing the wedding date with realistic dual-cannon confetti popper.
- **Live Countdown**: Real-time days, hours, minutes, and seconds counter.
- **Venue & Google Maps Deep Link**: One-tap navigation to the bride's home in Perumparambu, Areekode, Malappuram, Kerala.
- **Instant WhatsApp RSVP**: Pre-formatted Joyfully Accept / Regretfully Decline responses directly to WhatsApp.
- **Production Caching & Security**: Configured with immutable asset caching (`Cache-Control: max-age=31536000, immutable`) and security headers in `vercel.json`.

---

## 🚀 How to Host on Vercel

### Method 1: Deploy via GitHub (Recommended)

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Production-ready Nikkah invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nikkah-invitation.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Sign in and select your `nikkah-invitation` repository.
   - Leave the **Framework Preset** as **Other** (it will automatically detect the static project and `vercel.json`).
   - Click **Deploy**.

Your invitation will be live in seconds at `https://your-project.vercel.app`!

---

### Method 2: Deploy via Vercel CLI

If you prefer deploying directly from your terminal:

1. Run:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts:
   - Set up and deploy? `y`
   - Which scope? Select your personal or team account
   - Link to existing project? `n`
   - Project name? `nikkah-invitation`
   - In which directory is your code located? `./`
3. To deploy to production:
   ```bash
   npx vercel --prod
   ```

---

## 📱 Social Sharing & WhatsApp Preview Setup

When sharing the link on WhatsApp, iMessage, or Instagram, platforms generate rich link previews using Open Graph tags.

Once your Vercel deployment URL (e.g. `https://fayyas-nargees.vercel.app` or a custom domain) is live:
In `index.html`, ensure the `og:image` and `twitter:image` tags point to your live domain or leave the relative paths which Vercel resolves automatically.

To test your WhatsApp preview before sending to guests, you can test by sending the link to yourself or using [opengraph.xyz](https://www.opengraph.xyz/).

---

## 🛠 Local Development

To preview locally:
```bash
npx serve .
```
Or open with any local static HTTP server (e.g. VS Code Live Server or Python `python -m http.server 8088`).

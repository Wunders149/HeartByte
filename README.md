# 💖 HeartByte: 8-Bit Speed Dating & Fundraiser

An arcade-styled retro speed dating simulator and charity fundraiser platform. Built with React, TypeScript, Tailwind CSS, Lucide icons, Canvas Confetti, and procedural Web Audio chiptune synthesizers.

Live Demo: [https://wunders149.github.io/HeartByte/](https://wunders149.github.io/HeartByte/)

---

## 🕹️ Features

- **🎮 Retro 8-Bit Pixel Aesthetic**: CRT scanline toggle, nostalgic neon palettes, and retro typography (`Press Start 2P`, `Silkscreen`).
- **👾 Custom Pixel Sprite Generator**: Customize hair, body colors, accessories, eyes, expressions, or roll randomized retro avatars.
- **🔊 Procedural Chiptune Audio**: Built-in Web Audio API synthesizers producing authentic square wave blips, match fanfare arpeggios, coin dings, and chime sounds.
- **⚡ Fast-Paced Speed Dating Rounds**: 45-second timer per suitor, dynamic conversation prompts with real-time chemistry meter and instant feedback.
- **💘 Matchmaker Verdicts & Messaging**: Cast your verdict (*Pass*, *Like*, *Super Like*), unlock mutual matches, and chat in the 8-bit retro messenger with quick-date icebreakers.
- **🎟️ Fundraiser Ticket Tiers & Goal Tracker**: Pixel Pioneer ($15), Arcade VIP ($35), and High Roller ($75) tickets raising funds for community game labs with live thermometer updates.
- **🛠️ Admin Event Management & Check-in Desk**: Real-time door check-in scanner simulation, suitor management, charity analytics, and attendee roster management.
- **🌍 Bilingual (English / Français)**: Complete localized UI switchable with a single toggle.
- **📱 100% Mobile Responsive**: Adaptive avatars, touch-friendly $\ge 44\text{px}$ action buttons, and responsive master-detail match views.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Building for Production

```bash
npm run build
```

The output will be placed in the `dist/` directory with relative asset paths configured for subpaths like GitHub Pages.

---

## 🌐 Deploying to GitHub Pages (`wunders149.github.io/HeartByte`)

This repository includes an automated GitHub Actions deployment workflow in `.github/workflows/deploy.yml`.

To enable automatic deployment:

1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages build and deploy"
   git push origin main
   ```
2. On GitHub, go to your repository:
   - Navigate to **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, select **GitHub Actions**
3. The workflow will automatically trigger, build the application, and publish it live to:
   **[https://wunders149.github.io/HeartByte/](https://wunders149.github.io/HeartByte/)**

# Neighborhood Match Quiz (New Orleans)

A production‑ready Next.js + Tailwind app that helps buyers find their best‑fit New Orleans neighborhood (Lakeview, Garden District, Marigny, Mid‑City, Gentilly) and captures leads.

## Quick Start (Local)
```bash
npm i
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
1. Create a new GitHub repository and upload this folder (or push from your machine).
2. In Vercel, click **New Project → Import** and select that repo.
3. Framework preset should auto‑detect **Next.js**. Click **Deploy**.

> After deploy, update your logo at **/public/logo.png** or set a remote URL in `LOGO_URL` in `app/page.js`.

## CRM Hook
In `app/page.js`, find `handleLeadSubmit` and replace the TODO with your form/CRM POST endpoint to receive leads (include `answers` and `scores` if you wire it up).

## Customization
- Add/remove neighborhoods by editing `NEIGHBORHOODS`, the question scoring in `QUESTIONS`, and the feature bullets in `NeighborhoodCard`.
- Tailwind styles live in `styles/globals.css`.

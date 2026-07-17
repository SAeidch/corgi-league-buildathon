import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// When deploying to GitHub Pages the app is served from a repo sub-path
// (/corgi-league-buildathon/). Everywhere else (Lovable, Vercel, local) it's
// served from root. The Pages workflow sets GITHUB_PAGES=true.
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/corgi-league-buildathon/" : "/",
  plugins: [react()],
});

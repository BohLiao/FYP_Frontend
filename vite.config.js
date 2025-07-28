import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173, // for local dev
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4000, // required by Render
  },
});

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // host: "127.0.0.1", // Optional: Use IPv4 loopback instead of IPv6 (::1)
    port: 3000, // Replace 3000 with your desired port number
    strictPort: true, // Optional: If true, the server will fail if the port is already in use
    open: true, // Optional: Opens the browser on server start
  },
});

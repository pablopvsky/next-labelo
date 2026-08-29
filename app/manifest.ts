import type { MetadataRoute } from "next";

/**
 * PWA web app manifest (Famity Care pattern: standalone install surface).
 * Served at /manifest.webmanifest by the App Router.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Labelo",
    short_name: "Labelo",
    description: "Organize labels and workflows for your team.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfd",
    theme_color: "#1f1f24",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pocket Manager Online",
  description: "Browser football management game with solo and multiplayer career modes.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-primary text-primary min-h-screen antialiased">{children}</body>
    </html>
  );
}

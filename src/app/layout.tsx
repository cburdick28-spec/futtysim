import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "FootySim", description: "Browser Football Management Game" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-primary text-primary min-h-screen">{children}</body></html>;
}

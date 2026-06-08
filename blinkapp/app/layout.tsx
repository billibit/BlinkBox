import type { Metadata } from "next";
import { Gift } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlinkBox",
  description: "AI-assisted surprise gifting"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <a className="brand" href="/">
              <span className="brand-mark" aria-hidden="true">
                <Gift size={20} strokeWidth={3} />
              </span>
              BlinkBox
            </a>
          </header>
          {children}
          <footer className="site-footer">
            <a href="/support">Support</a>
          </footer>
        </div>
      </body>
    </html>
  );
}

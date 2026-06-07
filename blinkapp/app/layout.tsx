import type { Metadata } from "next";
import { Gift, Headphones, Sparkles, Wallet } from "lucide-react";
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
            <nav className="nav" aria-label="Main navigation">
              <a href="/onboarding">
                <Sparkles size={16} strokeWidth={3} />
                Onboarding
              </a>
              <a href="/budget">
                <Wallet size={16} strokeWidth={3} />
                Budget
              </a>
              <a href="/support">
                <Headphones size={16} strokeWidth={3} />
                Support
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

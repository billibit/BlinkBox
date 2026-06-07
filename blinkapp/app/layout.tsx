import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlinkBox MVP",
  description: "AI-assisted surprise gifting MVP"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <a className="brand" href="/">
              BlinkBox
            </a>
            <nav className="nav" aria-label="Main navigation">
              <a href="/onboarding">Onboarding</a>
              <a href="/budget">Budget</a>
              <a href="/gifts">Gifts</a>
              <a href="/support">Support</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

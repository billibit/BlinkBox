import { Sparkles, WandSparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="page home-page">
      <section className="hero hero-single home-quiet">
        <div className="mystery-orb" aria-hidden="true">
          <WandSparkles size={42} strokeWidth={2.5} />
        </div>
        <div className="hero-copy quiet-card">
          <span className="tiny-note">BlinkBox</span>
          <h1>A little surprise, chosen for you.</h1>
          <p className="lede">
            Life is hard. Make yourself happy. Set a monthly budget, and your little AI companion
            will pick a mystery gift just for you.
          </p>
          <div className="actions">
            <a className="button" href="/onboarding">
              <Sparkles size={18} strokeWidth={3} />
              Begin
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

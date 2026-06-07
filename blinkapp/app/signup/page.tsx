export default function SignupPage() {
  return (
    <main className="page">
      <h1>Signup</h1>
      <section className="card">
        <p className="muted">
          Invite-only signup will create a user, address, payment setup session, and monthly
          schedule. Use onboarding for the current MVP demo path.
        </p>
        <a className="button" href="/onboarding">
          Start onboarding
        </a>
      </section>
    </main>
  );
}

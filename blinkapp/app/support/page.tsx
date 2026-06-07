import { getCurrentUser } from "@/lib/auth";
import { listSupportRequests } from "@/lib/support-service";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const requests = listSupportRequests().filter((request) => request.userId === user.id);

  return (
    <main className="page">
      <h1>Support</h1>
      <section className="grid">
        <form className="card stack" action="/api/support" method="post">
          <h2>Open request</h2>
          <label>
            Type
            <select name="type">
              <option value="question">Question</option>
              <option value="replacement">Replacement</option>
              <option value="refund">Refund</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" required />
          </label>
          <button type="submit">Submit</button>
        </form>
        <section className="card">
          <h2>Requests</h2>
          {requests.length ? (
            requests.map((request) => (
              <p key={request.id}>
                <strong>{request.type}</strong> · {request.status}
                <br />
                <span className="muted">{request.message}</span>
              </p>
            ))
          ) : (
            <p className="muted">No support requests yet.</p>
          )}
        </section>
      </section>
    </main>
  );
}

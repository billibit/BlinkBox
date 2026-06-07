import { listSupportRequests } from "@/lib/support-service";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const dynamic = "force-dynamic";

export default function AdminSupportPage() {
  const requests = listSupportRequests();

  return (
    <main className="page">
      <h1>Support</h1>
      <section className="grid">
        {requests.length ? (
          requests.map((request) => (
            <section className="card stack" key={request.id}>
              <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
                <h3>{request.type}</h3>
                <StatusBadge status={request.status} />
              </div>
              <p>{request.message}</p>
              {request.resolution ? <p className="muted">{request.resolution}</p> : null}
              {request.status === "open" ? (
                <form className="stack" action={`/api/support/${request.id}/reply`} method="post">
                  <label>
                    Resolution
                    <textarea name="resolution" required />
                  </label>
                  <button type="submit">Resolve</button>
                </form>
              ) : null}
            </section>
          ))
        ) : (
          <p className="muted">No support requests yet.</p>
        )}
      </section>
    </main>
  );
}

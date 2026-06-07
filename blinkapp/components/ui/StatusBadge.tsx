export function StatusBadge({ status }: { status: string }) {
  const good = ["fulfilled", "setup_complete", "manual_fulfillment"].includes(status);

  return <span className={`pill ${good ? "status-ok" : ""}`}>{status.replaceAll("_", " ")}</span>;
}

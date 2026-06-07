import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const good = ["fulfilled", "setup_complete", "manual_fulfillment"].includes(status);
  const rejected = ["rejected", "failed", "refunded"].includes(status);
  const Icon = good ? CheckCircle2 : rejected ? XCircle : Clock3;

  return (
    <span className={`pill ${good ? "status-ok" : ""} ${rejected ? "status-warn" : ""}`}>
      <Icon size={14} strokeWidth={3} />
      {status.replaceAll("_", " ")}
    </span>
  );
}

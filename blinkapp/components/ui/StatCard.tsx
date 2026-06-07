export function StatCard({
  label,
  value,
  helper,
  tone = "default"
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "default" | "sunny" | "mint" | "soft" | "sky";
}) {
  return (
    <section className={`card ${tone === "default" ? "" : tone}`}>
      <p className="tiny-note">{label}</p>
      <div className="metric">{value}</div>
      {helper ? <p className="muted">{helper}</p> : null}
    </section>
  );
}

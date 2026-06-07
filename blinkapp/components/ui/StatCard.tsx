export function StatCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <section className="card">
      <p className="muted">{label}</p>
      <div className="metric">{value}</div>
      {helper ? <p className="muted">{helper}</p> : null}
    </section>
  );
}

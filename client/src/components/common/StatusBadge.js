export function StatusBadge({ status }) {
  const className = status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return <span className={`status-badge ${className}`}>{status}</span>;
}

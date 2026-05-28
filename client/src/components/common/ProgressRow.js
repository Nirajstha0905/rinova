export function ProgressRow({ label, progress }) {
  return (
    <div className="progress-row">
      <div>
        <span>{label}</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

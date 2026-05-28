export function PanelTitle({ eyebrow, note, title }) {
  return (
    <div className="panel-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
      </div>
      <span>{note}</span>
    </div>
  );
}

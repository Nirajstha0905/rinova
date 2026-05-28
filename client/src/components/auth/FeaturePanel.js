export function FeaturePanel({ features }) {
  return (
    <div className="feature-panel">
      <h2>Key Features</h2>
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true">OK</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

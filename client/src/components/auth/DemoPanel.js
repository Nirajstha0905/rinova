export function DemoPanel({ demoUsers, onQuickLogin }) {
  return (
    <div className="demo-panel" aria-label="Demo credentials">
      <div>
        <h2>Demo Credentials</h2>
        <p>Password: any value. Use quick login to preview each role.</p>
      </div>
      <div className="quick-grid">
        {demoUsers.map((user) => (
          <button key={user.email} onClick={() => onQuickLogin(user)} type="button">
            <strong>{user.role}</strong>
            <span>{user.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

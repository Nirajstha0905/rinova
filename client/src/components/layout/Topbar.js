export function Topbar({ activeModule, session, getModuleDescription }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{session.scope}</p>
        <h2>{activeModule}</h2>
        <span>{getModuleDescription(activeModule, session.role)}</span>
      </div>
      <div className="topbar-actions">
        <label className="search-field">
          <span>Search</span>
          <input placeholder="Search students, leads, files" />
        </label>
        <div className="role-badge">{session.badge}</div>
      </div>
    </header>
  );
}

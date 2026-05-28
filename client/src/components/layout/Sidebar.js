export function Sidebar({ activeModule, moduleIcons, modules, onLogout, onSelectModule, session }) {
  return (
    <aside className="crm-sidebar" aria-label="Rinova Creation CRM navigation">
      <div className="brand-lockup">
        <span className="brand-mark">E</span>
        <div>
          <h1>Enrollystics</h1>
          <p>Rinova Creation CRM</p>
        </div>
      </div>

      <nav className="nav-list" aria-label="Phase 1 navigation">
        {modules.map((item) => (
          <button
            className={activeModule === item ? 'active' : ''}
            key={item}
            onClick={() => onSelectModule(item)}
            type="button"
          >
            <span>{moduleIcons[item] || item.slice(0, 2)}</span>
            {item}
          </button>
        ))}
      </nav>

      <div className="profile-card">
        <div className="avatar">{session.name.slice(0, 1)}</div>
        <div>
          <strong>{session.name}</strong>
          <span>{session.role}</span>
        </div>
      </div>

      <button className="logout-button" type="button" onClick={onLogout}>
        Sign out
      </button>
    </aside>
  );
}

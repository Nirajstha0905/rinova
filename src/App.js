import { useMemo, useState } from 'react';
import './App.css';

const DEMO_USERS = [
  {
    email: 'super@rinovacreation.com',
    name: 'Nisha Rai',
    role: 'Super Admin',
    badge: 'Platform',
    scope: 'All branches',
    permissions: ['Dashboard', 'Consultancies', 'Analytics', 'Team', 'Reports', 'Settings'],
  },
  {
    email: 'admin@rinovacreation.com',
    name: 'Aarav Sharma',
    role: 'Consultancy Admin',
    badge: 'Admin',
    scope: 'Rinova Creation Main Office',
    permissions: ['Dashboard', 'Students', 'Applications', 'Documents', 'Workflows', 'Team', 'Reports'],
  },
  {
    email: 'counsellor@rinovacreation.com',
    name: 'Maya Thapa',
    role: 'Counsellor',
    badge: 'Counsellor',
    scope: 'Study Abroad Desk',
    permissions: ['Dashboard', 'Students', 'Applications', 'Workflows', 'Communications'],
  },
  {
    email: 'documents@rinovacreation.com',
    name: 'Kabir Karki',
    role: 'Documentation Officer',
    badge: 'Docs',
    scope: 'Document Verification',
    permissions: ['Dashboard', 'Documents', 'Applications', 'Communications'],
  },
  {
    email: 'student@rinovacreation.com',
    name: 'Emma Thompson',
    role: 'Student',
    badge: 'Student',
    scope: 'Personal application portal',
    permissions: ['Dashboard', 'Applications', 'Documents', 'Messages'],
  },
];

const DEFAULT_FORM = {
  email: '',
  password: '',
  remember: true,
};

const roleDashboards = {
  'Super Admin': {
    headline: 'Platform command center',
    description: 'Monitor consultancy performance, revenue, system health, and cross-branch activity.',
    stats: [
      { label: 'Consultancies', value: '12', detail: '+2 onboarding' },
      { label: 'Total students', value: '4,820', detail: '18% growth' },
      { label: 'Monthly revenue', value: 'Rs.184K', detail: '+11.4%' },
      { label: 'System health', value: '99.9%', detail: 'All services stable' },
    ],
    tasks: ['Review branch performance reports', 'Approve new consultancy workspace', 'Audit role permissions'],
  },
  'Consultancy Admin': {
    headline: 'Rinova operations overview',
    description: 'Manage counsellors, student pipelines, partner schools, applications, and reporting.',
    stats: [
      { label: 'Active leads', value: '248', detail: '+18 this week' },
      { label: 'Applications', value: '72', detail: '14 awaiting docs' },
      { label: 'Team tasks', value: '31', detail: '9 overdue' },
      { label: 'Partner schools', value: '36', detail: '8 priority partners' },
    ],
    tasks: ['Assign new inquiry leads', 'Review counsellor workload', 'Prepare weekly enrollment report'],
  },
  Counsellor: {
    headline: 'Counselling pipeline',
    description: 'Track student conversations, applications, follow-ups, and enrollment readiness.',
    stats: [
      { label: 'My students', value: '86', detail: '12 high intent' },
      { label: 'Follow-ups today', value: '14', detail: '6 visa calls' },
      { label: 'Offers received', value: '21', detail: '5 this week' },
      { label: 'Unread messages', value: '9', detail: 'Reply needed' },
    ],
    tasks: ['Call students waiting on university shortlist', 'Update Canada intake notes', 'Send SOP reminder'],
  },
  'Documentation Officer': {
    headline: 'Document verification hub',
    description: 'Validate transcripts, passports, finance proof, SOPs, and submission-ready files.',
    stats: [
      { label: 'Pending checks', value: '43', detail: '12 urgent' },
      { label: 'Verified today', value: '18', detail: '+7 vs yesterday' },
      { label: 'Missing files', value: '26', detail: 'Notify students' },
      { label: 'Ready to submit', value: '15', detail: 'Final review' },
    ],
    tasks: ['Verify finance proof uploads', 'Flag incomplete passport scans', 'Prepare document checklist'],
  },
  Student: {
    headline: 'Your application tracker',
    description: 'Follow your documents, tasks, university choices, messages, and application status.',
    stats: [
      { label: 'Applications', value: '4', detail: '2 submitted' },
      { label: 'Documents', value: '8/10', detail: '2 missing' },
      { label: 'Tasks due', value: '3', detail: 'This week' },
      { label: 'Messages', value: '5', detail: '2 unread' },
    ],
    tasks: ['Upload bank statement', 'Review offer letter', 'Confirm visa appointment date'],
  },
};

const features = [
  'Comprehensive student management and tracking',
  'Application workflow automation',
  'Document verification and management',
  'Team collaboration and communication tools',
  'Role-based access control and permissions',
];

const getSavedSession = () => {
  try {
    const stored = window.localStorage.getItem('rinova-session');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

function App() {
  const [session, setSession] = useState(getSavedSession);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isResetSent, setIsResetSent] = useState(false);

  const isLocked = attempts >= 5;
  const dashboard = session ? roleDashboards[session.role] : null;

  const modules = useMemo(() => {
    if (!session) {
      return [];
    }

    return session.permissions.map((item) => ({
      label: item,
      active: item === 'Dashboard',
    }));
  }, [session]);

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
    setIsResetSent(false);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const signInUser = (user) => {
    const nextSession = {
      email: user.email,
      name: user.name,
      role: user.role,
      badge: user.badge,
      scope: user.scope,
      permissions: user.permissions,
      signedInAt: new Date().toISOString(),
    };

    if (form.remember) {
      window.localStorage.setItem('rinova-session', JSON.stringify(nextSession));
    } else {
      window.localStorage.removeItem('rinova-session');
    }

    setSession(nextSession);
    setAttempts(0);
    setMessage('');
    setErrors({});
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (isLocked) {
      setMessage('Too many failed attempts. Contact your CRM administrator to unlock this device.');
      return;
    }

    if (!validate()) {
      return;
    }

    const matchedUser = DEMO_USERS.find(
      (user) => user.email.toLowerCase() === form.email.trim().toLowerCase()
    );

    if (!matchedUser) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setMessage(`No demo role found for this email. ${5 - nextAttempts} attempt${5 - nextAttempts === 1 ? '' : 's'} remaining.`);
      return;
    }

    signInUser(matchedUser);
  };

  const quickLogin = (user) => {
    setForm((current) => ({
      ...current,
      email: user.email,
      password: 'demo-password',
    }));
    signInUser(user);
  };

  const handlePasswordReset = () => {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors((current) => ({
        ...current,
        email: 'Enter your email before requesting a reset link.',
      }));
      return;
    }

    setIsResetSent(true);
    setMessage(`Password reset instructions were prepared for ${form.email.trim()}.`);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('rinova-session');
    setSession(null);
    setForm(DEFAULT_FORM);
    setMessage('You have been securely signed out.');
  };

  if (session && dashboard) {
    return (
      <main className="crm-shell">
        <aside className="crm-sidebar" aria-label="Rinova Creation CRM navigation">
          <div className="brand-lockup">
            <span className="brand-mark">R</span>
            <div>
              <h1>Rinova Creation</h1>
              <p>Education CRM</p>
            </div>
          </div>

          <nav className="nav-list" aria-label="Role based navigation">
            {modules.map((item) => (
              <a className={item.active ? 'active' : ''} href={`#${item.label.toLowerCase()}`} key={item.label}>
                <span>{item.label.slice(0, 1)}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="profile-card">
            <div className="avatar">{session.name.slice(0, 1)}</div>
            <div>
              <strong>{session.name}</strong>
              <span>{session.role}</span>
            </div>
          </div>

          <button className="logout-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </aside>

        <section className="crm-content" id="dashboard">
          <header className="topbar">
            <div>
              <p className="eyebrow">{session.scope}</p>
              <h2>{dashboard.headline}</h2>
              <span>{dashboard.description}</span>
            </div>
            <div className="role-badge">{session.badge}</div>
          </header>

          <div className="stats-grid">
            {dashboard.stats.map((item) => (
              <article className="stat-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          <section className="dashboard-grid">
            <article className="work-panel" aria-labelledby="workflow-heading">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">Priority workflow</p>
                  <h3 id="workflow-heading">Next best actions</h3>
                </div>
                <span>Today</span>
              </div>
              <div className="task-list">
                {dashboard.tasks.map((task, index) => (
                  <div key={task}>
                    <span className="task-index">{index + 1}</span>
                    <strong>{task}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="work-panel permission-panel" aria-labelledby="permissions-heading">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">Access control</p>
                  <h3 id="permissions-heading">Allowed modules</h3>
                </div>
                <span>{session.permissions.length} modules</span>
              </div>
              <div className="permission-list">
                {session.permissions.map((permission) => (
                  <span key={permission}>{permission}</span>
                ))}
              </div>
            </article>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-intro" aria-label="Rinova Creation CRM summary">
        <div className="brand-lockup">
          <span className="brand-mark">R</span>
          <div>
            <h1>Rinova Creation</h1>
            <p>Modern Education Consultancy and CRM Platform</p>
          </div>
        </div>

        <div className="feature-panel">
          <h2>Key Features</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>
                <span aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="login-heading">
        <form className="login-card" onSubmit={handleLogin} noValidate>
          <div className="form-heading">
            <h2 id="login-heading">Sign In</h2>
            <span>Enter your credentials to access the platform</span>
          </div>

          {message && (
            <div className={isResetSent ? 'notice success' : 'notice'} role="status">
              {message}
            </div>
          )}

          {isLocked && (
            <div className="notice danger" role="alert">
              Login temporarily locked after five failed attempts.
            </div>
          )}

          <label className="field">
            <span>Email</span>
            <input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              name="email"
              onChange={updateField}
              placeholder="name@example.com"
              type="email"
              value={form.email}
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password-wrap">
              <input
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                name="password"
                onChange={updateField}
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="ghost-button"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <small>{errors.password}</small>}
          </label>

          <div className="form-row">
            <label className="remember-option">
              <input
                checked={form.remember}
                name="remember"
                onChange={updateField}
                type="checkbox"
              />
              <span>Remember this device</span>
            </label>
            <button className="link-button" onClick={handlePasswordReset} type="button">
              Forgot password?
            </button>
          </div>

          <button className="primary-button" disabled={isLocked} type="submit">
            Sign In
          </button>
        </form>

        <div className="demo-panel" aria-label="Demo credentials">
          <div>
            <h2>Demo Credentials</h2>
            <p>Password: any value</p>
          </div>
          <div className="quick-grid">
            {DEMO_USERS.map((user) => (
              <button key={user.email} onClick={() => quickLogin(user)} type="button">
                <strong>{user.role}</strong>
                <span>{user.email}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

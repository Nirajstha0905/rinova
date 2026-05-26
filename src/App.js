import { useMemo, useState } from 'react';
import './App.css';

const DEMO_USERS = [
  {
    email: 'super@rinovacreation.com',
    name: 'Nisha Rai',
    role: 'Super Admin',
    badge: 'Platform',
    scope: 'All branches',
    permissions: ['Dashboard', 'Leads', 'Students', 'Documents', 'Applications', 'Tasks', 'Student Portal'],
  },
  {
    email: 'admin@rinovacreation.com',
    name: 'Aarav Sharma',
    role: 'Consultancy Admin',
    badge: 'Admin',
    scope: 'Rinova Creation Main Office',
    permissions: ['Dashboard', 'Leads', 'Students', 'Documents', 'Applications', 'Tasks', 'Student Portal'],
  },
  {
    email: 'counsellor@rinovacreation.com',
    name: 'Maya Thapa',
    role: 'Counsellor',
    badge: 'Counsellor',
    scope: 'Study Abroad Desk',
    permissions: ['Dashboard', 'Leads', 'Students', 'Applications', 'Tasks'],
  },
  {
    email: 'documents@rinovacreation.com',
    name: 'Kabir Karki',
    role: 'Documentation Officer',
    badge: 'Docs',
    scope: 'Document Verification',
    permissions: ['Dashboard', 'Documents', 'Applications', 'Tasks'],
  },
  {
    email: 'student@rinovacreation.com',
    name: 'Emma Thompson',
    role: 'Student',
    badge: 'Student',
    scope: 'Personal application portal',
    permissions: ['Dashboard', 'Student Portal', 'Documents', 'Applications', 'Tasks'],
  },
];

const DEFAULT_FORM = {
  email: '',
  password: '',
  remember: true,
};

const features = [
  'Authentication and role-based login',
  'Dashboard analytics for applications, documents, visas, and workload',
  'Lead management with counsellor assignment and conversion',
  'Student profiles, document verification, and application tracking',
  'Task management, follow-ups, and student portal access',
];

const initialLeads = [
  {
    id: 1,
    name: 'Rohan Basnet',
    country: 'Canada',
    course: 'Business Analytics',
    source: 'Facebook campaign',
    counsellor: 'Maya Thapa',
    status: 'Counselling',
    nextFollowUp: 'Today, 2:00 PM',
  },
  {
    id: 2,
    name: 'Anita Gurung',
    country: 'Australia',
    course: 'Nursing',
    source: 'Walk-in',
    counsellor: 'Aarav Sharma',
    status: 'New enquiry',
    nextFollowUp: 'Tomorrow, 11:30 AM',
  },
  {
    id: 3,
    name: 'Samir KC',
    country: 'United Kingdom',
    course: 'Computer Science',
    source: 'Referral',
    counsellor: 'Maya Thapa',
    status: 'Documents requested',
    nextFollowUp: 'May 28, 10:00 AM',
  },
];

const initialStudents = [
  {
    id: 101,
    name: 'Emma Thompson',
    passport: 'N1234567',
    country: 'Canada',
    course: 'MBA',
    counsellor: 'Maya Thapa',
    stage: 'Visa Preparation',
    tags: ['High priority', 'Fall intake'],
    academics: 'BBA, 3.4 GPA',
    english: 'IELTS 7.0',
    work: '2 years banking',
  },
  {
    id: 102,
    name: 'Aayush Shrestha',
    passport: 'PA778899',
    country: 'Australia',
    course: 'IT',
    counsellor: 'Aarav Sharma',
    stage: 'Offer Received',
    tags: ['Scholarship'],
    academics: 'BSc CSIT, 72%',
    english: 'PTE 68',
    work: 'Internship',
  },
  {
    id: 103,
    name: 'Priya Lama',
    passport: 'N5566123',
    country: 'United Kingdom',
    course: 'Public Health',
    counsellor: 'Maya Thapa',
    stage: 'Documents Pending',
    tags: ['Needs SOP'],
    academics: 'BPH, 3.6 GPA',
    english: 'IELTS 6.5',
    work: '1 year clinic assistant',
  },
];

const initialDocuments = [
  { id: 1, student: 'Emma Thompson', category: 'Passport', file: 'passport_emma.pdf', status: 'Approved', owner: 'Kabir Karki' },
  { id: 2, student: 'Emma Thompson', category: 'Financial documents', file: 'bank_statement.pdf', status: 'Needs re-upload', owner: 'Kabir Karki' },
  { id: 3, student: 'Aayush Shrestha', category: 'Offer letters', file: 'offer_deakin.pdf', status: 'Approved', owner: 'Kabir Karki' },
  { id: 4, student: 'Priya Lama', category: 'SOP/GS statements', file: 'sop_draft.docx', status: 'Under review', owner: 'Kabir Karki' },
];

const initialApplications = [
  {
    id: 1,
    student: 'Emma Thompson',
    institution: 'University of Toronto',
    country: 'Canada',
    type: 'Institution',
    stage: 'Visa Preparation',
    progress: 70,
  },
  {
    id: 2,
    student: 'Aayush Shrestha',
    institution: 'Deakin University',
    country: 'Australia',
    type: 'Institution',
    stage: 'Offer Received',
    progress: 55,
  },
  {
    id: 3,
    student: 'Priya Lama',
    institution: 'University of Manchester',
    country: 'United Kingdom',
    type: 'Institution',
    stage: 'Documents Pending',
    progress: 30,
  },
];

const initialTasks = [
  { id: 1, title: 'Call Rohan for shortlist confirmation', owner: 'Maya Thapa', due: 'Today', status: 'Due today', priority: 'High' },
  { id: 2, title: 'Review Emma bank statement re-upload', owner: 'Kabir Karki', due: 'Today', status: 'Due today', priority: 'High' },
  { id: 3, title: 'Convert Anita lead after counselling', owner: 'Aarav Sharma', due: 'Tomorrow', status: 'Scheduled', priority: 'Medium' },
  { id: 4, title: 'Update Priya SOP feedback', owner: 'Maya Thapa', due: 'Overdue', status: 'Overdue', priority: 'High' },
];

const pipelineStages = [
  'Lead',
  'Counselling',
  'Documents Pending',
  'Institution Applied',
  'Offer Received',
  'Visa Preparation',
  'Visa Lodged',
  'Visa Granted',
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
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [leads, setLeads] = useState(initialLeads);
  const [students, setStudents] = useState(initialStudents);
  const [documents, setDocuments] = useState(initialDocuments);
  const [applications] = useState(initialApplications);
  const [tasks, setTasks] = useState(initialTasks);
  const [leadDraft, setLeadDraft] = useState({
    name: '',
    country: 'Canada',
    course: '',
    source: 'Website',
  });
  const [taskDraft, setTaskDraft] = useState({
    title: '',
    owner: 'Maya Thapa',
    due: 'Today',
  });

  const isLocked = attempts >= 5;

  const dashboardStats = useMemo(() => {
    const pendingDocuments = documents.filter((document) => document.status !== 'Approved').length;
    const dueToday = tasks.filter((task) => task.status === 'Due today' || task.status === 'Overdue').length;

    return [
      { label: 'Total students', value: students.length, detail: 'Active student profiles' },
      { label: 'Active applications', value: applications.length, detail: 'Institution and visa files' },
      { label: 'Pending documents', value: pendingDocuments, detail: 'Need staff action' },
      { label: 'Follow-ups due', value: dueToday, detail: 'Today and overdue' },
      { label: 'Visa granted', value: 18, detail: '82% success rate' },
      { label: 'Visa refused', value: 4, detail: 'Needs review notes' },
    ];
  }, [applications.length, documents, students.length, tasks]);

  const staffWorkload = useMemo(() => {
    const owners = ['Maya Thapa', 'Aarav Sharma', 'Kabir Karki'];
    return owners.map((owner) => ({
      owner,
      tasks: tasks.filter((task) => task.owner === owner).length,
      leads: leads.filter((lead) => lead.counsellor === owner).length,
    }));
  }, [leads, tasks]);

  const modules = session?.permissions || [];

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
    setActiveModule(user.role === 'Student' ? 'Student Portal' : 'Dashboard');
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
    setActiveModule('Dashboard');
    setForm(DEFAULT_FORM);
    setMessage('You have been securely signed out.');
  };

  const addLead = (event) => {
    event.preventDefault();

    if (!leadDraft.name.trim() || !leadDraft.course.trim()) {
      return;
    }

    setLeads((current) => [
      {
        id: Date.now(),
        ...leadDraft,
        counsellor: session.name,
        status: 'New enquiry',
        nextFollowUp: 'Tomorrow, 10:00 AM',
      },
      ...current,
    ]);
    setLeadDraft({ name: '', country: 'Canada', course: '', source: 'Website' });
  };

  const convertLead = (lead) => {
    setStudents((current) => [
      {
        id: Date.now(),
        name: lead.name,
        passport: 'Pending',
        country: lead.country,
        course: lead.course,
        counsellor: lead.counsellor,
        stage: 'Counselling',
        tags: ['Converted lead'],
        academics: 'To be collected',
        english: 'To be collected',
        work: 'To be collected',
      },
      ...current,
    ]);
    setLeads((current) => current.filter((item) => item.id !== lead.id));
    setActiveModule('Students');
  };

  const updateDocumentStatus = (id, status) => {
    setDocuments((current) =>
      current.map((document) => (document.id === id ? { ...document, status } : document))
    );
  };

  const simulateUpload = () => {
    setDocuments((current) => [
      {
        id: Date.now(),
        student: session.role === 'Student' ? session.name : 'Emma Thompson',
        category: 'Visa documents',
        file: 'new_upload.pdf',
        status: 'Under review',
        owner: 'Kabir Karki',
      },
      ...current,
    ]);
  };

  const addTask = (event) => {
    event.preventDefault();

    if (!taskDraft.title.trim()) {
      return;
    }

    setTasks((current) => [
      {
        id: Date.now(),
        ...taskDraft,
        status: taskDraft.due === 'Today' ? 'Due today' : 'Scheduled',
        priority: 'Medium',
      },
      ...current,
    ]);
    setTaskDraft({ title: '', owner: 'Maya Thapa', due: 'Today' });
  };

  const completeTask = (id) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status: 'Completed' } : task))
    );
  };

  if (session) {
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

          <nav className="nav-list" aria-label="Phase 1 navigation">
            {modules.map((item) => (
              <button
                className={activeModule === item ? 'active' : ''}
                key={item}
                onClick={() => setActiveModule(item)}
                type="button"
              >
                <span>{item.slice(0, 1)}</span>
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

          <button className="logout-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </aside>

        <section className="crm-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">{session.scope}</p>
              <h2>{activeModule}</h2>
              <span>{getModuleDescription(activeModule, session.role)}</span>
            </div>
            <div className="role-badge">{session.badge}</div>
          </header>

          {activeModule === 'Dashboard' && (
            <DashboardView
              applications={applications}
              dashboardStats={dashboardStats}
              staffWorkload={staffWorkload}
              tasks={tasks}
            />
          )}

          {activeModule === 'Leads' && (
            <LeadsView
              leadDraft={leadDraft}
              leads={leads}
              onAddLead={addLead}
              onConvertLead={convertLead}
              setLeadDraft={setLeadDraft}
            />
          )}

          {activeModule === 'Students' && <StudentsView students={students} />}

          {activeModule === 'Documents' && (
            <DocumentsView
              documents={documents}
              onSimulateUpload={simulateUpload}
              onUpdateStatus={updateDocumentStatus}
              session={session}
            />
          )}

          {activeModule === 'Applications' && <ApplicationsView applications={applications} />}

          {activeModule === 'Tasks' && (
            <TasksView
              onAddTask={addTask}
              onCompleteTask={completeTask}
              setTaskDraft={setTaskDraft}
              taskDraft={taskDraft}
              tasks={tasks}
            />
          )}

          {activeModule === 'Student Portal' && (
            <StudentPortalView
              applications={applications}
              documents={documents}
              onSimulateUpload={simulateUpload}
              tasks={tasks}
            />
          )}
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
            <p>Consultancy and Education Management System</p>
          </div>
        </div>

        <div className="feature-panel">
          <h2>Phase 1 MVP</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>
                <span aria-hidden="true">OK</span>
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

function getModuleDescription(moduleName, role) {
  const descriptions = {
    Dashboard: 'Operational overview for students, applications, documents, follow-ups, visa outcomes, and staff workload.',
    Leads: 'Capture enquiries, assign counsellors, schedule follow-ups, and convert qualified leads into student profiles.',
    Students: 'Maintain complete student records with passport, academic, English test, work, preference, and activity details.',
    Documents: 'Upload, review, approve, reject, and request re-upload for all student document categories.',
    Applications: 'Track institution and visa applications through customizable workflow stages.',
    Tasks: 'Create follow-ups, assign responsibilities, monitor deadlines, and close completed work.',
    'Student Portal': 'Student-facing portal for uploads, application status, pending requirements, and updates.',
  };

  if (role === 'Student' && moduleName === 'Dashboard') {
    return 'Personal overview for your applications, documents, tasks, and messages.';
  }

  return descriptions[moduleName] || 'Phase 1 CRM module.';
}

function DashboardView({ applications, dashboardStats, staffWorkload, tasks }) {
  return (
    <>
      <div className="stats-grid wide">
        {dashboardStats.map((item) => (
          <article className="stat-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <section className="dashboard-grid">
        <article className="work-panel">
          <PanelTitle eyebrow="Monthly trends" title="Application pipeline" note="Last 6 months" />
          <div className="trend-bars">
            {[32, 46, 38, 58, 64, 72].map((value, index) => (
              <div key={value}>
                <span style={{ height: `${value * 2}px` }} />
                <small>{['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="work-panel">
          <PanelTitle eyebrow="Staff workload" title="Assignments" note="Live" />
          <div className="workload-list">
            {staffWorkload.map((item) => (
              <div key={item.owner}>
                <strong>{item.owner}</strong>
                <span>{item.tasks} tasks, {item.leads} leads</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="work-panel">
          <PanelTitle eyebrow="Applications" title="Current stages" note={`${applications.length} active`} />
          <div className="pipeline-list">
            {applications.map((application) => (
              <ProgressRow
                key={application.id}
                label={`${application.student} - ${application.stage}`}
                progress={application.progress}
              />
            ))}
          </div>
        </article>

        <article className="work-panel">
          <PanelTitle eyebrow="Follow-ups" title="Due now" note={`${tasks.length} tasks`} />
          <div className="task-list">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id}>
                <span className="task-index">{task.priority.slice(0, 1)}</span>
                <strong>{task.title}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function LeadsView({ leadDraft, leads, onAddLead, onConvertLead, setLeadDraft }) {
  return (
    <section className="module-grid">
      <form className="work-panel form-panel" onSubmit={onAddLead}>
        <PanelTitle eyebrow="Lead capture" title="Add new enquiry" note="MVP" />
        <label className="field">
          <span>Student name</span>
          <input
            onChange={(event) => setLeadDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Student name"
            value={leadDraft.name}
          />
        </label>
        <label className="field">
          <span>Preferred country</span>
          <select
            onChange={(event) => setLeadDraft((current) => ({ ...current, country: event.target.value }))}
            value={leadDraft.country}
          >
            <option>Canada</option>
            <option>Australia</option>
            <option>United Kingdom</option>
            <option>United States</option>
          </select>
        </label>
        <label className="field">
          <span>Preferred course</span>
          <input
            onChange={(event) => setLeadDraft((current) => ({ ...current, course: event.target.value }))}
            placeholder="Course or program"
            value={leadDraft.course}
          />
        </label>
        <label className="field">
          <span>Lead source</span>
          <input
            onChange={(event) => setLeadDraft((current) => ({ ...current, source: event.target.value }))}
            placeholder="Website, referral, campaign"
            value={leadDraft.source}
          />
        </label>
        <button className="primary-button" type="submit">Add lead</button>
      </form>

      <article className="work-panel span-2">
        <PanelTitle eyebrow="Lead management" title="Prospective students" note={`${leads.length} open leads`} />
        <DataTable
          columns={['Name', 'Country', 'Course', 'Counsellor', 'Status', 'Follow-up', 'Action']}
          rows={leads.map((lead) => [
            lead.name,
            lead.country,
            lead.course,
            lead.counsellor,
            <StatusBadge status={lead.status} />,
            lead.nextFollowUp,
            <button className="small-button" onClick={() => onConvertLead(lead)} type="button">Convert</button>,
          ])}
        />
      </article>
    </section>
  );
}

function StudentsView({ students }) {
  return (
    <section className="work-panel">
      <PanelTitle eyebrow="Student management" title="Complete student profiles" note={`${students.length} profiles`} />
      <div className="student-grid">
        {students.map((student) => (
          <article className="student-card" key={student.id}>
            <div className="student-card-head">
              <div>
                <h3>{student.name}</h3>
                <p>{student.country} - {student.course}</p>
              </div>
              <StatusBadge status={student.stage} />
            </div>
            <dl>
              <div><dt>Passport</dt><dd>{student.passport}</dd></div>
              <div><dt>Academic</dt><dd>{student.academics}</dd></div>
              <div><dt>English test</dt><dd>{student.english}</dd></div>
              <div><dt>Experience</dt><dd>{student.work}</dd></div>
              <div><dt>Counsellor</dt><dd>{student.counsellor}</dd></div>
            </dl>
            <div className="tag-list">
              {student.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocumentsView({ documents, onSimulateUpload, onUpdateStatus, session }) {
  return (
    <section className="work-panel">
      <PanelTitle eyebrow="Document management" title="Upload and verification queue" note={`${documents.length} files`} />
      <div className="action-strip">
        <button className="primary-button compact" onClick={onSimulateUpload} type="button">
          {session.role === 'Student' ? 'Upload document' : 'Simulate student upload'}
        </button>
        <span>Categories: passport, academics, English test, SOP, financial, offer, visa, supporting files.</span>
      </div>
      <DataTable
        columns={['Student', 'Category', 'File', 'Status', 'Reviewer', 'Actions']}
        rows={documents.map((document) => [
          document.student,
          document.category,
          document.file,
          <StatusBadge status={document.status} />,
          document.owner,
          <div className="button-row">
            <button className="small-button" onClick={() => onUpdateStatus(document.id, 'Approved')} type="button">Approve</button>
            <button className="small-button muted" onClick={() => onUpdateStatus(document.id, 'Needs re-upload')} type="button">Re-upload</button>
          </div>,
        ])}
      />
    </section>
  );
}

function ApplicationsView({ applications }) {
  return (
    <section className="work-panel">
      <PanelTitle eyebrow="Application tracking" title="Institution and visa workflow" note="Customizable stages" />
      <div className="stage-strip">
        {pipelineStages.map((stage) => <span key={stage}>{stage}</span>)}
      </div>
      <div className="pipeline-list">
        {applications.map((application) => (
          <article className="application-row" key={application.id}>
            <div>
              <strong>{application.student}</strong>
              <span>{application.institution} - {application.country} - {application.type}</span>
            </div>
            <StatusBadge status={application.stage} />
            <ProgressRow label={`${application.progress}% complete`} progress={application.progress} />
          </article>
        ))}
      </div>
    </section>
  );
}

function TasksView({ onAddTask, onCompleteTask, setTaskDraft, taskDraft, tasks }) {
  return (
    <section className="module-grid">
      <form className="work-panel form-panel" onSubmit={onAddTask}>
        <PanelTitle eyebrow="Task system" title="Create follow-up" note="Assign and track" />
        <label className="field">
          <span>Task title</span>
          <input
            onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="Follow-up or internal task"
            value={taskDraft.title}
          />
        </label>
        <label className="field">
          <span>Owner</span>
          <select
            onChange={(event) => setTaskDraft((current) => ({ ...current, owner: event.target.value }))}
            value={taskDraft.owner}
          >
            <option>Maya Thapa</option>
            <option>Aarav Sharma</option>
            <option>Kabir Karki</option>
          </select>
        </label>
        <label className="field">
          <span>Due</span>
          <select
            onChange={(event) => setTaskDraft((current) => ({ ...current, due: event.target.value }))}
            value={taskDraft.due}
          >
            <option>Today</option>
            <option>Tomorrow</option>
            <option>Next week</option>
          </select>
        </label>
        <button className="primary-button" type="submit">Create task</button>
      </form>

      <article className="work-panel span-2">
        <PanelTitle eyebrow="Follow-ups" title="Task board" note={`${tasks.length} tasks`} />
        <DataTable
          columns={['Task', 'Owner', 'Due', 'Priority', 'Status', 'Action']}
          rows={tasks.map((task) => [
            task.title,
            task.owner,
            task.due,
            task.priority,
            <StatusBadge status={task.status} />,
            <button className="small-button" onClick={() => onCompleteTask(task.id)} type="button">Complete</button>,
          ])}
        />
      </article>
    </section>
  );
}

function StudentPortalView({ applications, documents, onSimulateUpload, tasks }) {
  const studentApplications = applications.filter((application) => application.student === 'Emma Thompson');
  const studentDocuments = documents.filter((document) => document.student === 'Emma Thompson');
  const pendingTasks = tasks.filter((task) => task.title.toLowerCase().includes('emma') || task.owner === 'Maya Thapa').slice(0, 3);

  return (
    <section className="portal-grid">
      <article className="work-panel hero-panel">
        <PanelTitle eyebrow="Student portal" title="Emma Thompson" note="Personal view" />
        <p>Track application progress, upload requested documents, review pending requirements, and receive updates from Rinova Creation.</p>
        <button className="primary-button compact" onClick={onSimulateUpload} type="button">Upload document</button>
      </article>

      <article className="work-panel">
        <PanelTitle eyebrow="Applications" title="My status" note={`${studentApplications.length} active`} />
        {studentApplications.map((application) => (
          <ProgressRow
            key={application.id}
            label={`${application.institution} - ${application.stage}`}
            progress={application.progress}
          />
        ))}
      </article>

      <article className="work-panel">
        <PanelTitle eyebrow="Documents" title="Requirements" note={`${studentDocuments.length} uploaded`} />
        <div className="mini-list">
          {studentDocuments.map((document) => (
            <div key={document.id}>
              <strong>{document.category}</strong>
              <StatusBadge status={document.status} />
            </div>
          ))}
        </div>
      </article>

      <article className="work-panel">
        <PanelTitle eyebrow="Tasks" title="Pending requirements" note={`${pendingTasks.length} items`} />
        <div className="mini-list">
          {pendingTasks.map((task) => (
            <div key={task.id}>
              <strong>{task.title}</strong>
              <span>{task.due}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function PanelTitle({ eyebrow, note, title }) {
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

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const className = status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return <span className={`status-badge ${className}`}>{status}</span>;
}

function ProgressRow({ label, progress }) {
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

export default App;

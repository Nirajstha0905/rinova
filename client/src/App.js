import { useMemo, useState } from 'react';
import './App.css';
import { DEMO_USERS } from './data/demoUsers';
import { initialLeads, initialStudents, initialDocuments, initialApplications, initialTasks } from './data/mockData';
import { DEFAULT_FORM, features, moduleIcons } from './data/moduleConfig';
import { getSavedSession, resetScrollPosition } from './utils/auth';
import { getModuleDescription } from './utils/moduleDescriptions';
import { LoginPage } from './components/auth/LoginPage';
import { Shell } from './components/layout/Shell';
import {loginUser} from "./services/authService";

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
    resetScrollPosition();
    setAttempts(0);
    setMessage('');
    setErrors({});
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if(isLocked){
      setMessage("Too many failed attempts.");
      return;
    }
    if(!validate()){
      return;
    }
    try{
      const data = await loginUser(
       {email: form.email,
        password: form.password}  
        
      );
      const nextSession = {
        token: data.token,
        user: data.user,
      };
      localStorage.setItem(
        "rinova-session",
        JSON.stringify(nextSession)
      );
      setSession(nextSession);

      setMessage("");
      setAttempts(0);
    } catch (error){
      const nextAttempts = attempts + 1;

      setAttempts(nextAttempts);

      setMessage(error.response?.data?.message || 
        "Login failed"
      );
    }

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
      <Shell
        activeModule={activeModule}
        applications={applications}
        dashboardStats={dashboardStats}
        documents={documents}
        form={form}
        getModuleDescription={getModuleDescription}
        leadDraft={leadDraft}
        leads={leads}
        moduleIcons={moduleIcons}
        modules={modules}
        onAddLead={addLead}
        onAddTask={addTask}
        onCompleteTask={completeTask}
        onConvertLead={convertLead}
        onLogout={handleLogout}
        onSelectModule={setActiveModule}
        onSimulateUpload={simulateUpload}
        onUpdateDocumentStatus={updateDocumentStatus}
        session={session}
        setLeadDraft={setLeadDraft}
        setTaskDraft={setTaskDraft}
        staffWorkload={staffWorkload}
        students={students}
        taskDraft={taskDraft}
        tasks={tasks}
      />
    );
  }

  return (
    <LoginPage
      demoUsers={DEMO_USERS}
      errors={errors}
      features={features}
      form={form}
      isLocked={isLocked}
      isResetSent={isResetSent}
      message={message}
      onPasswordReset={handlePasswordReset}
      onQuickLogin={quickLogin}
      onSubmit={handleLogin}
      showPassword={showPassword}
      updateField={updateField}
      setShowPassword={setShowPassword}
    />
  );
}

export default App;

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardView } from '../modules/Dashboard/DashboardView';
import { LeadsView } from '../modules/Leads/LeadsView';
import { StudentsView } from '../modules/Students/StudentsView';
import { DocumentsView } from '../modules/Documents/DocumentsView';
import { ApplicationsView } from '../modules/Applications/ApplicationsView';
import { TasksView } from '../modules/Tasks/TasksView';
import { StudentPortalView } from '../modules/StudentPortal/StudentPortalView';

export function Shell({
  activeModule,
  applications,
  dashboardStats,
  documents,
  form,
  getModuleDescription,
  leadDraft,
  leads,
  moduleIcons,
  modules,
  onAddLead,
  onAddTask,
  onCompleteTask,
  onConvertLead,
  onLogout,
  onSelectModule,
  onSimulateUpload,
  onUpdateDocumentStatus,
  session,
  setLeadDraft,
  setTaskDraft,
  staffWorkload,
  students,
  taskDraft,
  tasks,
}) {
  return (
    <main className="crm-shell">
      <Sidebar
        activeModule={activeModule}
        moduleIcons={moduleIcons}
        modules={modules}
        onLogout={onLogout}
        onSelectModule={onSelectModule}
        session={session}
      />

      <section className="crm-content">
        <Topbar
          activeModule={activeModule}
          getModuleDescription={getModuleDescription}
          session={session}
        />

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
            onAddLead={onAddLead}
            onConvertLead={onConvertLead}
            setLeadDraft={setLeadDraft}
          />
        )}

        {activeModule === 'Students' && <StudentsView students={students} />}

        {activeModule === 'Documents' && (
          <DocumentsView
            documents={documents}
            onSimulateUpload={onSimulateUpload}
            onUpdateStatus={onUpdateDocumentStatus}
            session={session}
          />
        )}

        {activeModule === 'Applications' && <ApplicationsView applications={applications} />}

        {activeModule === 'Tasks' && (
          <TasksView
            onAddTask={onAddTask}
            onCompleteTask={onCompleteTask}
            setTaskDraft={setTaskDraft}
            taskDraft={taskDraft}
            tasks={tasks}
          />
        )}

        {activeModule === 'Student Portal' && (
          <StudentPortalView
            applications={applications}
            documents={documents}
            onSimulateUpload={onSimulateUpload}
            tasks={tasks}
          />
        )}
      </section>
    </main>
  );
}

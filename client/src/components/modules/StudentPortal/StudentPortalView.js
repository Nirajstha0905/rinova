import { PanelTitle } from '../../common/PanelTitle';
import { ProgressRow } from '../../common/ProgressRow';
import { StatusBadge } from '../../common/StatusBadge';

export function StudentPortalView({ applications, documents, onSimulateUpload, tasks }) {
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

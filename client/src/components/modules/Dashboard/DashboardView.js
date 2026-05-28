import { PanelTitle } from '../../common/PanelTitle';
import { ProgressRow } from '../../common/ProgressRow';

export function DashboardView({ applications, dashboardStats, staffWorkload, tasks }) {
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

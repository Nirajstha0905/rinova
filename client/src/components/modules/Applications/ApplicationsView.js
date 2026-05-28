import { PanelTitle } from '../../common/PanelTitle';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressRow } from '../../common/ProgressRow';
import { pipelineStages } from '../../../data/moduleConfig';

export function ApplicationsView({ applications }) {
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

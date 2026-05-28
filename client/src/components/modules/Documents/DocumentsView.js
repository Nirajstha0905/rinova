import { PanelTitle } from '../../common/PanelTitle';
import { DataTable } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';

export function DocumentsView({ documents, onSimulateUpload, onUpdateStatus, session }) {
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

import { PanelTitle } from '../../common/PanelTitle';
import { DataTable } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';

export function LeadsView({ leadDraft, leads, onAddLead, onConvertLead, setLeadDraft }) {
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

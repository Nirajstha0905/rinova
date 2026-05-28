import { PanelTitle } from '../../common/PanelTitle';
import { StatusBadge } from '../../common/StatusBadge';

export function StudentsView({ students }) {
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

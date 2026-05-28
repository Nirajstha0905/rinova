import { PanelTitle } from '../../common/PanelTitle';
import { DataTable } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';

export function TasksView({ onAddTask, onCompleteTask, setTaskDraft, taskDraft, tasks }) {
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

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarClock,
  User,
  Dot,
  CheckCircle2,
  ClipboardCheck,
  Circle,
  Clock,
  CircleAlert,
  LayoutGrid,
  List,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import * as taskApi from "../../api/taskApi";
import * as leadApi from "../../api/leadApi";
import * as studentApi from "../../api/studentApi";
import * as userApi from "../../api/userApi";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input, Select } from "../../components/ui/Input";
import { SelectDropdown } from "../../components/ui/SelectDropdown";
import { PageHeader } from "../../components/ui/PageHeader";

const columns = [
  { key: "todo", label: "To Do", tone: "slate", icon: Circle },
  { key: "in_progress", label: "In Progress", tone: "blue", icon: Clock },
  { key: "review", label: "Review", tone: "violet", icon: CircleAlert },
  { key: "completed", label: "Done", tone: "green", icon: CheckCircle2 },
];

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "done", label: "Done" },
];

const priorityTone = {
  high: "rose",
  urgent: "rose",
  medium: "amber",
  normal: "blue",
  low: "slate",
};

const taskCategories = [
  "application",
  "document",
  "follow-up",
  "communication",
  "admin",
  "lead",
];

const formatLabel = (value = "") =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "No due date"
    : date.toLocaleDateString();
};

const isDueSoon = (value, status) => {
  if (!value || ["done", "completed"].includes(status)) return false;
  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);
  return diffDays <= 2;
};

function StatusActionButton({ children, status, active, onClick }) {
  const toneMap = {
    todo: "bg-slate-500",
    in_progress: "bg-blue-500",
    review: "bg-violet-500",
    completed: "bg-green-500",
    done: "bg-green-500",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
        active
          ? `${toneMap[status]} text-white`
          : `bg-(--color-surface-muted) text-(--color-muted) hover:text-(--color-text)`
      }`}
    >
      {children}
    </button>
  );
}

function TaskCard({
  task,
  onStatusChange,
  onDelete,
  draggable = false,
  onDragStart,
  compact = false,
}) {
  const dueSoon = isDueSoon(task.dueDate, task.status);

  return (
    <Card
      className={`transition-all duration-200 hover:-translate-y-1 hover:border-(--color-primary)/40 ${
        draggable ? "cursor-grap active:cursor-grabbing" : ""
      }`}
      draggable={draggable}
      onDragStart={(e) => {
        e.currentTarget.classList.add("opacity-50", "rotate-1");
        onDragStart?.();
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove("opacity-50", "rotate-1");
      }}
    >
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {compact ? (
              <>
                <h3 className="font-semibold text-(--color-text)">
                  {task.title}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge tone={priorityTone[task.priority] || "blue"}>
                    {formatLabel(task.priority)}
                  </Badge>

                  <Badge tone="violet">{formatLabel(task.category)}</Badge>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-(--color-text)">
                  {task.title}
                </h3>

                <Badge tone={priorityTone[task.priority] || "blue"}>
                  <Dot strokeWidth={6} />
                  {formatLabel(task.priority)}
                </Badge>

                <Badge tone="violet">{formatLabel(task.category)}</Badge>
              </div>
            )}

            <p className="mt-1 line-clamp-2 text-sm text-(--color-muted)">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-(--color-muted)">
          <span className="inline-flex items-center gap-1">
            <CalendarClock size={14} />
            <span className={dueSoon ? "font-semibold text-rose-600" : ""}>
              {dueSoon ? "Overdue" : "Due"}: {formatDate(task.dueDate)}
            </span>
          </span>
          <User size={16} />
          <span>{task.relatedTo}</span>
        </div>

        <div className="flex flex-col gap-3 border-t border-(--color-border) pt-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="truncate text-xs text-(--color-muted)">
            {compact
              ? "Drag to update status"
              : task.assignedTo?.name || "Unassigned"}
          </p>
          {!compact && (
            <div className="flex flex-wrap items-center gap-2">
              <StatusActionButton
                status="todo"
                active={task.status === "todo"}
                onClick={() => onStatusChange(task.id, "todo")}
              >
                To Do
              </StatusActionButton>
              <StatusActionButton
                status="in_progress"
                active={task.status === "in_progress"}
                onClick={() => onStatusChange(task.id, "in_progress")}
              >
                Progress
              </StatusActionButton>
              <StatusActionButton
                status="review"
                active={task.status === "review"}
                onClick={() => onStatusChange(task.id, "review")}
              >
                Review
              </StatusActionButton>
              <StatusActionButton
                status="completed"
                active={["done", "completed"].includes(task.status)}
                onClick={() => onStatusChange(task.id, "completed")}
              >
                Done
              </StatusActionButton>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                <Trash2 size={17} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateTaskModal({ open, onClose, onCreate, users, students, leads }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [category, setCategory] = useState("admin");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [relatedType, setRelatedType] = useState("student");
  const [relatedId, setRelatedId] = useState("");

  const relatedOptions = relatedType === "student" ? students : leads;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("normal");
    setCategory("admin");
    setAssignedTo("");
    setDueDate("");
    setRelatedType("student");
    setRelatedId("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      category,
      assigned_to: assignedTo || null,
      due_date: dueDate || null,
      status: "todo",
      student_id: relatedType === "student" && relatedId ? relatedId : null,
      lead_id: relatedType === "lead" && relatedId ? relatedId : null,
    });
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none"
      >
        <div className="border-b border-(--color-border) px-5 py-4 sm:px-6">
          <h2 className="text-xl font-bold text-(--color-text)">Create Task</h2>
          <p className="mt-1 text-sm text-(--color-muted)">
            Add task details, ownership, due date, and the related CRM record.
          </p>
        </div>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto p-5 sm:p-6">
          <label className="block">
            <span className="text-sm font-semibold text-(--color-text)">
              Task title
            </span>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Follow up missing SOP"
              className="mt-2 bg-(--color-surface)"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-(--color-text)">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add context, notes, or next steps..."
              className="mt-2 min-h-28 w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:bg-(--color-surface)"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-(--color-text)">
                Priority
              </span>
              <SelectDropdown
                label=""
                value={priority}
                onChange={setPriority}
                options={[
                  { value: "low", label: "Low" },
                  { value: "normal", label: "Normal" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-(--color-text)">
                Category
              </span>
              <SelectDropdown
                label=""
                value={category}
                onChange={setCategory}
                options={taskCategories.map((cat) => ({
                  value: cat,
                  label: formatLabel(cat),
                }))}
                placeholder="Select category"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-(--color-text)">
                Assign to
              </span>
              <SelectDropdown
                label=""
                direction="up"
                value={assignedTo}
                onChange={setAssignedTo}
                options={[
                  { value: "", label: "Unassigned" },
                  ...users.map((user) => ({
                    value: user.id,
                    label: user.name,
                  })),
                ]}
                placeholder="Select user"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-(--color-text)">
                Due date
              </span>
              <Input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            <label className="block">
              <span className="text-sm font-semibold text-(--color-text)">
                Related to
              </span>
              <SelectDropdown
                label=""
                direction="up"
                value={relatedType}
                onChange={(value) => {
                  setRelatedType(value);
                  setRelatedId("");
                }}
                options={[
                  { value: "student", label: "Student" },
                  { value: "lead", label: "Lead" },
                  { value: "staff", label: "Staff" },
                ]}
                placeholder="Select type"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-(--color-text)">
                {relatedType === "student" ? "Student" : "Lead"}
              </span>
              <SelectDropdown
                label=""
                direction="up"
                value={relatedId}
                onChange={setRelatedId}
                options={[
                  {
                    value: "",
                    label: "No related record",
                  },
                  ...relatedOptions.map((record) => ({
                    value: record.id,
                    label: record.name,
                  })),
                ]}
                placeholder={`Select ${relatedType}`}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus size={17} />
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState("");
  const [activeColumn, setActiveColumn] = useState(null);
  const loadTasks = async () => {
    try {
      setLoading(true);
      setTasks(await taskApi.getTasks());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const request = Promise.resolve().then(loadTasks);
    return () => request.catch(() => {});
  }, []);

  useEffect(() => {
    const request = Promise.allSettled([
      userApi.getUsers(),
      studentApi.getStudents(),
      leadApi.getLeads(),
    ]).then(([usersResult, studentsResult, leadsResult]) => {
      if (usersResult.status === "fulfilled") setUsers(usersResult.value);
      if (studentsResult.status === "fulfilled")
        setStudents(studentsResult.value);
      if (leadsResult.status === "fulfilled") setLeads(leadsResult.value);
    });

    return () => request.catch(() => {});
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        [task.title, task.description, task.relatedTo, task.assignedTo?.name]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = status === "all" || task.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status, tasks]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      in_progress: tasks.filter((task) => task.status === "in_progress").length,
      review: tasks.filter((task) => task.status === "review").length,
      completed: tasks.filter((task) =>
        ["done", "completed"].includes(task.status),
      ).length,
    }),
    [tasks],
  );

  const handleCreate = async (payload) => {
    try {
      const newTask = await taskApi.createTask(payload);

      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created");
      await loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: nextStatus } : task,
      ),
    );
    try {
      await taskApi.updateTask(id, { status: nextStatus });
      toast.success("Task status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDropOnColumn = async (nextStatus) => {
    if (!draggingTaskId) return;
    const task = tasks.find((item) => item.id === draggingTaskId);
    setDraggingTaskId("");

    if (!task || task.status === nextStatus) return;

    await handleStatusChange(task.id, nextStatus);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((task) => task.id !== id));
    try {
      await taskApi.deleteTask(id);
      toast.success("Task deleted");
    } catch (error) {
      setTasks(previousTasks);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task Workspace"
        title="Tasks"
        description="Plan follow-ups, documentation work, application actions, and internal team tasks."
        icon={ClipboardCheck}
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={17} />
            New Task
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent>
              <p className="text-2xl font-bold text-(--color-text)">{value}</p>
              <p className="mt-1 text-sm text-(--color-muted)">
                {formatLabel(key)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-5">
        <Card>
          <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="lg:w-48"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <div className="flex rounded-xl border border-(--color-border) bg-(--color-surface-muted) p-1">
              <Button
                size="icon"
                variant={view === "list" ? "primary" : "ghost"}
                onClick={() => setView("list")}
              >
                <List size={16} />
              </Button>
              <Button
                size="icon"
                variant={view === "board" ? "primary" : "ghost"}
                onClick={() => setView("board")}
              >
                <LayoutGrid size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="text-center text-(--color-muted)">
              Loading tasks...
            </CardContent>
          </Card>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No tasks found"
            description="Create a task or adjust your filters to see more work items."
          />
        ) : view === "list" ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-4">
            {columns.slice(0, 4).map((column) => (
              <Card
                key={column.key}
                className={`min-h-96 transition-all duration-200 ${
                  activeColumn === column.key
                    ? "scale-[1.02] border-(--color-primary) shadow-xl"
                    : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveColumn(column.key);
                }}
                onDragLeave={() => setActiveColumn(null)}
                onDrop={() => handleDropOnColumn(column.key)}
              >
                <CardHeader
                  className={`flex flex-row items-center justify-between ${
                    column.key === "todo"
                      ? "bg-slate-100 dark:bg-slate-800"
                      : column.key === "in_progress"
                        ? "bg-blue-50 dark:bg-blue-950/40"
                        : column.key === "review"
                          ? "bg-violet-50 dark:bg-violet-950/40"
                          : "bg-emerald-50 dark:bg-emerald-950/40"
                  }`}
                >
                  <h2 className="flex items-center gap-2 font-semibold text-(--color-text)">
                    <column.icon size={17} />
                    {column.label}
                  </h2>
                  <Badge tone={column.tone}>
                    {
                      filteredTasks.filter((task) =>
                        column.key === "completed"
                          ? ["done", "completed"].includes(task.status)
                          : task.status === column.key,
                      ).length
                    }
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredTasks
                    .filter((task) =>
                      column.key === "completed"
                        ? ["done", "completed"].includes(task.status)
                        : task.status === column.key,
                    )
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        draggable
                        onDragStart={() => setDraggingTaskId(task.id)}
                        compact
                      />
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        users={users}
        students={students}
        leads={leads}
      />
    </div>
  );
}





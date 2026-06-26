import { useState } from "react";
import toast from "react-hot-toast";
import { X, UserPlus } from "lucide-react";
import { createStudent } from "../../api/studentApi";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { usePresenceTransition } from "../../components/ui/usePresenceTransition";

const initialForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  phone: "",
};

export default function CreateStudentDrawer({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const { shouldRender, visible } = usePresenceTransition(open);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      toast.error("First name, last name, and email are required");
      return;
    }

    try {
      setSubmitting(true);
      const student = await createStudent({
        first_name: form.first_name.trim(),
        middle_name: form.middle_name.trim() || null,
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
      });

      toast.success("Student created successfully");
      setForm(initialForm);
      onSuccess?.(student);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
              <UserPlus size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Add Student
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Create the basic student record now. Details can be completed from the profile.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Close add student"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              First name
            </span>
            <Input
              value={form.first_name}
              onChange={(event) => updateField("first_name", event.target.value)}
              className="mt-2"
              placeholder="First name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              Middle name
            </span>
            <Input
              value={form.middle_name}
              onChange={(event) => updateField("middle_name", event.target.value)}
              className="mt-2"
              placeholder="Middle name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              Last name
            </span>
            <Input
              value={form.last_name}
              onChange={(event) => updateField("last_name", event.target.value)}
              className="mt-2"
              placeholder="Last name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              Email
            </span>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-2"
              placeholder="name@example.com"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              Phone number
            </span>
            <Input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="mt-2"
              placeholder="Phone number"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Student"}
          </Button>
        </div>
      </form>
    </div>
  );
}

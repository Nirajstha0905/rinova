import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  MessageCircle,
  Pencil,
  Star,
  FileText,
  FolderOpen,
  User,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StudentProfilePage from "./StudentProfilePage";

const Stat = ({ icon: Icon, title, value }) => (
  <div className="felx items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-5 transition hover:shadow-md">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-primary)/10">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wide text-(--color-muted)">
        {title}
      </p>
      <h3 className="text-lg font-bold text-(--color-text)">{value}</h3>
    </div>
  </div>
);

export default function ProfileHero({
  student,
  applications,
  documents,
  onEdit,
  onMessage,
  getInitials,
}) {
  const [profile, setProfile] = useState(null);
  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div className="h-44 bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600" />
      {/* Main Content */}

      <div className="relative px-8 pb-8">
        {/* Avatar */}
        <div className="-mt-16 flex flex-col justify-between gap-8 lg:flex-row">
          <div className="flex gap-6">
            <div
              className="
                        flex h-32 w-32 shrink-0 items-center justify-center rounded-full
                        border-4 border-white bg-(--color-primary) text-4xl font-bold text-white
                        shadow-xl
                        "
            >
              {getInitials(student?.name)}
            </div>
            <div className="pt-16">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold text-(--color-text)">
                  {student?.name}
                </h1>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  Active
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-(--color-muted)">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {student?.email || "Not provided"}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {student?.phone || "No phone"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {student?.preferredCourse || "Program"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-18">
            <Button onClick={onEdit}>
              <Pencil size={18} />
              Edit Profile
            </Button>
          </div>
        </div>
        {/* Stats */}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Star} title="GPA" value={student?.gpa || "N/A"} />
          <Stat
            icon={FileText}
            title="Applications"
            value={profile?.summary?.applications ?? 0}
            helper="Linked applications"
          />
          <Stat
            icon={FolderOpen}
            title="Documents"
            value={documents?.length || "0"}
          />
          <Stat
            icon={User}
            title="Counsellor"
            value={student?.assignedCounsellor || "Not Assigned"}
          />
        </div>
      </div>
    </Card>
  );
}

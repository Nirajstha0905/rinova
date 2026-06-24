import {
  AlertCircle,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  User,
} from "lucide-react";

export const notificationTypes = {
  student: { icon: User, tone: "blue", label: "Student" },
  document: { icon: FileText, tone: "green", label: "Document" },
  lead: { icon: Briefcase, tone: "violet", label: "Lead" },
  task: { icon: Clock, tone: "amber", label: "Task" },
  success: { icon: CheckCircle2, tone: "green", label: "Success" },
  warning: { icon: AlertCircle, tone: "amber", label: "Warning" },
  info: { icon: Info, tone: "blue", label: "Info" },
};

export const getNotificationConfig = (notification) => {
  const key = notification.entityType || notification.type || "info";

  if (notification.title.toLowerCase().includes("reject")) {
    return { icon: AlertCircle, tone: "amber", label: "Action needed" };
  }

  return notificationTypes[key] || { icon: Bell, tone: "blue", label: "Notice" };
};

export const formatNotificationDay = (value) => {
  if (!value) return "Earlier";

  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString();
};

export const formatNotificationTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const groupNotifications = (notifications) =>
  notifications.reduce((groups, notification) => {
    const label = formatNotificationDay(notification.createdAt);
    return {
      ...groups,
      [label]: [...(groups[label] || []), notification],
    };
  }, {});

import prisma from "../config/db.js";

export const createNotification = async ({
  user_id,
  title,
  message,
  type = "info",
  action_url = null,
  entity_id = null,
  entity_type = null,
}) => {
  try {
    return await prisma.notifications.create({
      data: {
        user_id,
        title,
        message,
        type,
        action_url,
        entity_id,
        entity_type,
      },
    });
  } catch (error) {
    console.error("Notification error:", error);
    throw error;
  }
};

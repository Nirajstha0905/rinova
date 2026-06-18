import prisma from "../config/db.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        user_id: req.user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await prisma.notifications.update({
      where: {
        id: req.params.id,
      },
      data: {
        is_read: true,
      },
    });

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update notification",
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notifications.count({
      where: {
        user_id: req.user.id,
        OR: [{ is_read: false }, { is_read: null }],
      },
    });

    res.status(200).json({
      count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch unread count",
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await prisma.notifications.updateMany({
      where: {
        user_id: req.user.id,
        OR: [{ is_read: false }, { is_read: null }],
      },
      data: {
        is_read: true,
      },
    });

    res.status(200).json({
      message: "All notifications marked as read",
      updated: result.count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
};

import prisma from "../config/db.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+ 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate()+ 7);
    const [
      totalStudents,
      studentsThisMonth,
      totalLeads,
      totalApplications,
      totalInstitutions,
      totalCourses,
      totalDocuments,

      pendingTasks,
      pendingFollowups,

      todayTasks,
      overdueTasks,

      unreadNotifications,
    ] = await Promise.all([
      prisma.students.count({
        where: {
          created_at: {
            gte: startOfMonth,
          },
          deleted_at: null,
         },
      }),
      prisma.leads.count(),
      prisma.applications.count({
        where: { deleted_at: null },
      }),
      prisma.institutions.count(),
      prisma.courses.count(),
      prisma.documents.count({
        where: { deleted_at: null },
      }),
      prisma.tasks.count({
        where: { status: "pending" },
      }),
      prisma.lead_followups.count({
        where: { status: "pending" },
      }),
      prisma.tasks.count({
        where: {
          due_date: {
            gte: today,
            lt: tomorrow,
          },
          status:{
            not: "completed",
          }
        }
      }),

      prisma.tasks.count({
        where: {
          due_date: {
            lt: today,
          },
          status: {
            not: "completed",
          },
        },
      }),

      prisma.notifications.count({
        where: {
          is_read: false,
          user_id: req.user.id,
        },
      }),
    ]);

    res.status(200).json({
      totalStudents,
      studentsThisMonth,
      totalLeads,
      totalApplications,
      totalInstitutions,
      totalCourses,
      totalDocuments,

      pendingTasks,
      pendingFollowups,

      todayTasks,
      overdueTasks,

      unreadNotifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};

export const getApplicationsByStatus = async (req, res) => {
  try {
    const stats = await prisma.applications.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch application statistics",
    });
  }
};

export const getStudentsByCountry = async (req, res) => {
  try {
    const stats = await prisma.students.groupBy({
      by: ["preferred_country"],
      _count: {
        preferred_country: true,
      },
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch country statistics",
    });
  }
};

export const getRecentActivities = async (
  req,
  res
) => {
  try {
    const activities =
      await prisma.activity_logs.findMany({
        include: {
          users: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        take: 10,
      });

    res.status(200).json(activities);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch activities",
    });
  }
};

export const getUpcomingTasks = async (
  req,
  res
) => {
  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        due_date: "asc",
      },
      take: 10,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};
import prisma from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalLeads,
      totalApplications,
      totalInstitutions,
      totalCourses,
      totalDocuments,
      pendingTasks,
      pendingFollowups,
    ] = await Promise.all([
      prisma.students.count({
        where: { deleted_at: null },
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
    ]);

    res.status(200).json({
      totalStudents,
      totalLeads,
      totalApplications,
      totalInstitutions,
      totalCourses,
      totalDocuments,
      pendingTasks,
      pendingFollowups,
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
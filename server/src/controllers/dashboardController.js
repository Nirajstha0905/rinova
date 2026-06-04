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
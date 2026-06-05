import prisma from "../config/db.js";

//--------------TIMELINE CONTROLLER------------------------//
export const getStudentTimeline = async (req, res) => {
  try {
    const timeline =
      await prisma.activity_logs.findMany({
        where: {
          student_id: req.params.id,
        },
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
      });
const formattedTimeline = timeline.map(item => ({
  id: item.id,
  action: item.action,
  entity_type: item.entity_type,
  description: item.description,
  date: item.created_at,
  user: item.users
    ? `${item.users.first_name} ${item.users.last_name}`
    : "System",
}));

res.status(200).json(formattedTimeline);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch timeline",
    });
  }
};

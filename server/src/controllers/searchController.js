import prisma from "../config/db.js";

export const globalSearch = async (req, res)=> {
    try {
        const q = req.query.q;

        if(!q){
            return res.status(400).json({
                message: "Search query is required",
            })
        }
    const [students, leads, applications] =
      await Promise.all([

        prisma.students.findMany({
          where: {
            OR: [
              {
                first_name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                last_name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          },
          take: 10,
        }),

        prisma.leads.findMany({
          where: {
            OR: [
              {
                first_name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                last_name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          },
          take: 10,
        }),

        prisma.applications.findMany({
          where: {
            OR: [
              {
                intake: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                remarks: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            students: true,
            institutions: true,
            courses: true,
          },
          take: 10,
        }),
      ]);

res.status(200).json({
    counts: {
        students: students.length,
        leads: leads.length,
        applications: applications.length,
    },
    students,
    leads,
    applications,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed",
    });
  }
};

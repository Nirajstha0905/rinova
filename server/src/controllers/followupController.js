import prisma from "../config/db.js";

export const getTodayFollowups = async (req, res) =>{
    try {
        const today = new Date();

        today.setHours(0,0,0,0);

        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const tasks = await prisma.tasks.findMany({
            where:{
                due_date:{
                    gte: today,
                    lt: tomorrow,
                },
                status:{
                    not: "completed",
                },
            },
            include:{
                students: true,
                leads: true,
            },
            orderBy: {
                due_date: "asc",
            },
        });

        res.status(200).json(tasks);

}
catch(error){
    console.error(error);

    res.status(500).json({
        message: "Failed to fetch today's followups",
    });
    }
};

export const getOverdueFollowups = async (req, res) =>{
    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                due_date: {
                    lt: new Date(),
                },
                status: {
                    not: "completed",
                },
            },
            include:{
                students: true,
                leads: true,
            },
            orderBy:{
                due_date: "asc",
            }
        });
        res.status(200).json(tasks);
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch overdue followups",
        });
    }
};

export const getFollowupSummary = async(req, res)=> {
    try {
        const today= new Date();

        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate()+ 1);

        const nextWeek = new Date(today);

        nextWeek.setDate(nextWeek.getDate()+ 7);

        const [todayCount, upcomingCount, overdueCount] = await Promise.all([
            prisma.tasks.count({
                where: {
                    due_date: {
                        gte: today,
                        lt: tomorrow,
                    },
                    status: {
                        not : "completed",
                    },
                },
            }),
            prisma.tasks.count({
                where: {
                    due_date: {
                        lt: today,
                    },
                    status:{
                    not: "completed",
                    },
                },
            }),
        ]);

        res.status(200).json({
            today: todayCount,
            upcoming: upcomingCount,
            overdue: overdueCount,
        });
    }
    catch (error){
        console.error(error);

        res.status(500).json({
                message: "Failed to fetch summary",
        })
    };
}
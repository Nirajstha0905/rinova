import prisma from "../config/db.js";

export const getOverviewReport = async (req, res) => {
    try {
        
        const [
            totalStudents,
            totalLeads,
            totalApplications,
            totalDocuments,
            totalVisas,
            totalTasks,
            totalNotes,
        ]=
         await Promise.all ([
            prisma.students.count(),
            prisma.leads.count(),
            prisma.applications.count(),
            prisma.documents.count(),
            prisma.visa_applications.count(),
            prisma.tasks.count(),
            prisma.notes.count(),
        ]);

        const applicationStatus =
                await prisma.applications.groupBy({
                    by: ["status"],
                    _count: true,
                });
        const visaStatus =
                await prisma.visa_applications.groupBy({
                    by: ["status"],
                    _count: true,
                });

            res.status(200).json({
                total_students: totalStudents,
                total_leads: totalLeads,
                total_applications: totalApplications,
                total_documents: totalDocuments,
                total_visa_applications: totalVisas,
                total_tasks: totalTasks,
                total_notes: totalNotes,
                application_status_breakdown: applicationStatus,
                visa_status_breakdown: visaStatus,
            });
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch report"
        });
        
    }
};
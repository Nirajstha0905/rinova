import prisma from "../config/db.js";
export const getStudentProfile = async (req, res)=> {
    try {
        const studentId = req.params.id;

        const [
            student,
            applications,
            documents,
            notes,
            academicRecords,
            workExperiences,
            testScores,
            visaApplications,
            timeline,
        ] = await Promise.all([
            prisma.students.findUnique({
                where: {
                    id: req.params.id,
                },
            }),

            prisma.applications.findMany({
                where: {
                    student_id : studentId,
                },
                include: {
                    institutions: true,
                    courses: true,
                },
            }),

            prisma.documents.findMany({
                where :{
                    student_id: studentId,
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.notes.findMany({
                where:{
                    student_id: studentId,
                },
                include: {
                    users:{
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        },
                    },
                },
            }),
            prisma.academic_records.findMany({
                where: {
                    student_id: studentId,
                },
                include: {
                    documents: {
                        include: {
                            users: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.work_experiences.findMany({
                where: {
                    student_id: studentId,
                },
            }),
            prisma.english_test_scores.findMany({
                where:{
                    student_id: studentId,
                },
            }),
            prisma.visa_applications.findMany({
                where: {
                    student_id: studentId,
                },
            }),

            prisma.activity_logs.findMany({
                where: {
                    student_id: studentId,
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
            }),
        ]);
        if(!student){
            return res.status(404).json({
                message: "Student not found",
            });
        }
        const summary = {
            applications: applications.length,
            documents: documents.length,
            notes: notes.length,
            academic_records: academicRecords.length,
            work_experiences: workExperiences.length,
            english_test_scores: testScores.length,
            visa_applications: visaApplications.length,
        };
        res.status(200).json({
            summary,
            student,
            applications,
            documents,
            notes,
            academic_records: academicRecords,
            work_experiences: workExperiences,
            english_test_scores: testScores,
            visa_applications: visaApplications,
            timeline,
        })
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch student profile."
        })
        
    }
}

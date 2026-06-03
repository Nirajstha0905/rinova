import prisma from '../config/db.js';

export const getApplications = async (req, res) => {
    try {
        const applications = await prisma.applications.findMany({
            where:{
                deleted_at: null,
            },
            include:{
                students: true,
                institutions: true,
                courses: true,
            },
            orderBy:{
                created_at: "desc",
            },
        });
        res.status(200).json(applications);
    }
    catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch applications",
        });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const application = await prisma.applications.findUnique({
            where:{
                id: req.params.id,
            },
            include:{
                students: true,
                institutions: true,
                courses: true,
            },
        });
        if(!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }
        res.status(200).json(application);

    }
    catch (error){
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch application",
        });
    }
};

export const createApplication = async (req, res) => {
    try {
        const {
            student_id,
            institution_id,
            course_id,
            intake,
            application_fee,
            remarks,
        } = req.body;
        const course = await prisma.courses.findUnique({
  where: {
    id: course_id,
  },
});

if (!course) {
  return res.status(404).json({
    message: "Course not found",
  });
}

if (course.institution_id !== institution_id) {
  return res.status(400).json({
    message: "Selected course does not belong to the selected institution",
  });
}
        const application = await prisma.applications.create({
            data: {
                student_id,
                institution_id,
                course_id,
                intake,
                application_fee,
                remarks,
                status: "draft",
                stage: "preparation",
            },
        });
        await logActivity({
  user_id: req.user.id,
  student_id: application.student_id,
  entity_type: "application",
  entity_id: application.id,
  action: "create",
  description: "Application submitted",
});
        res.status(201).json(application);
    
    }
    catch (error){
        console.error(error);
        res.status(500).json({
            message: "Failed to create application",
        });
    }
};

export const updateApplication = async (req, res) => {
  try {
    const application = await prisma.applications.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update application",
    });
  }
};

export const updateApplicationStage = async (req, res) => {
  try {
    const { stage, remarks } = req.body;

    const application = await prisma.applications.update({
      where: {
        id: req.params.id,
      },
      data: {
        stage,
      },
    });

    await prisma.application_stage_history.create({
      data: {
        application_id: application.id,
        changed_by: req.user.id,
        remarks,
      },
    });
    await logActivity({
  user_id: req.user?.id,
  student_id: application.student_id,
  entity_type: "application",
  entity_id: application.id,
  action: "stage_change",
  description: `Application moved to ${application.stage}`,
});

    res.status(200).json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update application stage",
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    await prisma.applications.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete application",
    });
  }
};
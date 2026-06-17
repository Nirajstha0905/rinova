import prisma from "../config/db.js";

export const getDocumentChecklist = async (req, res) => {
  try {
    const studentId = req.params.id;

    const documents = await prisma.documents.findMany({
      where: {
        student_id: studentId,
      },
      select: {
        doc_type: true,
      },
    });
    const normalize = (type) => type?.toLowerCase().replace(/\s/g, "_");
    const uploadedTypes = documents.map((doc) => normalize(doc.doc_type));

    const checklist = {
      passport: uploadedTypes.includes("passport"),
      transcript: uploadedTypes.includes("transcript"),
      ielts: uploadedTypes.includes("ielts"),
      cv: uploadedTypes.includes("cv"),
      sop: uploadedTypes.includes("sop"),
      offer_letter: uploadedTypes.includes("offer_letter"),
      financial_documents: uploadedTypes.includes("financial_documents"),
      work_experience: uploadedTypes.includes("work_experience"),
    };
    const total = Object.keys(checklist).length;

    const completed = Object.values(checklist).filter(Boolean).length;

    res.status(200).json({
      total,
      completed,
      completion_percentage: Math.round((completed / total) * 100),
      checklist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch document checklist",
    });
  }
};

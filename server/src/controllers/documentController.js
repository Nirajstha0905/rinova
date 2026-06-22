import prisma from "../config/db.js";
import { createNotification } from "../utils/notificationHelper.js";
import { logActivity } from "../utils/activityLogger.js";

export const uploadDocument = async (req, res) => {
  try {
    const { student_id, application_id, doc_type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file Uploaded",
      });
    }

    const document = await prisma.documents.create({
      data: {
        student_id,
        application_id,
        doc_type,

        file_name: req.file.originalname,
        file_url: req.file.path,
        file_size: req.file.size,

        uploaded_by: req.user.id,
        verification_status: "pending",
      },
    });
    const safeDocument = {
      ...document,
      file_size: document.file_size ? Number(document.file_size) : null,
    };
    res.status(201).json(safeDocument);
    await createNotification({
      user_id: req.user.id,
      title: "Document Uploaded",
      message: `${doc_type} uploaded successfully`,
    });
    await logActivity({
      user_id: req.user.id,
      student_id,
      entity_type: "document",
      entity_id: document.id,
      action: "upload",
      description: `${doc_type} uploaded`,
    });
    await createNotification({
      user_id: documentationOfficer.id,
      title: "Document Uploaded",
      message: `${document.file_name} uploaded.`,
      type: "document",
      entity_id: document.id,
      entity_type: "document",
      action_url: "/documents",
    });
  } catch (error) {
    console.error("upload Error: ", error);

    res.status(500).json({
      message: "Failed to upload document",
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await prisma.documents.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        students: true,
      },

      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};

export const getStudentDocuments = async (req, res) => {
  try {
    const documents = await prisma.documents.findMany({
      where: {
        student_id: req.params.studentId,
        deleted_at: null,
      },
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};

export const getDocumentStats = async (req, res) => {
  try {
    const baseWhere = { deleted_at: null };

    const [total, verified, pending, rejected] = await Promise.all([
      prisma.documents.count({ where: baseWhere }),
      prisma.documents.count({
        where: { ...baseWhere, verification_status: "verified" },
      }),
      prisma.documents.count({
        where: { ...baseWhere, verification_status: "pending" },
      }),
      prisma.documents.count({
        where: { ...baseWhere, verification_status: "rejected" },
      }),
    ]);

    res.json({ total, verified, pending, rejected });
  } catch (error) {
    console.error("getDocumentStats error:", error);
    res.status(500).json({
      message: "Failed to fetch document stats",
    });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const { verification_status } = req.body;

    const document = await prisma.documents.update({
      where: {
        id: req.params.id,
      },

      data: {
        verification_status,
      },
    });

    res.status(200).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to verify document",
    });
  }
};

export const rejectDocument = async (req, res) => {
  try {
    const { rejection_reason } = req.body;

    const document = await prisma.documents.update({
      where: {
        id: req.params.id,
      },

      data: {
        verification_status: "rejected",
        rejection_reason,
      },
    });
    await createNotification({
      user_id: document.uploaded_by,
      title: "Document Rejected",
      message: `${document.doc_type} was rejected`,
    });

    await logActivity({
      user_id: req.user.id,
      student_id: document.student_id,
      entity_type: "document",
      entity_id: document.id,
      action: "reject",
      description: `${document.file_name} rejected`,
    });
    res.status(200).json(document);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to reject document",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await prisma.documents.update({
      where: {
        id: req.params.id,
      },

      data: {
        deleted_at: new Date(),
      },
    });
    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete document",
    });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const document = await prisma.documents.findUnique({
      where: { id: req.params.id },
    });

    if (!document) {
      return res.status(404).json({ message: "Not found" });
    }

    res.download(document.file_url);
  } catch (error) {
    res.status(500).json({ message: "Download failed" });
  }
};

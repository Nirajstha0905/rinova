
export const logCreate = async (
  req,
  entity_type,
  entity_id,
  description,
  student_id = null
) => {
  await logActivity({
    user_id: req.user?.id,
    student_id,
    entity_type,
    entity_id,
    action: "create",
    description,
  });
};
export function getModuleDescription(moduleName, role) {
  const descriptions = {
    Dashboard: 'Operational overview for students, applications, documents, follow-ups, visa outcomes, and staff workload.',
    Leads: 'Capture enquiries, assign counsellors, schedule follow-ups, and convert qualified leads into student profiles.',
    Students: 'Maintain complete student records with passport, academic, English test, work, preference, and activity details.',
    Documents: 'Upload, review, approve, reject, and request re-upload for all student document categories.',
    Applications: 'Track institution and visa applications through customizable workflow stages.',
    Tasks: 'Create follow-ups, assign responsibilities, monitor deadlines, and close completed work.',
    'Student Portal': 'Student-facing portal for uploads, application status, pending requirements, and updates.',
  };

  if (role === 'Student' && moduleName === 'Dashboard') {
    return 'Personal overview for your applications, documents, tasks, and messages.';
  }

  return descriptions[moduleName] || 'Phase 1 CRM module.';
}

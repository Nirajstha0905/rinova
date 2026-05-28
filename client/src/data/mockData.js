export const initialLeads = [
  {
    id: 1,
    name: 'Rohan Basnet',
    country: 'Canada',
    course: 'Business Analytics',
    source: 'Facebook campaign',
    counsellor: 'Maya Thapa',
    status: 'Counselling',
    nextFollowUp: 'Today, 2:00 PM',
  },
  {
    id: 2,
    name: 'Anita Gurung',
    country: 'Australia',
    course: 'Nursing',
    source: 'Walk-in',
    counsellor: 'Aarav Sharma',
    status: 'New enquiry',
    nextFollowUp: 'Tomorrow, 11:30 AM',
  },
  {
    id: 3,
    name: 'Samir KC',
    country: 'United Kingdom',
    course: 'Computer Science',
    source: 'Referral',
    counsellor: 'Maya Thapa',
    status: 'Documents requested',
    nextFollowUp: 'May 28, 10:00 AM',
  },
];

export const initialStudents = [
  {
    id: 101,
    name: 'Emma Thompson',
    passport: 'N1234567',
    country: 'Canada',
    course: 'MBA',
    counsellor: 'Maya Thapa',
    stage: 'Visa Preparation',
    tags: ['High priority', 'Fall intake'],
    academics: 'BBA, 3.4 GPA',
    english: 'IELTS 7.0',
    work: '2 years banking',
  },
  {
    id: 102,
    name: 'Aayush Shrestha',
    passport: 'PA778899',
    country: 'Australia',
    course: 'IT',
    counsellor: 'Aarav Sharma',
    stage: 'Offer Received',
    tags: ['Scholarship'],
    academics: 'BSc CSIT, 72%',
    english: 'PTE 68',
    work: 'Internship',
  },
  {
    id: 103,
    name: 'Priya Lama',
    passport: 'N5566123',
    country: 'United Kingdom',
    course: 'Public Health',
    counsellor: 'Maya Thapa',
    stage: 'Documents Pending',
    tags: ['Needs SOP'],
    academics: 'BPH, 3.6 GPA',
    english: 'IELTS 6.5',
    work: '1 year clinic assistant',
  },
];

export const initialDocuments = [
  { id: 1, student: 'Emma Thompson', category: 'Passport', file: 'passport_emma.pdf', status: 'Approved', owner: 'Kabir Karki' },
  { id: 2, student: 'Emma Thompson', category: 'Financial documents', file: 'bank_statement.pdf', status: 'Needs re-upload', owner: 'Kabir Karki' },
  { id: 3, student: 'Aayush Shrestha', category: 'Offer letters', file: 'offer_deakin.pdf', status: 'Approved', owner: 'Kabir Karki' },
  { id: 4, student: 'Priya Lama', category: 'SOP/GS statements', file: 'sop_draft.docx', status: 'Under review', owner: 'Kabir Karki' },
];

export const initialApplications = [
  {
    id: 1,
    student: 'Emma Thompson',
    institution: 'University of Toronto',
    country: 'Canada',
    type: 'Institution',
    stage: 'Visa Preparation',
    progress: 70,
  },
  {
    id: 2,
    student: 'Aayush Shrestha',
    institution: 'Deakin University',
    country: 'Australia',
    type: 'Institution',
    stage: 'Offer Received',
    progress: 55,
  },
  {
    id: 3,
    student: 'Priya Lama',
    institution: 'University of Manchester',
    country: 'United Kingdom',
    type: 'Institution',
    stage: 'Documents Pending',
    progress: 30,
  },
];

export const initialTasks = [
  { id: 1, title: 'Call Rohan for shortlist confirmation', owner: 'Maya Thapa', due: 'Today', status: 'Due today', priority: 'High' },
  { id: 2, title: 'Review Emma bank statement re-upload', owner: 'Kabir Karki', due: 'Today', status: 'Due today', priority: 'High' },
  { id: 3, title: 'Convert Anita lead after counselling', owner: 'Aarav Sharma', due: 'Tomorrow', status: 'Scheduled', priority: 'Medium' },
  { id: 4, title: 'Update Priya SOP feedback', owner: 'Maya Thapa', due: 'Overdue', status: 'Overdue', priority: 'High' },
];

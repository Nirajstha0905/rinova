import { createContext, useState } from 'react';
import { initialLeads, initialStudents, initialDocuments, initialApplications, initialTasks } from '../data/mockData';

export const CRMDataContext = createContext();

export function CRMDataProvider({ children }) {
  const [leads, setLeads] = useState(initialLeads);
  const [students, setStudents] = useState(initialStudents);
  const [documents, setDocuments] = useState(initialDocuments);
  const [applications] = useState(initialApplications);
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <CRMDataContext.Provider
      value={{
        leads,
        setLeads,
        students,
        setStudents,
        documents,
        setDocuments,
        applications,
        tasks,
        setTasks,
      }}
    >
      {children}
    </CRMDataContext.Provider>
  );
}

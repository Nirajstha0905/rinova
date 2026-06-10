// src/config/roleAccess.js
export const roleAccess = {
  "Super Admin": [
    "/", "/leads", "/students", "/applications",
    "/documents", "/tasks", "/reports", "/settings", "/users"
  ],
  "Consultancy Admin": [
    "/", "/leads", "/students", "/applications",
    "/documents", "/tasks", "/reports"
  ],
  "Counsellors": [
    "/", "/leads", "/students", "/applications", "/tasks"
  ],
  "Documentation Officers": [
    "/", "/documents", "/applications", "/tasks"
  ],
  "Students": [
    "/", "/my-application", "/my-documents"
  ],
};
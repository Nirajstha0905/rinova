export const ROLES = Object.freeze({
  ADMIN: 'admin',
  STAFF: 'staff',
  AGENT: 'agent',
});

export const allowedRoles = Object.values(ROLES);

export const normalizeRole = (role = ROLES.STAFF) => role.toLowerCase().trim();

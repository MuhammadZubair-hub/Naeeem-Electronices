import { Role } from '../types';

/**
 * Role hierarchy: CEO > GM > RM > ZM > BR > AVO
 * Each role can access their own level and all lower levels
 */

const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.CEO]: 6,
  [Role.GM]: 5,
  [Role.RM]: 4,
  [Role.ZM]: 3,
  [Role.BR]: 2,
  [Role.AVO]: 1,
};

/**
 * Check if a user role has access to a specific resource
 */
export const hasAccess = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Check if a user role can access multiple roles (any of them)
 */
export const hasAnyAccess = (userRole: Role, requiredRoles: Role[]): boolean => {
  return requiredRoles.some(role => hasAccess(userRole, role));
};

/**
 * Check if a user role can access all specified roles
 */
export const hasAllAccess = (userRole: Role, requiredRoles: Role[]): boolean => {
  return requiredRoles.every(role => hasAccess(userRole, role));
};

/**
 * Get all roles that a user can access
 */
export const getAccessibleRoles = (userRole: Role): Role[] => {
  return Object.keys(ROLE_HIERARCHY)
    .map(role => role as Role)
    .filter(role => hasAccess(userRole, role));
};

/**
 * Get the role level number
 */
export const getRoleLevel = (role: Role): number => {
  return ROLE_HIERARCHY[role];
};

/**
 * Check if user can manage a specific branch
 */
export const canManageBranch = (userRole: Role, userBranchId?: string, targetBranchId?: string): boolean => {
  // CEO and GM can manage all branches
  if (userRole === Role.CEO || userRole === Role.GM) {
    return true;
  }
  
  // Other roles can only manage their own branch
  return userBranchId === targetBranchId;
};

/**
 * Check if user can manage a specific zone
 */
export const canManageZone = (userRole: Role, userZoneId?: string, targetZoneId?: string): boolean => {
  // CEO, GM, and RM can manage all zones
  if (userRole === Role.CEO || userRole === Role.GM || userRole === Role.RM) {
    return true;
  }
  
  // ZM can manage their own zone
  if (userRole === Role.ZM) {
    return userZoneId === targetZoneId;
  }
  
  // BR and AVO can only manage their own zone
  return userZoneId === targetZoneId;
};

/**
 * Check if user can manage a specific region
 */
export const canManageRegion = (userRole: Role, userRegionId?: string, targetRegionId?: string): boolean => {
  // CEO, GM, and RM can manage all regions
  if (userRole === Role.CEO || userRole === Role.GM || userRole === Role.RM) {
    return true;
  }
  
  // Other roles can only manage their own region
  return userRegionId === targetRegionId;
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: Role): string => {
  const roleNames = {
    [Role.CEO]: 'Chief Executive Officer',
    [Role.GM]: 'General Manager',
    [Role.RM]: 'Regional Manager',
    [Role.ZM]: 'Zone Manager',
    [Role.BR]: 'Branch Manager',
    [Role.AVO]: 'Area Sales Officer',
  };
  return roleNames[role];
};

/**
 * Get role short name
 */
export const getRoleShortName = (role: Role): string => {
  const roleNames = {
    [Role.CEO]: 'CEO',
    [Role.GM]: 'GM',
    [Role.RM]: 'RM',
    [Role.ZM]: 'ZM',
    [Role.BR]: 'BR',
    [Role.AVO]: 'AVO',
  };
  return roleNames[role];
};

/**
 * Check if user can view financial data
 */
export const canViewFinancialData = (userRole: Role): boolean => {
  return hasAccess(userRole, Role.AVO); // All roles can view financial data
};

/**
 * Check if user can edit financial data
 */
export const canEditFinancialData = (userRole: Role): boolean => {
  return hasAccess(userRole, Role.BR); // BR and above can edit
};

/**
 * Check if user can view customer data
 */
export const canViewCustomerData = (userRole: Role): boolean => {
  return hasAccess(userRole, Role.AVO); // All roles can view customer data
};

/**
 * Check if user can edit customer data
 */
export const canEditCustomerData = (userRole: Role): boolean => {
  return hasAccess(userRole, Role.AVO); // All roles can edit customer data
};

/**
 * Check if user can view reports
 */
export const canViewReports = (userRole: Role): boolean => {
  return hasAccess(userRole, Role.AVO); // All roles can view reports
};

/**
 * Check if user can generate reports
 */
export const canGenerateReports = (userRole: Role): boolean => {
  return hasAccess(userRole, Role.BR); // BR and above can generate reports
};

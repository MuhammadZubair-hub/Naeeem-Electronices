import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Role } from '../types';
import {
  hasAccess,
  hasAnyAccess,
  hasAllAccess,
  getAccessibleRoles,
  canManageBranch,
  canManageZone,
  canManageRegion,
  canViewFinancialData,
  canEditFinancialData,
  canViewCustomerData,
  canEditCustomerData,
  canViewReports,
  canGenerateReports,
} from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return {
      hasAccess: () => false,
      hasAnyAccess: () => false,
      hasAllAccess: () => false,
      getAccessibleRoles: () => [],
      canManageBranch: () => false,
      canManageZone: () => false,
      canManageRegion: () => false,
      canViewFinancialData: () => false,
      canEditFinancialData: () => false,
      canViewCustomerData: () => false,
      canEditCustomerData: () => false,
      canViewReports: () => false,
      canGenerateReports: () => false,
      userRole: null,
    };
  }

  return {
    hasAccess: (requiredRole: Role) => hasAccess(user.role, requiredRole),
    hasAnyAccess: (requiredRoles: Role[]) => hasAnyAccess(user.role, requiredRoles),
    hasAllAccess: (requiredRoles: Role[]) => hasAllAccess(user.role, requiredRoles),
    getAccessibleRoles: () => getAccessibleRoles(user.role),
    canManageBranch: (targetBranchId?: string) => 
      canManageBranch(user.role, user.branchId, targetBranchId),
    canManageZone: (targetZoneId?: string) => 
      canManageZone(user.role, user.zoneId, targetZoneId),
    canManageRegion: (targetRegionId?: string) => 
      canManageRegion(user.role, user.regionId, targetRegionId),
    canViewFinancialData: () => canViewFinancialData(user.role),
    canEditFinancialData: () => canEditFinancialData(user.role),
    canViewCustomerData: () => canViewCustomerData(user.role),
    canEditCustomerData: () => canEditCustomerData(user.role),
    canViewReports: () => canViewReports(user.role),
    canGenerateReports: () => canGenerateReports(user.role),
    userRole: user.role,
  };
};

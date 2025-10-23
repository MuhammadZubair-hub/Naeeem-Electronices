import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Role } from '../types';
import { useTheme } from '../hooks/useTheme';
import MainHeader from '../components/common/MainHeader';

interface RoleGuardProps {
  children: React.ReactNode;
}

// Role hierarchy: CEO > GM > RM > ZM > BR > AVO
const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.CEO]: 7,
  [Role.GM]: 6,
  [Role.RM]: 5,
  [Role.ZM]: 4,
    [Role.AVM]: 3,
  [Role.BR]: 2,
  [Role.AVO]: 1,
};

const mapDesignationToRole = (designation: string): Role | null => {
  if (!designation) return null;
  switch (designation.toUpperCase()) {
    case 'CEO':
      return Role.CEO;
    case 'GM':
      return Role.GM;
    case 'RM':
      return Role.RM;
    case 'ZM':
      return Role.ZM;
    case 'BR':
      return Role.BR;
       case 'AVM':
      return Role.AVM;
    case 'AVO':
      return Role.AVO;
    default:
      return null;
  }
};

export const RoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Role[],
) => {
  return (props: P) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { theme } = useTheme();

    if (!user) {
      return (
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Authentication required
          </Text>
        </View>
      );
    }

    const userRole = mapDesignationToRole(user?.designation);
    if (!userRole) {
      return (
        
        <View

          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Invalid role
          </Text>
        </View>
      );
    }

    const userRoleLevel = ROLE_HIERARCHY[userRole];
    const hasAccess = allowedRoles.some(role => {
      const roleLevel = ROLE_HIERARCHY[role];
      return userRoleLevel >= roleLevel;  
    });

    if (!hasAccess) {
      return (
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Access Denied
          </Text>
          <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
            You don't have permission to access this section
          </Text>
        </View>
      );
    }

    return <Component {...props} />;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

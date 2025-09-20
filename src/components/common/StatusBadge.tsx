import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'overdue' | 'paid' | 'unpaid' | 'partial';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'paid':
        return {
          backgroundColor: theme.colors.success + '20',
          color: theme.colors.success,
          icon: '✅',
        };
      case 'inactive':
      case 'cancelled':
        return {
          backgroundColor: theme.colors.error + '20',
          color: theme.colors.error,
          icon: '❌',
        };
      case 'pending':
        return {
          backgroundColor: theme.colors.warning + '20',
          color: theme.colors.warning,
          icon: '⏳',
        };
      case 'overdue':
      case 'unpaid':
        return {
          backgroundColor: theme.colors.error + '20',
          color: theme.colors.error,
          icon: '⚠️',
        };
      case 'partial':
        return {
          backgroundColor: theme.colors.warning + '20',
          color: theme.colors.warning,
          icon: '📊',
        };
      default:
        return {
          backgroundColor: theme.colors.textSecondary + '20',
          color: theme.colors.textSecondary,
          icon: '📄',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 10,
          borderRadius: 8,
        };
      case 'md':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 12,
          borderRadius: 12,
        };
      case 'lg':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          borderRadius: 16,
        };
      default:
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 12,
          borderRadius: 12,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const sizeStyles = getSizeStyles();

  const badgeStyle = [
    styles.badge,
    {
      backgroundColor: statusConfig.backgroundColor,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      borderRadius: sizeStyles.borderRadius,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: statusConfig.color,
      fontSize: sizeStyles.fontSize,
      fontFamily: 'Poppins-SemiBold',
    },
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyles}>
        {statusConfig.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
});

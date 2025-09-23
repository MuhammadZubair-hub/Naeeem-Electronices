import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  size = 'md',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
        };
      case 'md':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.white,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          color: theme.colors.white,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          color: theme.colors.white,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
          color: theme.colors.white,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: disabled
        ? theme.colors.disabled
        : variantStyles.backgroundColor,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      width: fullWidth
        ? ('100%' as import('react-native').DimensionValue)
        : undefined,
      elevation: disabled ? 0 : 3,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: disabled ? 0 : 0.2,
      shadowRadius: 4,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: disabled ? theme.colors.textDisabled : variantStyles.color,
      fontSize: sizeStyles.fontSize,
      fontFamily: 'Poppins-SemiBold',
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
  shadowColor?: string;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  style,
  padding = 'md',
  elevation = 'md',
  borderRadius = 'md',
  gradient = false,
  shadowColor,
}) => {
  const { theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 20;
      case 'xl': return 24;
      default: return 16;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'sm': return 8;
      case 'md': return 12;
      case 'lg': return 16;
      case 'xl': return 20;
      default: return 12;
    }
  };

  const getElevation = () => {
    switch (elevation) {
      case 'none': return { elevation: 0, shadowOpacity: 0 };
      case 'sm': return { elevation: 2, shadowOpacity: 0.1 };
      case 'md': return { elevation: 4, shadowOpacity: 0.15 };
      case 'lg': return { elevation: 8, shadowOpacity: 0.2 };
      default: return { elevation: 4, shadowOpacity: 0.15 };
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      padding: getPadding(),
      borderRadius: getBorderRadius(),
      ...getElevation(),
      shadowColor: shadowColor || theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: elevation === 'none' ? 0 : 8,
    },
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
  },
});

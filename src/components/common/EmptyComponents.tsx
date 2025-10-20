import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';

interface EmptyComponentsProps {
  emptyMessage?: string; 
}

const EmptyComponents: React.FC<EmptyComponentsProps> = ({ emptyMessage }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: AppSizes.Margin_Vertical_20,
        paddingHorizontal: AppSizes.Padding_Horizontal_10, 
      }}
    >
      <Text
        style={{
          color: theme.colors.secondaryDark,
          fontFamily: fonts.semiBold,
          fontSize: AppSizes.Font_16,
          textAlign: 'center', 
        }}
      >
        {emptyMessage ?? 'No items found...'}
      </Text>

      <Text
        style={{
          color: theme.colors.secondaryDark,
          fontFamily: fonts.medium, 
          fontSize: AppSizes.Font_14,
          marginTop: AppSizes.Margin_Vertical_5,
        }}
      >
        Refresh the screen
      </Text>
    </View>
  );
};

export default EmptyComponents;

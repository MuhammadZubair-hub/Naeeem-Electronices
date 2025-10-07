import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';

interface SearchBarProps {
  value: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  style?: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        style,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={theme.colors.textTertiary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.textPrimary }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange('')}
          style={styles.clearButton}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={theme.colors.textTertiary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
  },
});

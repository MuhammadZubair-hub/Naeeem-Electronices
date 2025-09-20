import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface Option {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ options, value, onChange, placeholder = 'Select', style }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = React.useState(false);

  const selected = options.find(opt => opt.value === value);

  return (
    <>
      <TouchableOpacity style={[styles.container, style, { backgroundColor: theme.colors.surfaceVariant }]} onPress={() => setVisible(true)}>
        <Text style={[styles.text, { color: selected ? theme.colors.textPrimary : theme.colors.textTertiary }]}> 
          {selected ? selected.label : placeholder}
        </Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.dropdown, { backgroundColor: theme.colors.surface }]}> 
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { onChange(item.value); setVisible(false); }} style={styles.option}>
                  <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: 240,
    borderRadius: 10,
    padding: 8,
    elevation: 4,
    maxHeight: 320,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

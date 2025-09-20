import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface Column<T> {
  key: keyof T;
  title: string;
  width?: number | string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowPress?: (row: T) => void;
  emptyText?: string;
  loading?: boolean;
}

export function Table<T extends object>({ columns, data, onRowPress, emptyText = 'No data found', loading = false }: TableProps<T>) {
  const { theme } = useTheme();

  if (loading) {
    return <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>Loading...</Text>;
  }

  if (!data.length) {
    return <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>{emptyText}</Text>;
  }

  return (
    <ScrollView horizontal style={styles.scroll}>
      <View>
        {/* Header */}
        <View style={[styles.row, styles.header, { backgroundColor: theme.colors.surfaceVariant }]}> 
          {columns.map((col, idx) => (
            <Text key={String(col.key)} style={[styles.headerCell, { width: col.width || 120, color: theme.colors.textSecondary }]}> 
              {col.title}
            </Text>
          ))}
        </View>
        {/* Rows */}
        {data.map((row, rowIdx) => (
          <TouchableOpacity key={rowIdx} onPress={() => onRowPress?.(row)} activeOpacity={onRowPress ? 0.7 : 1}>
            <View style={[styles.row, { backgroundColor: rowIdx % 2 === 0 ? theme.colors.surface : theme.colors.surfaceVariant }]}> 
              {columns.map((col, colIdx) => (
                <View key={String(col.key)} style={{ width: col.width || 120 }}>
                  <Text style={[styles.cell, { color: theme.colors.textPrimary }]}> 
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginVertical: 32,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';

const { width } = Dimensions.get('window');

interface KPIData {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage' | 'rating';
  icon: string;
  color: string;
}

interface KPIPanelProps {
  title: string;
  kpis: KPIData[];
  columns?: number;
}

export const KPIPanel: React.FC<KPIPanelProps> = ({
  title,
  kpis,
  columns = 2,
}) => {
  const { theme } = useTheme();

  const formatValue = (value: number, format: string): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-PK', {
          style: 'currency',
          currency: 'PKR',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'rating':
        return `${value}/5`;
      default:
        return new Intl.NumberFormat('en-PK').format(value);
    }
  };

  const getIcon = (icon: string): string => {
    const iconMap: Record<string, string> = {
      'trending-up': '📈',
      'users': '👥',
      'shopping-cart': '🛒',
      'alert-circle': '⚠️',
      'building': '🏢',
      'dollar-sign': '💰',
      'star': '⭐',
      'package': '📦',
      'chart': '📊',
      'target': '🎯',
    };
    return iconMap[icon] || '📊';
  };

  const renderKPICard = (kpi: KPIData) => (
    <Card key={kpi.id} style={[styles.kpiCard, { width: (width - 60) / columns }]} padding="md">
      <View style={styles.kpiHeader}>
        <Text style={[styles.kpiTitle, { color: theme.colors.textSecondary }]}>
          {kpi.title}
        </Text>
        <View style={[styles.kpiIcon, { backgroundColor: kpi.color + '20' }]}>
          <Text style={[styles.kpiIconText, { color: kpi.color }]}>
            {getIcon(kpi.icon)}
          </Text>
        </View>
      </View>
      <Text style={[styles.kpiValue, { color: theme.colors.textPrimary }]}>
        {formatValue(kpi.value, kpi.format)}
      </Text>
      <View style={styles.kpiChange}>
        <Text style={[
          styles.kpiChangeText,
          { 
            color: kpi.changeType === 'increase' ? theme.colors.success : 
                   kpi.changeType === 'decrease' ? theme.colors.error : 
                   theme.colors.textSecondary 
          }
        ]}>
          {kpi.changeType === 'increase' ? '↗' : kpi.changeType === 'decrease' ? '↘' : '→'} {Math.abs(kpi.change)}%
        </Text>
        <Text style={[styles.kpiChangeLabel, { color: theme.colors.textTertiary }]}>
          vs last month
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.kpiGrid}>
        {kpis.map(renderKPICard)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  kpiCard: {
    marginBottom: 16,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  kpiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiIconText: {
    fontSize: 12,
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  kpiChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiChangeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginRight: 4,
  },
  kpiChangeLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
});

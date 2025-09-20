import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Sale } from '../../services/mock/mockDataService';
import { screenName } from '../../navigation/ScreenName';

const { width } = Dimensions.get('window');

interface InvoiceDetailProps {
  route: {
    params: {
      invoiceId: string;
    };
  };
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<Sale | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Find invoice by ID
    const foundInvoice = mockDataService.getSaleById(invoiceId);
    if (foundInvoice) {
      setInvoice(foundInvoice);
    }
  }, [invoiceId]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleEditInvoice = () => {
    Alert.alert('Edit Invoice', 'Invoice editing functionality will be implemented soon.');
  };

  const handleAddPayment = () => {
    Alert.alert('Add Payment', 'Payment functionality will be implemented soon.');
  };

  const handlePrintInvoice = () => {
    Alert.alert('Print Invoice', 'Print functionality will be implemented soon.');
  };

  const handleSendInvoice = () => {
    Alert.alert('Send Invoice', 'Email functionality will be implemented soon.');
  };

  const handleViewCustomer = () => {
    if (invoice) {
      (navigation as any).navigate(screenName.CustomerDetail, { customerId: invoice.customerId });
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return theme.colors.success;
      case 'partial': return theme.colors.warning;
      case 'unpaid': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const renderItemRow = (item: any, index: number) => (
    <View key={item.id} style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemQuantity, { color: theme.colors.textSecondary }]}>
          Qty: {item.quantity}
        </Text>
      </View>
      <View style={styles.itemPricing}>
        <Text style={[styles.itemUnitPrice, { color: theme.colors.textSecondary }]}>
          {formatCurrency(item.unitPrice)} each
        </Text>
        <Text style={[styles.itemTotalPrice, { color: theme.colors.textPrimary }]}>
          {formatCurrency(item.totalPrice)}
        </Text>
      </View>
    </View>
  );

  if (!invoice) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Invoice not found
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load invoice data
        </Text>
        <Button
          title="Retry"
          onPress={onRefresh}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Invoice Details
          </Text>
          <TouchableOpacity onPress={handleEditInvoice} style={styles.editButton}>
            <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Invoice Header */}
        <Card style={styles.headerCard} padding="lg">
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceInfo}>
              <Text style={[styles.invoiceNumber, { color: theme.colors.textPrimary }]}>
                {invoice.invoiceNumber}
              </Text>
              <Text style={[styles.invoiceDate, { color: theme.colors.textSecondary }]}>
                Date: {formatDate(invoice.saleDate)}
              </Text>
              {invoice.dueDate && (
                <Text style={[styles.dueDate, { color: theme.colors.warning }]}>
                  Due: {formatDate(invoice.dueDate)}
                </Text>
              )}
            </View>
            <StatusBadge status={invoice.paymentStatus} size="md" />
          </View>

          <View style={styles.customerInfo}>
            <Text style={[styles.customerLabel, { color: theme.colors.textSecondary }]}>
              Customer:
            </Text>
            <TouchableOpacity onPress={handleViewCustomer}>
              <Text style={[styles.customerName, { color: theme.colors.primary }]}>
                {invoice.customerName}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.salesInfo}>
            <Text style={[styles.salesLabel, { color: theme.colors.textSecondary }]}>
              Sales Person: {invoice.salesPersonName}
            </Text>
            <Text style={[styles.paymentMethod, { color: theme.colors.textSecondary }]}>
              Payment Method: {invoice.paymentMethod.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </Card>

        {/* Items */}
        <Card style={styles.itemsCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Items ({invoice.items.length})
          </Text>
          {invoice.items.map(renderItemRow)}
        </Card>

        {/* Totals */}
        <Card style={styles.totalsCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Invoice Summary
          </Text>
          <View style={styles.totalsGrid}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
                Subtotal:
              </Text>
              <Text style={[styles.totalValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(invoice.totalAmount)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
                Discount:
              </Text>
              <Text style={[styles.totalValue, { color: theme.colors.success }]}>
                -{formatCurrency(invoice.discount)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
                Tax:
              </Text>
              <Text style={[styles.totalValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(invoice.tax)}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotalRow]}>
              <Text style={[styles.finalTotalLabel, { color: theme.colors.textPrimary }]}>
                Total Amount:
              </Text>
              <Text style={[styles.finalTotalValue, { color: theme.colors.primary }]}>
                {formatCurrency(invoice.finalAmount)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Payment Status */}
        <Card style={styles.paymentCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Payment Status
          </Text>
          <View style={styles.paymentStatus}>
            <View style={[
              styles.paymentStatusIndicator,
              { backgroundColor: getPaymentStatusColor(invoice.paymentStatus) + '20' }
            ]}>
              <Text style={[
                styles.paymentStatusText,
                { color: getPaymentStatusColor(invoice.paymentStatus) }
              ]}>
                {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
              </Text>
            </View>
            <Text style={[styles.paymentStatusDescription, { color: theme.colors.textSecondary }]}>
              {invoice.paymentStatus === 'paid' ? 'Payment completed successfully' :
               invoice.paymentStatus === 'partial' ? 'Partial payment received' :
               'Payment pending'}
            </Text>
          </View>
        </Card>

        {/* Notes */}
        {invoice.notes && (
          <Card style={styles.notesCard} padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Notes
            </Text>
            <Text style={[styles.notesText, { color: theme.colors.textSecondary }]}>
              {invoice.notes}
            </Text>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <View style={styles.actionRow}>
            <Button
              title="Add Payment"
              onPress={handleAddPayment}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="Print Invoice"
              onPress={handlePrintInvoice}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
          <View style={styles.actionRow}>
            <Button
              title="Send Invoice"
              onPress={handleSendInvoice}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="View Customer"
              onPress={handleViewCustomer}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  headerCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  salesInfo: {
    gap: 4,
  },
  salesLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  paymentMethod: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  itemsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemUnitPrice: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  totalsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  totalsGrid: {
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  finalTotalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  finalTotalLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  finalTotalValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  paymentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  paymentStatus: {
    alignItems: 'center',
  },
  paymentStatusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  paymentStatusText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  paymentStatusDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  notesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

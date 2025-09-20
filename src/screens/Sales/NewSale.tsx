import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Customer } from '../../services/mock/mockDataService';

const { width } = Dimensions.get('window');

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const NewSale: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [tax, setTax] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'cheque'>('cash');
  const [notes, setNotes] = useState('');

  // Mock products
  const products = [
    { id: 'prod-1', name: 'Samsung 55" LED TV', price: 20000 },
    { id: 'prod-2', name: 'Sony Sound System', price: 5000 },
    { id: 'prod-3', name: 'LG Refrigerator', price: 15000 },
    { id: 'prod-4', name: 'Dell Laptop', price: 18000 },
    { id: 'prod-5', name: 'Microwave Oven', price: 12000 },
    { id: 'prod-6', name: 'Washing Machine', price: 17500 },
    { id: 'prod-7', name: 'Electric Kettle', price: 8000 },
    { id: 'prod-8', name: 'Gaming Console', price: 22000 },
    { id: 'prod-9', name: 'Smartphone Bundle', price: 7000 },
    { id: 'prod-10', name: 'Student Laptop', price: 15000 },
  ];

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = parseFloat(discount) || 0;
    const taxableAmount = subtotal - discountAmount;
    return (taxableAmount * (parseFloat(tax) || 0)) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = calculateTax();
    return subtotal - discountAmount + taxAmount;
  };

  const handleAddItem = () => {
    Alert.alert(
      'Add Product',
      'Select a product to add:',
      products.map(product => ({
        text: `${product.name} - ${formatCurrency(product.price)}`,
        onPress: () => {
          const existingItem = items.find(item => item.name === product.name);
          if (existingItem) {
            setItems(items.map(item =>
              item.name === product.name
                ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
                : item
            ));
          } else {
            const newItem: SaleItem = {
              id: product.id,
              name: product.name,
              quantity: 1,
              unitPrice: product.price,
              totalPrice: product.price,
            };
            setItems([...items, newItem]);
          }
        },
      }))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setItems(items.map(item =>
      item.id === itemId
        ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
        : item
    ));
  };

  const handleSelectCustomer = () => {
    const customers = mockDataService.getCustomers();
    Alert.alert(
      'Select Customer',
      'Choose a customer:',
      customers.map(customer => ({
        text: `${customer.name} (${customer.customerType})`,
        onPress: () => setSelectedCustomer(customer),
      }))
    );
  };

  const handleCreateSale = () => {
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    const newSale = {
      id: `sale-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      branchId: user?.branchId || 'branch-1',
      salesPersonId: user?.id || 'user-1',
      salesPersonName: user?.name || 'Unknown',
      totalAmount: calculateSubtotal(),
      discount: parseFloat(discount) || 0,
      tax: calculateTax(),
      finalAmount: calculateTotal(),
      paymentStatus: 'unpaid' as const,
      paymentMethod,
      saleDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      items,
      notes,
    };

    Alert.alert(
      'Sale Created',
      `Invoice ${newSale.invoiceNumber} created successfully!\nTotal: ${formatCurrency(newSale.finalAmount)}`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const renderItemRow = (item: SaleItem) => (
    <View key={item.id} style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: theme.colors.textSecondary }]}>
          {formatCurrency(item.unitPrice)} each
        </Text>
      </View>
      <View style={styles.itemControls}>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          style={[styles.quantityButton, { backgroundColor: theme.colors.error + '20' }]}
        >
          <Text style={[styles.quantityButtonText, { color: theme.colors.error }]}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: theme.colors.textPrimary }]}>
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          style={[styles.quantityButton, { backgroundColor: theme.colors.success + '20' }]}
        >
          <Text style={[styles.quantityButtonText, { color: theme.colors.success }]}>+</Text>
        </TouchableOpacity>
        <Text style={[styles.itemTotal, { color: theme.colors.textPrimary }]}>
          {formatCurrency(item.totalPrice)}
        </Text>
        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)}
          style={[styles.removeButton, { backgroundColor: theme.colors.error + '20' }]}
        >
          <Text style={[styles.removeButtonText, { color: theme.colors.error }]}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            New Sale
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Customer Selection */}
        <Card style={styles.customerCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customer
          </Text>
          <TouchableOpacity
            onPress={handleSelectCustomer}
            style={[styles.customerButton, { backgroundColor: theme.colors.surfaceVariant }]}
          >
            <Text style={[styles.customerButtonText, { color: theme.colors.textPrimary }]}>
              {selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.customerType})` : 'Select Customer'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Items */}
        <Card style={styles.itemsCard} padding="lg">
          <View style={styles.itemsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Items ({items.length})
            </Text>
            <Button
              title="Add Item"
              onPress={handleAddItem}
              variant="outline"
              size="sm"
            />
          </View>
          {items.length === 0 ? (
            <View style={styles.emptyItems}>
              <Text style={[styles.emptyItemsText, { color: theme.colors.textSecondary }]}>
                No items added yet. Tap "Add Item" to get started.
              </Text>
            </View>
          ) : (
            items.map(renderItemRow)
          )}
        </Card>

        {/* Pricing */}
        <Card style={styles.pricingCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Pricing
          </Text>
          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.textSecondary }]}>
              Subtotal:
            </Text>
            <Text style={[styles.pricingValue, { color: theme.colors.textPrimary }]}>
              {formatCurrency(calculateSubtotal())}
            </Text>
          </View>
          <View style={styles.inputRow}>
            <InputField
              label="Discount (PKR)"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="numeric"
              containerStyle={styles.inputField}
            />
            <InputField
              label="Tax (%)"
              value={tax}
              onChangeText={setTax}
              keyboardType="numeric"
              containerStyle={styles.inputField}
            />
          </View>
          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.textSecondary }]}>
              Tax Amount:
            </Text>
            <Text style={[styles.pricingValue, { color: theme.colors.textPrimary }]}>
              {formatCurrency(calculateTax())}
            </Text>
          </View>
          <View style={[styles.pricingRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: theme.colors.textPrimary }]}>
              Total:
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              {formatCurrency(calculateTotal())}
            </Text>
          </View>
        </Card>

        {/* Payment Method */}
        <Card style={styles.paymentCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Payment Method
          </Text>
          <View style={styles.paymentMethods}>
            {['cash', 'card', 'bank_transfer', 'cheque'].map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method as any)}
                style={[
                  styles.paymentMethodButton,
                  {
                    backgroundColor: paymentMethod === method ? theme.colors.primary : theme.colors.surfaceVariant,
                    borderColor: paymentMethod === method ? theme.colors.primary : theme.colors.border,
                  }
                ]}
              >
                <Text style={[
                  styles.paymentMethodText,
                  { color: paymentMethod === method ? theme.colors.white : theme.colors.textPrimary }
                ]}>
                  {method.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Notes */}
        <Card style={styles.notesCard} padding="lg">
          <InputField
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            multiline
            numberOfLines={3}
            containerStyle={styles.notesInput}
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Create Sale"
            onPress={handleCreateSale}
            variant="primary"
            style={styles.createButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
          />
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
  placeholder: {
    width: 60,
  },
  customerCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  customerButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  customerButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  itemsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyItems: {
    padding: 40,
    alignItems: 'center',
  },
  emptyItemsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
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
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    minWidth: 80,
    textAlign: 'right',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  pricingCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  pricingValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputField: {
    flex: 1,
    marginBottom: 0,
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  paymentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentMethodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  paymentMethodText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  notesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  notesInput: {
    marginBottom: 0,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  createButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
  bottomSpacing: {
    height: 20,
  },
});

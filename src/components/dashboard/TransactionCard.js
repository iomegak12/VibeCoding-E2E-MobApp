import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatRelativeTime } from '../../utils/formatters';
import { TRANSACTION_TYPE_COLORS } from '../../constants/enums';

const TransactionCard = ({ transaction, onPress }) => {
  const theme = useTheme();
  
  const getTransactionIcon = (type) => {
    const icons = {
      STOCK_IN: 'arrow-down-bold',
      STOCK_OUT: 'arrow-up-bold',
      TRANSFER: 'swap-horizontal',
      ADJUSTMENT: 'tune',
    };
    return icons[type] || 'swap-horizontal';
  };

  const getTransactionLabel = (type) => {
    const labels = {
      STOCK_IN: 'Stock In',
      STOCK_OUT: 'Stock Out',
      TRANSFER: 'Transfer',
      ADJUSTMENT: 'Adjustment',
    };
    return labels[type] || type;
  };

  const color = TRANSACTION_TYPE_COLORS[transaction.transaction_type] || theme.colors.primary;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
              <MaterialCommunityIcons 
                name={getTransactionIcon(transaction.transaction_type)} 
                size={20} 
                color={color} 
              />
            </View>
            <View style={styles.titleContainer}>
              <Text variant="titleSmall" style={styles.productName} numberOfLines={1}>
                {transaction.product_name || 'Product'}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {getTransactionLabel(transaction.transaction_type)}
              </Text>
            </View>
          </View>
          
          <Text 
            variant="titleMedium" 
            style={[styles.quantity, { color }]}
          >
            {transaction.transaction_type === 'STOCK_OUT' ? '-' : '+'}
            {transaction.quantity}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.warehouseInfo}>
            <MaterialCommunityIcons 
              name="warehouse" 
              size={14} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {transaction.warehouse_name || 'Warehouse'}
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {formatRelativeTime(transaction.created_at)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  productName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  quantity: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warehouseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default TransactionCard;

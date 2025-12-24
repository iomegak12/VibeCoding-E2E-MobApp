import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LowStockCard = ({ item, onPress }) => {
  const theme = useTheme();

  const getStockStatus = () => {
    const percentage = (item.quantity / item.minimum_stock) * 100;
    if (percentage <= 50) return { label: 'Critical', color: theme.colors.error };
    if (percentage <= 100) return { label: 'Low', color: '#f59e0b' };
    return { label: 'OK', color: theme.colors.success };
  };

  const status = getStockStatus();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons 
              name="alert-circle" 
              size={20} 
              color={status.color} 
              style={styles.alertIcon}
            />
            <Text variant="titleMedium" style={styles.productName} numberOfLines={1}>
              {item.product_name}
            </Text>
          </View>
          <Chip 
            mode="flat" 
            textStyle={{ fontSize: 11, color: status.color }}
            style={[styles.statusChip, { backgroundColor: `${status.color}15` }]}
          >
            {status.label}
          </Chip>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="warehouse" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text variant="bodyMedium" style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
              {item.warehouse_name}
            </Text>
          </View>
          
          <View style={styles.stockInfo}>
            <Text variant="bodyLarge" style={[styles.quantity, { color: status.color }]}>
              {item.quantity} units
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Min: {item.minimum_stock}
            </Text>
          </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    marginRight: 8,
  },
  productName: {
    flex: 1,
    fontWeight: '600',
  },
  statusChip: {
    height: 24,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  quantity: {
    fontWeight: 'bold',
  },
});

export default LowStockCard;

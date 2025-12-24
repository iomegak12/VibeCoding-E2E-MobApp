import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product, onPress }) => {
  const theme = useTheme();

  // Calculate total stock across warehouses (if available)
  const totalStock = product.total_quantity || 0;
  const warehouseCount = product.warehouse_count || 0;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
            <MaterialCommunityIcons 
              name="package-variant" 
              size={32} 
              color={theme.colors.primary} 
            />
          </View>
          
          <View style={styles.headerContent}>
            <Text variant="titleMedium" style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={styles.metaRow}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {product.sku}
              </Text>
              {product.category && (
                <>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {' • '}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {product.category}
                  </Text>
                </>
              )}
            </View>
          </View>

          {product.status === 'inactive' && (
            <Chip 
              mode="flat" 
              textStyle={{ fontSize: 10 }}
              style={[styles.statusChip, { backgroundColor: `${theme.colors.error}15` }]}
            >
              <Text style={{ color: theme.colors.error, fontSize: 10 }}>Inactive</Text>
            </Chip>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
            {formatCurrency(product.price || 0)}
          </Text>
          {product.cost && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Cost: {formatCurrency(product.cost)}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.stockInfo}>
            <MaterialCommunityIcons 
              name="warehouse" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {totalStock > 0 
                ? `${totalStock} units across ${warehouseCount} warehouse${warehouseCount !== 1 ? 's' : ''}`
                : 'No stock available'
              }
            </Text>
          </View>
          
          {product.minimum_stock_level > 0 && (
            <View style={styles.minStock}>
              <MaterialCommunityIcons 
                name="alert-circle-outline" 
                size={14} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Min: {product.minimum_stock_level}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  productName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    height: 24,
    marginLeft: 8,
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  minStock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default ProductCard;

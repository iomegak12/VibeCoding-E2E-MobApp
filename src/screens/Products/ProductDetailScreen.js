import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  useGetProductQuery, 
  useGetInventoryQuery,
  useUpdateProductMutation 
} from '../../store/api/inventoryApi';
import { formatCurrency } from '../../utils/formatters';

const ProductDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const { data: product, isLoading, isError, error, refetch } = useGetProductQuery(productId);
  const { data: inventoryItems } = useGetInventoryQuery({ product_id: productId });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleEdit = () => {
    navigation.navigate('ProductForm', { mode: 'edit', productId });
  };

  const handleToggleStatus = async () => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'archive';

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Product`,
      `Are you sure you want to ${action} "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await updateProduct({ 
                id: productId, 
                status: newStatus 
              }).unwrap();
            } catch (err) {
              Alert.alert('Error', `Failed to ${action} product`);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading product details..." />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <ErrorMessage
          message={error?.data?.detail || 'Failed to load product'}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  const totalStock = inventoryItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const warehouseCount = inventoryItems?.length || 0;
  const isLowStock = totalStock <= product.minimum_stock_level;

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        {/* Header Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="package-variant"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.headerActions}>
                <IconButton
                  icon="pencil"
                  mode="contained-tonal"
                  onPress={handleEdit}
                  disabled={isUpdating}
                />
                <IconButton
                  icon={product.status === 'active' ? 'archive' : 'archive-arrow-up'}
                  mode="contained-tonal"
                  iconColor={product.status === 'active' ? theme.colors.error : theme.colors.tertiary}
                  onPress={handleToggleStatus}
                  disabled={isUpdating}
                />
              </View>
            </View>

            <Text variant="headlineSmall" style={styles.productName}>
              {product.name}
            </Text>

            <View style={styles.chips}>
              <Chip icon="barcode" style={styles.chip}>{product.sku}</Chip>
              <Chip icon="tag" style={styles.chip}>{product.category}</Chip>
              {product.status === 'inactive' && (
                <Chip 
                  icon="archive" 
                  style={[styles.chip, { backgroundColor: theme.colors.errorContainer }]}
                  textStyle={{ color: theme.colors.onErrorContainer }}
                >
                  Inactive
                </Chip>
              )}
            </View>

            {product.description && (
              <>
                <Divider style={styles.divider} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {product.description}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Pricing Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingRow}>
              <View style={styles.pricingItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Unit Price
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
                  {formatCurrency(product.price)}
                </Text>
              </View>
              <View style={styles.pricingItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Unit Cost
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.tertiary }}>
                  {formatCurrency(product.cost)}
                </Text>
              </View>
            </View>
            <View style={styles.marginRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Margin:
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
                {formatCurrency(product.price - product.cost)} (
                {((product.price - product.cost) / product.price * 100).toFixed(1)}%)
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Stock Information Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Stock Information</Text>
            <View style={styles.stockRow}>
              <MaterialCommunityIcons
                name="cube-outline"
                size={24}
                color={isLowStock ? theme.colors.error : theme.colors.primary}
              />
              <View style={styles.stockInfo}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Total Stock
                </Text>
                <Text variant="headlineSmall" style={{ color: isLowStock ? theme.colors.error : theme.colors.primary }}>
                  {totalStock} units
                </Text>
              </View>
            </View>

            <View style={[styles.stockRow, { marginTop: 12 }]}>
              <MaterialCommunityIcons
                name="warehouse"
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.stockInfo}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Across Warehouses
                </Text>
                <Text variant="titleLarge">
                  {warehouseCount} {warehouseCount === 1 ? 'warehouse' : 'warehouses'}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.minStockRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Minimum Stock Level:
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {product.minimum_stock_level} units
              </Text>
            </View>

            {isLowStock && (
              <View style={[styles.warningBox, { backgroundColor: theme.colors.errorContainer }]}>
                <MaterialCommunityIcons
                  name="alert"
                  size={20}
                  color={theme.colors.onErrorContainer}
                />
                <Text 
                  variant="bodyMedium" 
                  style={[styles.warningText, { color: theme.colors.onErrorContainer }]}
                >
                  Low stock! Current stock is below minimum level.
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Warehouse Distribution Card */}
        {inventoryItems && inventoryItems.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Warehouse Distribution
              </Text>
              {inventoryItems.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <Divider style={styles.itemDivider} />}
                  <View style={styles.warehouseItem}>
                    <View style={styles.warehouseInfo}>
                      <MaterialCommunityIcons
                        name="warehouse"
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text variant="bodyLarge" style={{ marginLeft: 8 }}>
                        Warehouse #{item.warehouse_id}
                      </Text>
                    </View>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {item.quantity} units
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  productName: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  pricingItem: {
    alignItems: 'center',
  },
  marginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInfo: {
    marginLeft: 12,
  },
  minStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    marginLeft: 8,
    flex: 1,
  },
  warehouseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  warehouseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDivider: {
    marginVertical: 8,
  },
});

export default ProductDetailScreen;

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme, Text, Card, Chip, Searchbar, Menu, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { useGetInventoryQuery } from '../../store/api/inventoryApi';
import { formatCompactNumber } from '../../utils/formatters';

const InventoryScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const { data: inventory, isLoading, isError, error, refetch, isFetching } = useGetInventoryQuery({
    skip: 0,
    limit: 100,
    include_inactive: false,
  });

  const filteredInventory = inventory?.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product_sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.warehouse_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLowStock = !lowStockOnly || (item.quantity <= item.minimum_stock_level);

    return matchesSearch && matchesLowStock;
  }) || [];

  const renderInventoryItem = ({ item }) => {
    const isLowStock = item.quantity <= item.minimum_stock_level;
    const stockPercent = item.maximum_stock_level > 0 
      ? (item.quantity / item.maximum_stock_level * 100) 
      : 0;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.itemHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {item.product_name || `Product #${item.product_id}`}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.product_sku || 'No SKU'}
              </Text>
            </View>
            {isLowStock && (
              <Chip
                icon="alert"
                style={{ backgroundColor: theme.colors.errorContainer }}
                textStyle={{ color: theme.colors.onErrorContainer, fontSize: 10 }}
              >
                Low Stock
              </Chip>
            )}
          </View>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="warehouse"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMedium" style={{ marginLeft: 6, color: theme.colors.onSurfaceVariant }}>
              {item.warehouse_name || `Warehouse #${item.warehouse_id}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Current Stock
              </Text>
              <Text
                variant="headlineSmall"
                style={{
                  fontWeight: 'bold',
                  color: isLowStock ? theme.colors.error : theme.colors.primary,
                }}
              >
                {formatCompactNumber(item.quantity)}
              </Text>
            </View>

            <View style={styles.stat}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Min Level
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {formatCompactNumber(item.minimum_stock_level)}
              </Text>
            </View>

            {item.maximum_stock_level > 0 && (
              <View style={styles.stat}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Max Level
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {formatCompactNumber(item.maximum_stock_level)}
                </Text>
              </View>
            )}
          </View>

          {item.maximum_stock_level > 0 && (
            <View>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(stockPercent, 100)}%`,
                      backgroundColor: isLowStock ? theme.colors.error : theme.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading inventory..." />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <ErrorMessage
          message={error?.data?.detail || 'Failed to load inventory'}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search inventory..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
            elevation={0}
          />
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter-variant"
                mode="contained-tonal"
                onPress={() => setFilterMenuVisible(true)}
                style={{ marginLeft: 8 }}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setLowStockOnly(!lowStockOnly);
                setFilterMenuVisible(false);
              }}
              title="Low Stock Only"
              leadingIcon={lowStockOnly ? 'check' : 'checkbox-blank-outline'}
            />
          </Menu>
        </View>

        {filteredInventory.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {filteredInventory.length} {filteredInventory.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        )}

        <FlatList
          data={filteredInventory}
          renderItem={renderInventoryItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <EmptyState
              icon="clipboard-list"
              message={searchQuery || lowStockOnly ? 'No inventory items match your filters' : 'No inventory items yet'}
              description={searchQuery || lowStockOnly ? 'Try adjusting your filters' : 'Start adding products to warehouses'}
            />
          }
          contentContainerStyle={
            filteredInventory.length === 0 ? styles.emptyContainer : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    borderRadius: 12,
    elevation: 0,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});

export default InventoryScreen;

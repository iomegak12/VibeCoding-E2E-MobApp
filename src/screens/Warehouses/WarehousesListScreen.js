import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme, Text, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import WarehouseCard from '../../components/warehouses/WarehouseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { useGetWarehousesQuery } from '../../store/api/inventoryApi';

const WarehousesListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch warehouses from API
  const { data: warehouses, isLoading, isError, error, refetch, isFetching } = useGetWarehousesQuery({
    skip: 0,
    limit: 100,
    include_inactive: true,
  });

  // Filter warehouses based on search
  const filteredWarehouses = warehouses?.filter((warehouse) => {
    if (searchQuery === '') return true;
    return (
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const handleWarehousePress = (warehouse) => {
    navigation.navigate('WarehouseDetail', { warehouseId: warehouse.id });
  };

  const renderWarehouseCard = ({ item }) => (
    <WarehouseCard 
      warehouse={item} 
      onPress={() => handleWarehousePress(item)} 
    />
  );

  const renderListHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search warehouses..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={0}
        />
      </View>
      {filteredWarehouses.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {filteredWarehouses.length} {filteredWarehouses.length === 1 ? 'warehouse' : 'warehouses'}
          </Text>
        </View>
      )}
    </>
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading warehouses..." />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <ErrorMessage
          message={error?.data?.detail || 'Failed to load warehouses'}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <FlatList
          data={filteredWarehouses}
          renderItem={renderWarehouseCard}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="warehouse"
              message={
                searchQuery
                  ? 'No warehouses match your search'
                  : 'No warehouses yet'
              }
              description={
                searchQuery
                  ? 'Try a different search term'
                  : 'Add your first warehouse to get started'
              }
            />
          }
          contentContainerStyle={
            filteredWarehouses.length === 0 ? styles.emptyContainer : styles.listContent
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default WarehousesListScreen;

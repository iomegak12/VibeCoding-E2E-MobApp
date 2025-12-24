import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import SearchBar from '../../components/products/SearchBar';
import FilterChips from '../../components/products/FilterChips';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { useGetProductsQuery } from '../../store/api/inventoryApi';

const ProductsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Fetch products from API
  const { data: products, isLoading, isError, error, refetch, isFetching } = useGetProductsQuery({
    skip: 0,
    limit: 100,
    include_inactive: true,
  });

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch = 
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = 
        selectedCategory === 'All' || 
        product.category === selectedCategory;

      // Status filter
      const matchesStatus = 
        selectedStatus === null || 
        (selectedStatus === true && product.status === 'active') ||
        (selectedStatus === false && product.status === 'inactive');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedStatus(null);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const renderProductCard = ({ item }) => (
    <ProductCard 
      product={item} 
      onPress={() => handleProductPress(item)} 
    />
  );

  const renderListHeader = () => (
    <>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => {}}
        placeholder="Search by name or SKU..."
      />
      <FilterChips
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onClearAll={handleClearFilters}
      />
      {filteredProducts.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </Text>
        </View>
      )}
    </>
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading products..." />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <ErrorMessage
          message={error?.data?.detail || 'Failed to load products'}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="package-variant"
              message={
                searchQuery || selectedCategory !== 'All' || selectedStatus !== null
                  ? 'No products match your filters'
                  : 'No products yet'
              }
              description={
                searchQuery || selectedCategory !== 'All' || selectedStatus !== null
                  ? 'Try adjusting your search or filters'
                  : 'Add your first product to get started'
              }
            />
          }
          contentContainerStyle={
            filteredProducts.length === 0 ? styles.emptyContainer : styles.listContent
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

export default ProductsListScreen;

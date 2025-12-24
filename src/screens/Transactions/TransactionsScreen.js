import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme, Text, Card, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { useGetTransactionsQuery } from '../../store/api/inventoryApi';
import { formatRelativeTime, formatCompactNumber } from '../../utils/formatters';
import { TRANSACTION_TYPES } from '../../constants/enums';

const TransactionsScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const { data: transactions, isLoading, isError, error, refetch, isFetching } = useGetTransactionsQuery({
    skip: 0,
    limit: 100,
  });

  const filteredTransactions = transactions?.filter((txn) => {
    const matchesSearch =
      searchQuery === '' ||
      txn.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.product_sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.warehouse_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || txn.transaction_type === filterType;

    return matchesSearch && matchesType;
  }) || [];

  const getTransactionIcon = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.IN:
        return 'arrow-down-circle';
      case TRANSACTION_TYPES.OUT:
        return 'arrow-up-circle';
      case TRANSACTION_TYPES.ADJUSTMENT:
        return 'pencil-circle';
      case TRANSACTION_TYPES.TRANSFER:
        return 'swap-horizontal-circle';
      default:
        return 'file-document';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.IN:
        return theme.colors.tertiary;
      case TRANSACTION_TYPES.OUT:
        return theme.colors.error;
      case TRANSACTION_TYPES.ADJUSTMENT:
        return theme.colors.secondary;
      case TRANSACTION_TYPES.TRANSFER:
        return theme.colors.primary;
      default:
        return theme.colors.onSurface;
    }
  };

  const renderTransaction = ({ item }) => {
    const color = getTransactionColor(item.transaction_type);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.txnHeader}>
            <MaterialCommunityIcons
              name={getTransactionIcon(item.transaction_type)}
              size={32}
              color={color}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {item.product_name || `Product #${item.product_id}`}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.product_sku || 'No SKU'}
              </Text>
            </View>
            <Chip
              mode="flat"
              textStyle={{ fontSize: 10 }}
              style={{ backgroundColor: `${color}15` }}
            >
              <Text style={{ color, fontSize: 10 }}>{item.transaction_type}</Text>
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <MaterialCommunityIcons
              name="warehouse"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMedium" style={{ marginLeft: 6, flex: 1 }}>
              {item.warehouse_name || `Warehouse #${item.warehouse_id}`}
            </Text>
            <Text
              variant="titleMedium"
              style={{ fontWeight: 'bold', color }}
            >
              {item.transaction_type === TRANSACTION_TYPES.OUT ? '-' : '+'}
              {formatCompactNumber(item.quantity)}
            </Text>
          </View>

          {item.reason && (
            <View style={styles.reasonRow}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={{ marginLeft: 6, color: theme.colors.onSurfaceVariant, flex: 1 }}
              >
                {item.reason}
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={{ marginLeft: 4, color: theme.colors.onSurfaceVariant }}>
              {formatRelativeTime(item.transaction_date || item.created_at)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading transactions..." />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <ErrorMessage
          message={error?.data?.detail || 'Failed to load transactions'}
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
            placeholder="Search transactions..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
            elevation={0}
          />
        </View>

        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={filterType}
            onValueChange={setFilterType}
            buttons={[
              { value: 'ALL', label: 'All' },
              { value: TRANSACTION_TYPES.IN, label: 'In' },
              { value: TRANSACTION_TYPES.OUT, label: 'Out' },
              { value: TRANSACTION_TYPES.ADJUSTMENT, label: 'Adjust' },
            ]}
            density="small"
          />
        </View>

        {filteredTransactions.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
            </Text>
          </View>
        )}

        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <EmptyState
              icon="swap-horizontal"
              message={searchQuery || filterType !== 'ALL' ? 'No transactions match your filters' : 'No transactions yet'}
              description={searchQuery || filterType !== 'ALL' ? 'Try adjusting your filters' : 'Transactions will appear here'}
            />
          }
          contentContainerStyle={
            filteredTransactions.length === 0 ? styles.emptyContainer : styles.listContent
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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
  txnHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});

export default TransactionsScreen;

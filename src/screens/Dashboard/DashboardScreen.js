import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Components
import SummaryCard from '../../components/dashboard/SummaryCard';
import LowStockCard from '../../components/dashboard/LowStockCard';
import TransactionCard from '../../components/dashboard/TransactionCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/layout/Header';

// API Hooks
import {
  useGetOverallSummaryQuery,
  useGetLowStockAlertsQuery,
  useGetTransactionsQuery,
} from '../../store/api/inventoryApi';

// Utils
import { formatCurrency } from '../../utils/formatters';

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const { 
    data: summary, 
    isLoading: summaryLoading, 
    error: summaryError,
    refetch: refetchSummary 
  } = useGetOverallSummaryQuery();

  const { 
    data: lowStockAlerts, 
    isLoading: alertsLoading, 
    error: alertsError,
    refetch: refetchAlerts 
  } = useGetLowStockAlertsQuery();

  const { 
    data: transactions, 
    isLoading: transactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useGetTransactionsQuery({ skip: 0, limit: 5 });

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchSummary(),
        refetchAlerts(),
        refetchTransactions(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Loading state
  if (summaryLoading && !refreshing) {
    return (
      <>
        <Header title="Dashboard" />
        <LoadingSpinner />
      </>
    );
  }

  // Error state
  if (summaryError && !summary) {
    return (
      <>
        <Header title="Dashboard" />
        <ErrorMessage error={summaryError} />
      </>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header 
        title="Dashboard" 
        actions={[
          {
            icon: 'refresh',
            onPress: onRefresh,
          }
        ]}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.section}>
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="package-variant"
              title="Products"
              value={summary?.total_products || 0}
              color="#206bc4"
            />
            <SummaryCard
              icon="warehouse"
              title="Warehouses"
              value={summary?.total_warehouses || 0}
              color="#10b981"
            />
          </View>
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="chart-line"
              title="Total Stock"
              value={summary?.total_stock_quantity || 0}
              color="#f59e0b"
              compact={true}
            />
            <SummaryCard
              icon="currency-usd"
              title="Value"
              value={summary?.total_inventory_value || 0}
              color="#8b5cf6"
              isCurrency={true}
              compact={true}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Low Stock Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={24} 
                color={theme.colors.error} 
              />
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Low Stock Alerts
              </Text>
              {lowStockAlerts && lowStockAlerts.length > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                  <Text style={styles.badgeText}>{lowStockAlerts.length}</Text>
                </View>
              )}
            </View>
            {lowStockAlerts && lowStockAlerts.length > 3 && (
              <Button 
                mode="text" 
                compact
                onPress={() => navigation.navigate('Inventory')}
              >
                View All
              </Button>
            )}
          </View>

          {alertsLoading && !lowStockAlerts ? (
            <LoadingSpinner />
          ) : alertsError ? (
            <ErrorMessage error={alertsError} />
          ) : !lowStockAlerts || lowStockAlerts.length === 0 ? (
            <EmptyState
              icon="check-circle-outline"
              title="All good!"
              message="No low stock alerts at the moment"
            />
          ) : (
            <View>
              {lowStockAlerts.slice(0, 3).map((item, index) => (
                <LowStockCard
                  key={`${item.product_id}-${item.warehouse_id}-${index}`}
                  item={item}
                  onPress={() => navigation.navigate('Inventory')}
                />
              ))}
            </View>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialCommunityIcons 
                name="swap-horizontal" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Recent Transactions
              </Text>
            </View>
            {transactions && transactions.length > 0 && (
              <Button 
                mode="text" 
                compact
                onPress={() => navigation.navigate('Transactions')}
              >
                View All
              </Button>
            )}
          </View>

          {transactionsLoading && !transactions ? (
            <LoadingSpinner />
          ) : transactionsError ? (
            <ErrorMessage error={transactionsError} />
          ) : !transactions || transactions.length === 0 ? (
            <EmptyState
              icon="inbox-outline"
              title="No transactions"
              message="No recent transactions to display"
            />
          ) : (
            <View>
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => navigation.navigate('Transactions')}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  divider: {
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, useTheme, SegmentedButtons, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  useGetLowStockReportQuery,
  useGetStockValueReportQuery,
  useGetWarehouseUtilizationReportQuery,
  useGetProductMovementReportQuery,
} from '../../store/api/inventoryApi';
import { formatCurrency, formatCompactCurrency, formatCompactNumber } from '../../utils/formatters';

const ReportsScreen = () => {
  const theme = useTheme();
  const [selectedReport, setSelectedReport] = useState('low-stock');

  // Fetch all reports
  const { data: lowStockData, isLoading: loadingLowStock, error: errorLowStock } = useGetLowStockReportQuery();
  const { data: stockValueData, isLoading: loadingStockValue, error: errorStockValue } = useGetStockValueReportQuery();
  const { data: utilizationData, isLoading: loadingUtilization, error: errorUtilization } = useGetWarehouseUtilizationReportQuery();
  const { data: movementData, isLoading: loadingMovement, error: errorMovement } = useGetProductMovementReportQuery({ days: 30 });

  const renderLowStockReport = () => {
    if (loadingLowStock) return <LoadingSpinner message="Loading report..." />;
    if (errorLowStock) return <ErrorMessage message="Failed to load report" />;

    return (
      <View>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold', color: theme.colors.error }}>
              {lowStockData?.total_items || 0}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Products Below Minimum Stock
            </Text>
          </Card.Content>
        </Card>

        {lowStockData?.items?.map((item, index) => (
          <Card key={index} style={styles.itemCard}>
            <Card.Content>
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {item.product_name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {item.product_sku}
                  </Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Current</Text>
                  <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.error }}>
                    {formatCompactNumber(item.current_stock)}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Minimum</Text>
                  <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                    {formatCompactNumber(item.minimum_stock)}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Deficit</Text>
                  <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.tertiary }}>
                    {formatCompactNumber(item.deficit)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  const renderStockValueReport = () => {
    if (loadingStockValue) return <LoadingSpinner message="Loading report..." />;
    if (errorStockValue) return <ErrorMessage message="Failed to load report" />;

    return (
      <View>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {formatCompactCurrency(stockValueData?.total_value || 0)}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Total Inventory Value
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.itemCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Cost Value</Text>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.tertiary }}>
                  {formatCompactCurrency(stockValueData?.total_cost_value || 0)}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Selling Value</Text>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {formatCompactCurrency(stockValueData?.total_selling_value || 0)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.marginRow}>
              <Text variant="titleMedium">Potential Margin</Text>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.secondary }}>
                {formatCompactCurrency(stockValueData?.potential_margin || 0)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {stockValueData?.by_category?.map((cat, index) => (
          <List.Item
            key={index}
            title={cat.category}
            description={`${formatCompactNumber(cat.quantity)} units`}
            left={props => <List.Icon {...props} icon="tag" />}
            right={() => (
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {formatCompactCurrency(cat.value)}
              </Text>
            )}
            style={styles.listItem}
          />
        ))}
      </View>
    );
  };

  const renderUtilizationReport = () => {
    if (loadingUtilization) return <LoadingSpinner message="Loading report..." />;
    if (errorUtilization) return <ErrorMessage message="Failed to load report" />;

    const avgUtilization = utilizationData?.average_utilization || 0;
    const getUtilizationColor = (percent) => {
      if (percent >= 90) return theme.colors.error;
      if (percent >= 75) return theme.colors.tertiary;
      return theme.colors.primary;
    };

    return (
      <View>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold', color: getUtilizationColor(avgUtilization) }}>
              {avgUtilization.toFixed(1)}%
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Average Warehouse Utilization
            </Text>
          </Card.Content>
        </Card>

        {utilizationData?.warehouses?.map((wh, index) => (
          <Card key={index} style={styles.itemCard}>
            <Card.Content>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                {wh.warehouse_name}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Capacity</Text>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {formatCompactNumber(wh.capacity)}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Current</Text>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {formatCompactNumber(wh.current_stock)}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Utilization</Text>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', color: getUtilizationColor(wh.utilization_percent) }}>
                    {wh.utilization_percent.toFixed(0)}%
                  </Text>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant, marginTop: 12 }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(wh.utilization_percent, 100)}%`,
                      backgroundColor: getUtilizationColor(wh.utilization_percent),
                    },
                  ]}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  const renderMovementReport = () => {
    if (loadingMovement) return <LoadingSpinner message="Loading report..." />;
    if (errorMovement) return <ErrorMessage message="Failed to load report" />;

    return (
      <View>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {formatCompactNumber(movementData?.total_transactions || 0)}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Total Transactions (Last 30 Days)
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.miniCard}>
            <Card.Content>
              <MaterialCommunityIcons name="arrow-down-circle" size={32} color={theme.colors.tertiary} />
              <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: 8 }}>
                {formatCompactNumber(movementData?.total_in || 0)}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Stock In</Text>
            </Card.Content>
          </Card>

          <Card style={styles.miniCard}>
            <Card.Content>
              <MaterialCommunityIcons name="arrow-up-circle" size={32} color={theme.colors.error} />
              <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: 8 }}>
                {formatCompactNumber(movementData?.total_out || 0)}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Stock Out</Text>
            </Card.Content>
          </Card>
        </View>

        {movementData?.top_products?.map((product, index) => (
          <List.Item
            key={index}
            title={product.product_name}
            description={`${product.product_sku} • ${formatCompactNumber(product.total_quantity)} units moved`}
            left={props => <List.Icon {...props} icon="trending-up" />}
            right={() => (
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                #{index + 1}
              </Text>
            )}
            style={styles.listItem}
          />
        ))}
      </View>
    );
  };

  const renderSelectedReport = () => {
    switch (selectedReport) {
      case 'low-stock':
        return renderLowStockReport();
      case 'stock-value':
        return renderStockValueReport();
      case 'utilization':
        return renderUtilizationReport();
      case 'movement':
        return renderMovementReport();
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={selectedReport}
            onValueChange={setSelectedReport}
            buttons={[
              { value: 'low-stock', label: 'Low Stock', icon: 'alert' },
              { value: 'stock-value', label: 'Value', icon: 'currency-inr' },
              { value: 'utilization', label: 'Usage', icon: 'chart-bar' },
              { value: 'movement', label: 'Activity', icon: 'swap-horizontal' },
            ]}
            density="small"
          />
        </View>

        <ScrollView style={styles.scrollView}>
          {renderSelectedReport()}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  itemCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  miniCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  marginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default ReportsScreen;

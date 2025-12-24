import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCompactNumber } from '../../utils/formatters';

const WarehouseCard = ({ warehouse, onPress }) => {
  const theme = useTheme();

  const capacity = warehouse.capacity || 0;
  const currentStock = warehouse.current_stock || 0;
  const utilizationPercent = capacity > 0 ? (currentStock / capacity * 100) : 0;

  const getUtilizationColor = () => {
    if (utilizationPercent >= 90) return theme.colors.error;
    if (utilizationPercent >= 75) return theme.colors.tertiary;
    return theme.colors.primary;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
            <MaterialCommunityIcons 
              name="warehouse" 
              size={32} 
              color={theme.colors.primary} 
            />
          </View>
          
          <View style={styles.headerContent}>
            <Text variant="titleMedium" style={styles.warehouseName} numberOfLines={1}>
              {warehouse.name}
            </Text>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={14} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                {warehouse.location}
              </Text>
            </View>
          </View>

          {warehouse.status === 'inactive' && (
            <Chip 
              mode="flat" 
              textStyle={{ fontSize: 10 }}
              style={[styles.statusChip, { backgroundColor: `${theme.colors.error}15` }]}
            >
              <Text style={{ color: theme.colors.error, fontSize: 10 }}>Inactive</Text>
            </Chip>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Capacity
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {formatCompactNumber(capacity)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Current Stock
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {formatCompactNumber(currentStock)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Utilization
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: getUtilizationColor() }}>
              {utilizationPercent.toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Utilization Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(utilizationPercent, 100)}%`,
                backgroundColor: getUtilizationColor() 
              }
            ]} 
          />
        </View>

        {warehouse.code && (
          <View style={styles.footer}>
            <MaterialCommunityIcons 
              name="barcode" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 6 }}>
              Code: {warehouse.code}
            </Text>
          </View>
        )}
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
  warehouseName: {
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
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WarehouseCard;

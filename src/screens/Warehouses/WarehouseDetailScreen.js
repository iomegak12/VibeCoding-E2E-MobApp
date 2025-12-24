import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Text, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  useGetWarehouseQuery, 
  useGetInventoryQuery,
  useUpdateWarehouseMutation 
} from '../../store/api/inventoryApi';
import { formatCompactNumber } from '../../utils/formatters';

const WarehouseDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { warehouseId } = route.params;

  const { data: warehouse, isLoading, isError, error, refetch } = useGetWarehouseQuery(warehouseId);
  const { data: inventoryItems } = useGetInventoryQuery({ warehouse_id: warehouseId });
  const [updateWarehouse, { isLoading: isUpdating }] = useUpdateWarehouseMutation();

  const handleEdit = () => {
    navigation.navigate('WarehouseForm', { mode: 'edit', warehouseId });
  };

  const handleToggleStatus = async () => {
    const newStatus = warehouse.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'archive';

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Warehouse`,
      `Are you sure you want to ${action} "${warehouse.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: newStatus === 'active' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await updateWarehouse({ 
                id: warehouseId, 
                status: newStatus 
              }).unwrap();
            } catch (err) {
              Alert.alert('Error', `Failed to ${action} warehouse`);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading warehouse details..." />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <ErrorMessage
          message={error?.data?.detail || 'Failed to load warehouse'}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  const currentStock = warehouse.current_stock || 0;
  const utilizationPercent = warehouse.capacity > 0 ? (currentStock / warehouse.capacity * 100) : 0;
  const productCount = inventoryItems?.length || 0;

  const getUtilizationColor = () => {
    if (utilizationPercent >= 90) return theme.colors.error;
    if (utilizationPercent >= 75) return theme.colors.tertiary;
    return theme.colors.primary;
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        {/* Header Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="warehouse"
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
                  icon={warehouse.status === 'active' ? 'archive' : 'archive-arrow-up'}
                  mode="contained-tonal"
                  iconColor={warehouse.status === 'active' ? theme.colors.error : theme.colors.tertiary}
                  onPress={handleToggleStatus}
                  disabled={isUpdating}
                />
              </View>
            </View>

            <Text variant="headlineSmall" style={styles.warehouseName}>
              {warehouse.name}
            </Text>

            <View style={styles.chips}>
              {warehouse.code && (
                <Chip icon="barcode" style={styles.chip}>{warehouse.code}</Chip>
              )}
              <Chip icon="map-marker" style={styles.chip}>{warehouse.location}</Chip>
              {warehouse.status === 'inactive' && (
                <Chip 
                  icon="archive" 
                  style={[styles.chip, { backgroundColor: theme.colors.errorContainer }]}
                  textStyle={{ color: theme.colors.onErrorContainer }}
                >
                  Inactive
                </Chip>
              )}
            </View>

            {warehouse.address && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.addressRow}>
                  <MaterialCommunityIcons 
                    name="map-marker-outline" 
                    size={20} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text variant="bodyMedium" style={[styles.addressText, { color: theme.colors.onSurfaceVariant }]}>
                    {warehouse.address}
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Capacity Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Capacity & Utilization</Text>
            
            <View style={styles.capacityRow}>
              <View style={styles.capacityStat}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Total Capacity
                </Text>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  {formatCompactNumber(warehouse.capacity)}
                </Text>
              </View>
              
              <View style={styles.capacityStat}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Current Stock
                </Text>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
                  {formatCompactNumber(currentStock)}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.utilizationRow}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Utilization:
              </Text>
              <Text variant="titleLarge" style={{ color: getUtilizationColor(), fontWeight: 'bold' }}>
                {utilizationPercent.toFixed(1)}%
              </Text>
            </View>

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

            {utilizationPercent >= 90 && (
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
                  Warehouse is near capacity!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Products Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Products Stored</Text>
            
            <View style={styles.productSummary}>
              <MaterialCommunityIcons
                name="package-variant"
                size={32}
                color={theme.colors.primary}
              />
              <View style={{ marginLeft: 12 }}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
                  {productCount}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {productCount === 1 ? 'Product Type' : 'Product Types'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Contact Information */}
        {(warehouse.contact_person || warehouse.contact_email || warehouse.contact_phone) && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
              
              {warehouse.contact_person && (
                <View style={styles.contactRow}>
                  <MaterialCommunityIcons 
                    name="account" 
                    size={20} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text variant="bodyLarge" style={{ marginLeft: 12 }}>
                    {warehouse.contact_person}
                  </Text>
                </View>
              )}
              
              {warehouse.contact_email && (
                <View style={styles.contactRow}>
                  <MaterialCommunityIcons 
                    name="email" 
                    size={20} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text variant="bodyLarge" style={{ marginLeft: 12 }}>
                    {warehouse.contact_email}
                  </Text>
                </View>
              )}
              
              {warehouse.contact_phone && (
                <View style={styles.contactRow}>
                  <MaterialCommunityIcons 
                    name="phone" 
                    size={20} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text variant="bodyLarge" style={{ marginLeft: 12 }}>
                    {warehouse.contact_phone}
                  </Text>
                </View>
              )}
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
  warehouseName: {
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
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    marginLeft: 8,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  capacityStat: {
    alignItems: 'center',
  },
  utilizationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    marginLeft: 8,
    flex: 1,
  },
  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default WarehouseDetailScreen;

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { PRODUCT_CATEGORIES } from '../../constants/enums';

const FilterChips = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedStatus,
  onStatusChange,
  onClearAll,
  style 
}) => {
  const theme = useTheme();

  const categories = ['All', ...Object.values(PRODUCT_CATEGORIES)];
  const statuses = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  const hasActiveFilters = selectedCategory !== 'All' || selectedStatus !== null;

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Filters */}
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => onCategoryChange(category)}
            style={styles.chip}
            mode={selectedCategory === category ? 'flat' : 'outlined'}
            showSelectedOverlay={true}
          >
            {category}
          </Chip>
        ))}

        {/* Status Filters */}
        {statuses.map((status) => (
          <Chip
            key={status.label}
            selected={selectedStatus === status.value}
            onPress={() => onStatusChange(selectedStatus === status.value ? null : status.value)}
            style={styles.chip}
            mode={selectedStatus === status.value ? 'flat' : 'outlined'}
            showSelectedOverlay={true}
          >
            {status.label}
          </Chip>
        ))}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Chip
            key="clear"
            onPress={onClearAll}
            style={[styles.chip, { backgroundColor: theme.colors.errorContainer }]}
            textStyle={{ color: theme.colors.onErrorContainer }}
            mode="flat"
          >
            Clear All
          </Chip>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
});

export default FilterChips;

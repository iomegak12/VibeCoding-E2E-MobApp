import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatNumber, formatCompactNumber, formatCompactCurrency } from '../../utils/formatters';

const SummaryCard = ({ icon, title, value, color, onPress, isCurrency = false, compact = true }) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.primary;

  // Format the value based on type
  const getFormattedValue = () => {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      if (isCurrency) {
        return compact ? formatCompactCurrency(value) : `₹${formatNumber(value)}`;
      }
      return compact ? formatCompactNumber(value) : formatNumber(value);
    }
    return value;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
        </View>
        <Text variant="headlineMedium" style={[styles.value, { color: theme.colors.onSurface }]}>
          {getFormattedValue()}
        </Text>
        <Text variant="bodyMedium" style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    margin: 6,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
  },
});

export default SummaryCard;

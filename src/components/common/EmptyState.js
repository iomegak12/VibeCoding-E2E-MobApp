import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmptyState = ({ 
  icon = 'inbox-outline', 
  title = 'No data found', 
  message = 'There are no items to display',
  style 
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons 
        name={icon} 
        size={64} 
        color={theme.colors.onSurfaceDisabled} 
        style={styles.icon}
      />
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

export default EmptyState;

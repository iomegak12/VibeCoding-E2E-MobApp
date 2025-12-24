import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ErrorMessage = ({ 
  error, 
  icon = 'alert-circle-outline',
  onRetry,
  style 
}) => {
  const theme = useTheme();

  // Extract error message
  const getErrorMessage = () => {
    if (typeof error === 'string') {
      return error;
    }
    if (error?.data?.detail) {
      return typeof error.data.detail === 'string' 
        ? error.data.detail 
        : 'An error occurred';
    }
    if (error?.message) {
      return error.message;
    }
    return 'Something went wrong. Please try again.';
  };

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons 
        name={icon} 
        size={48} 
        color={theme.colors.error} 
        style={styles.icon}
      />
      <Text 
        variant="titleMedium" 
        style={[styles.title, { color: theme.colors.error }]}
      >
        Error
      </Text>
      <Text 
        variant="bodyMedium" 
        style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
      >
        {getErrorMessage()}
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
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

export default ErrorMessage;

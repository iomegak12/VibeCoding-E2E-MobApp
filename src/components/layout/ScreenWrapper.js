import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';

const ScreenWrapper = ({ 
  children, 
  scrollable = true, 
  withPadding = false,
  refreshing = false,
  onRefresh,
  style,
}) => {
  const theme = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        withPadding && styles.withPadding,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  withPadding: {
    padding: 16,
  },
});

export default ScreenWrapper;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

const SearchBar = ({ value, onChangeText, onSubmitEditing, placeholder = 'Search products...', style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        value={value}
        style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
        inputStyle={styles.input}
        iconColor={theme.colors.onSurfaceVariant}
        elevation={0}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 0,
  },
  input: {
    fontSize: 15,
  },
});

export default SearchBar;

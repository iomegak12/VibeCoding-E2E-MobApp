import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Header = ({ 
  title, 
  subtitle,
  showBack = false,
  actions = [],
  style,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Appbar.Header 
      style={[
        styles.header,
        { backgroundColor: theme.colors.surface },
        style,
      ]}
      elevated
    >
      {showBack && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}
      <Appbar.Content title={title} subtitle={subtitle} />
      {actions.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          disabled={action.disabled}
        />
      ))}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 2,
  },
});

export default Header;

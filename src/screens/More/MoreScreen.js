import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Header from '../../components/layout/Header';

const MoreScreen = ({ navigation }) => {
  const theme = useTheme();

  const menuItems = [
    {
      icon: 'warehouse',
      title: 'Warehouses',
      description: 'Manage warehouse locations',
      route: 'Warehouses',
    },
    {
      icon: 'format-list-bulleted',
      title: 'Inventory',
      description: 'Track stock levels',
      route: 'Inventory',
    },
    {
      icon: 'swap-horizontal',
      title: 'Transactions',
      description: 'View stock movements',
      route: 'Transactions',
    },
    {
      icon: 'chart-bar',
      title: 'Reports',
      description: 'Analytics and insights',
      route: 'Reports',
    },
  ];

  return (
    <>
      <Header title="More" />
      <ScreenWrapper scrollable={false}>
        <View style={styles.container}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.route}>
              <List.Item
                title={item.title}
                description={item.description}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate(item.route)}
                style={styles.listItem}
              />
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </View>
      </ScreenWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    paddingVertical: 8,
  },
});

export default MoreScreen;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tab Navigator
import TabNavigator from './TabNavigator';

// Additional Screens (from More menu)
import WarehousesListScreen from '../screens/Warehouses/WarehousesListScreen';
import InventoryScreen from '../screens/Inventory/InventoryScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';

// Products Stack Screens
import ProductDetailScreen from '../screens/Products/ProductDetailScreen';
import ProductFormScreen from '../screens/Products/ProductFormScreen';

// Warehouses Stack Screens
import WarehouseDetailScreen from '../screens/Warehouses/WarehouseDetailScreen';
import WarehouseFormScreen from '../screens/Warehouses/WarehouseFormScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main Tab Navigator */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        {/* Products Stack Screens */}
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{ headerShown: true, title: 'Product Details' }}
        />
        <Stack.Screen 
          name="ProductForm" 
          component={ProductFormScreen}
          options={({ route }) => ({ 
            headerShown: true, 
            title: route.params?.mode === 'edit' ? 'Edit Product' : 'Add Product' 
          })}
        />
        
        {/* Warehouses Stack */}
        <Stack.Screen 
          name="Warehouses" 
          component={WarehousesListScreen}
          options={{ headerShown: true, title: 'Warehouses' }}
        />
        <Stack.Screen 
          name="WarehouseDetail" 
          component={WarehouseDetailScreen}
          options={{ headerShown: true, title: 'Warehouse Details' }}
        />
        <Stack.Screen 
          name="WarehouseForm" 
          component={WarehouseFormScreen}
          options={({ route }) => ({ 
            headerShown: true, 
            title: route.params?.mode === 'edit' ? 'Edit Warehouse' : 'Add Warehouse' 
          })}
        />
        
        {/* Inventory Stack */}
        <Stack.Screen 
          name="Inventory" 
          component={InventoryScreen}
          options={{ headerShown: true, title: 'Inventory' }}
        />
        
        {/* Transactions Stack */}
        <Stack.Screen 
          name="Transactions" 
          component={TransactionsScreen}
          options={{ headerShown: true, title: 'Transactions' }}
        />
        
        {/* Reports Stack */}
        <Stack.Screen 
          name="Reports" 
          component={ReportsScreen}
          options={{ headerShown: true, title: 'Reports' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

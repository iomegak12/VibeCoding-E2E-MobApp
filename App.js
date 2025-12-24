import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Store
import store from './src/store';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Theme
import { lightTheme, darkTheme } from './src/theme';

export default function App() {
  // Detect system color scheme
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Update theme when system color scheme changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}

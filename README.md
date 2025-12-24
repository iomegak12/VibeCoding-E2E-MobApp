# TrueStock Mobile App

Inventory Management System mobile application built with React Native and Expo.

## Tech Stack

- **React Native** with **Expo**
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Redux Toolkit** with **RTK Query** for state management
- **Axios** for API calls

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

4. Run on iOS:
   ```bash
   npm run ios
   ```

## Backend

Ensure the FastAPI backend is running at `http://localhost:8000/api/v1`

For Android emulator, the API client is configured to use `http://10.0.2.2:8000/api/v1`

## Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── store/          # Redux store and RTK Query API
├── services/       # API client and services
├── utils/          # Utility functions
├── constants/      # Constants and enums
└── theme/          # Theme configuration
```

## Features

- **Dashboard** - Analytics and summary
- **Products** - Product management
- **Warehouses** - Warehouse management
- **Inventory** - Stock tracking
- **Transactions** - Stock movements
- **Reports** - Analytics and reports

## Development Status

**Phase 0: Complete** ✅
- Project setup
- Dependencies installed
- Folder structure created
- API client configured
- Redux store setup
- Theme configuration
- Navigation setup

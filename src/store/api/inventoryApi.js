import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../constants/config';

// Create RTK Query API service
export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      // Add authentication token when JWT is implemented
      // const token = getState().auth.token;
      // if (token) {
      //   headers.set('Authorization', `Bearer ${token}`);
      // }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Products', 'Warehouses', 'Inventory', 'Transactions', 'Reports'],
  endpoints: (builder) => ({
    // Products endpoints
    getProducts: builder.query({
      query: ({ skip = 0, limit = 20, category, include_inactive = false }) => ({
        url: '/products/',
        params: { skip, limit, category, include_inactive },
      }),
      providesTags: ['Products'],
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    getProductBySku: builder.query({
      query: (sku) => `/products/sku/${sku}`,
      providesTags: (result, error, sku) => [{ type: 'Products', id: sku }],
    }),

    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products/',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }, 'Products'],
    }),

    archiveProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Products'],
    }),

    activateProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Products'],
    }),

    // Warehouses endpoints
    getWarehouses: builder.query({
      query: ({ skip = 0, limit = 20, location, include_inactive = false }) => ({
        url: '/warehouses/',
        params: { skip, limit, location, include_inactive },
      }),
      providesTags: ['Warehouses'],
    }),

    getWarehouse: builder.query({
      query: (id) => `/warehouses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Warehouses', id }],
    }),

    getWarehouseByCode: builder.query({
      query: (code) => `/warehouses/code/${code}`,
      providesTags: (result, error, code) => [{ type: 'Warehouses', id: code }],
    }),

    createWarehouse: builder.mutation({
      query: (warehouse) => ({
        url: '/warehouses/',
        method: 'POST',
        body: warehouse,
      }),
      invalidatesTags: ['Warehouses'],
    }),

    updateWarehouse: builder.mutation({
      query: ({ id, ...warehouse }) => ({
        url: `/warehouses/${id}`,
        method: 'PUT',
        body: warehouse,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Warehouses', id }, 'Warehouses'],
    }),

    archiveWarehouse: builder.mutation({
      query: (id) => ({
        url: `/warehouses/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Warehouses'],
    }),

    activateWarehouse: builder.mutation({
      query: (id) => ({
        url: `/warehouses/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Warehouses'],
    }),

    // Inventory endpoints
    getInventory: builder.query({
      query: ({ skip = 0, limit = 20, product_id, warehouse_id, include_inactive = false }) => ({
        url: '/inventory/',
        params: { skip, limit, product_id, warehouse_id, include_inactive },
      }),
      providesTags: ['Inventory'],
    }),

    getInventoryById: builder.query({
      query: (id) => `/inventory/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),

    getInventoryByProductWarehouse: builder.query({
      query: ({ product_id, warehouse_id }) => 
        `/inventory/product/${product_id}/warehouse/${warehouse_id}`,
      providesTags: (result, error, { product_id, warehouse_id }) => [
        { type: 'Inventory', id: `${product_id}-${warehouse_id}` },
      ],
    }),

    getLowStockItems: builder.query({
      query: ({ skip = 0, limit = 20 }) => ({
        url: '/inventory/low-stock',
        params: { skip, limit },
      }),
      providesTags: ['Inventory'],
    }),

    createInventory: builder.mutation({
      query: (inventory) => ({
        url: '/inventory/',
        method: 'POST',
        body: inventory,
      }),
      invalidatesTags: ['Inventory', 'Reports'],
    }),

    updateInventory: builder.mutation({
      query: ({ id, ...inventory }) => ({
        url: `/inventory/${id}`,
        method: 'PUT',
        body: inventory,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inventory', id },
        'Inventory',
        'Reports',
      ],
    }),

    adjustInventory: builder.mutation({
      query: ({ id, adjustment }) => ({
        url: `/inventory/${id}/adjust`,
        method: 'PATCH',
        body: { adjustment },
      }),
      invalidatesTags: ['Inventory', 'Reports'],
    }),

    archiveInventory: builder.mutation({
      query: (id) => ({
        url: `/inventory/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Inventory'],
    }),

    activateInventory: builder.mutation({
      query: (id) => ({
        url: `/inventory/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Transactions endpoints
    getTransactions: builder.query({
      query: ({ 
        skip = 0, 
        limit = 20, 
        transaction_type, 
        product_id, 
        warehouse_id,
        start_date,
        end_date,
      }) => ({
        url: '/transactions/',
        params: { skip, limit, transaction_type, product_id, warehouse_id, start_date, end_date },
      }),
      providesTags: ['Transactions'],
    }),

    getTransaction: builder.query({
      query: (id) => `/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transactions', id }],
    }),

    getTransactionsByProduct: builder.query({
      query: ({ product_id, skip = 0, limit = 20 }) => ({
        url: `/transactions/product/${product_id}`,
        params: { skip, limit },
      }),
      providesTags: ['Transactions'],
    }),

    getTransactionsByWarehouse: builder.query({
      query: ({ warehouse_id, skip = 0, limit = 20 }) => ({
        url: `/transactions/warehouse/${warehouse_id}`,
        params: { skip, limit },
      }),
      providesTags: ['Transactions'],
    }),

    stockIn: builder.mutation({
      query: (data) => ({
        url: '/transactions/stock-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transactions', 'Inventory', 'Reports'],
    }),

    stockOut: builder.mutation({
      query: (data) => ({
        url: '/transactions/stock-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transactions', 'Inventory', 'Reports'],
    }),

    transferStock: builder.mutation({
      query: (data) => ({
        url: '/transactions/transfer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transactions', 'Inventory', 'Reports'],
    }),

    adjustStock: builder.mutation({
      query: (data) => ({
        url: '/transactions/adjustment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transactions', 'Inventory', 'Reports'],
    }),

    // Reports endpoints
    getStockByProduct: builder.query({
      query: (product_id) => ({
        url: '/reports/stock-levels/by-product',
        params: product_id ? { product_id } : {},
      }),
      providesTags: ['Reports'],
    }),

    getStockByWarehouse: builder.query({
      query: (warehouse_id) => ({
        url: '/reports/stock-levels/by-warehouse',
        params: warehouse_id ? { warehouse_id } : {},
      }),
      providesTags: ['Reports'],
    }),

    getLowStockAlerts: builder.query({
      query: () => '/reports/low-stock',
      providesTags: ['Reports'],
    }),

    getValuationByProduct: builder.query({
      query: () => '/reports/valuation/by-product',
      providesTags: ['Reports'],
    }),

    getValuationByWarehouse: builder.query({
      query: () => '/reports/valuation/by-warehouse',
      providesTags: ['Reports'],
    }),

    getValuationByCategory: builder.query({
      query: () => '/reports/valuation/by-category',
      providesTags: ['Reports'],
    }),

    getOverallSummary: builder.query({
      query: () => '/reports/summary',
      providesTags: ['Reports'],
    }),

    getProductAvailability: builder.query({
      query: (product_id) => ({
        url: '/reports/product-availability',
        params: product_id ? { product_id } : {},
      }),
      providesTags: ['Reports'],
    }),

    getWarehouseUtilization: builder.query({
      query: (warehouse_id) => ({
        url: '/reports/warehouse-utilization',
        params: warehouse_id ? { warehouse_id } : {},
      }),
      providesTags: ['Reports'],
    }),

    // New report endpoints for ReportsScreen
    getLowStockReport: builder.query({
      query: () => '/reports/low-stock',
      providesTags: ['Reports'],
    }),

    getStockValueReport: builder.query({
      query: () => '/reports/valuation/summary',
      providesTags: ['Reports'],
    }),

    getWarehouseUtilizationReport: builder.query({
      query: () => '/reports/warehouse-utilization',
      providesTags: ['Reports'],
    }),

    getProductMovementReport: builder.query({
      query: ({ days = 30 }) => ({
        url: '/reports/product-movement',
        params: { days },
      }),
      providesTags: ['Reports'],
    }),

    // Health check
    healthCheck: builder.query({
      query: () => '/health',
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductBySkuQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useArchiveProductMutation,
  useActivateProductMutation,
  
  // Warehouses
  useGetWarehousesQuery,
  useGetWarehouseQuery,
  useGetWarehouseByCodeQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useArchiveWarehouseMutation,
  useActivateWarehouseMutation,
  
  // Inventory
  useGetInventoryQuery,
  useGetInventoryByIdQuery,
  useGetInventoryByProductWarehouseQuery,
  useGetLowStockItemsQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useAdjustInventoryMutation,
  useArchiveInventoryMutation,
  useActivateInventoryMutation,
  
  // Transactions
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useGetTransactionsByProductQuery,
  useGetTransactionsByWarehouseQuery,
  useStockInMutation,
  useStockOutMutation,
  useTransferStockMutation,
  useAdjustStockMutation,
  
  // Reports
  useGetStockByProductQuery,
  useGetStockByWarehouseQuery,
  useGetLowStockAlertsQuery,
  useGetValuationByProductQuery,
  useGetValuationByWarehouseQuery,
  useGetValuationByCategoryQuery,
  useGetOverallSummaryQuery,
  useGetProductAvailabilityQuery,
  useGetWarehouseUtilizationQuery,
  useGetLowStockReportQuery,
  useGetStockValueReportQuery,
  useGetWarehouseUtilizationReportQuery,
  useGetProductMovementReportQuery,
  
  // Health
  useHealthCheckQuery,
} = inventoryApi;

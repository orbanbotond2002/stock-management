import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { ProductsPage } from '../pages/ProductsPage'
import { StockMovementsPage } from '../pages/StockMovementsPage'
import { StockReportPage } from '../pages/StockReportPage'
import { WarehousesPage } from '../pages/WarehousesPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/products/:id', element: <ProductDetailPage /> },
          { path: '/warehouses', element: <WarehousesPage /> },
          { path: '/stock-movements', element: <StockMovementsPage /> },
          { path: '/reports/stock-on-hand', element: <StockReportPage /> },
        ],
      },
    ],
  },
])

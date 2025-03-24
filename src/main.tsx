
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'  // Fixed import path
import { WishlistProvider } from '@/contexts/WishlistContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext'
import { HelmetProvider } from 'react-helmet-async'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <WishlistProvider>
              <CartProvider>
                <RecentlyViewedProvider>
                  <NotificationProvider>
                    <App />
                  </NotificationProvider>
                </RecentlyViewedProvider>
              </CartProvider>
            </WishlistProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

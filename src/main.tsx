
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { AddressProvider } from '@/contexts/AddressContext';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AddressProvider>
              <WishlistProvider>
                <CartProvider>
                  <OrderProvider>
                    <NotificationProvider>
                      <App />
                      <Toaster position="top-right" />
                    </NotificationProvider>
                  </OrderProvider>
                </CartProvider>
              </WishlistProvider>
            </AddressProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

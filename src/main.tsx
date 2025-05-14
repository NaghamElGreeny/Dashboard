import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';
// Tailwind css
import './tailwind.css';
// i18n (needs to be bundled)
import './i18n';
// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './Auth/AuthProvider';
import { MantineProvider } from '@mantine/core';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Suspense>
                <Provider store={store}>
                    <MantineProvider>
                        <AuthProvider>
                            <RouterProvider router={router} />
                        </AuthProvider>
                    </MantineProvider>
                </Provider>
            </Suspense>
        </QueryClientProvider>
    </React.StrictMode>
);

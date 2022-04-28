import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import ProtectedRoutes from './utils/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext'

import Header from './components/Header';
import PersonalPage from './pages/PersonalPage'
import StorePage from "./pages/StorePage"
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'
import ConfirmPage from './pages/ConfirmPage'
import AdminPanel from './pages/AdminPanel'
import RequestsPage from './pages/RequestsPage'
import OrdersPage from './pages/OrdersPage'
import OrderPage from './pages/OrderPage'
import Cart from './components/Cart';


const App = () => {
    return (
        <>
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<ProtectedRoutes />}>
                            <Route path="personal" element={<PersonalPage />} />
                            <Route path="store" element={<StorePage />} />
                            <Route path="store/:productId" element={<ProductPage />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="confirm" element={<ConfirmPage />} />
                            <Route path="/admin">
                                <Route path="main" element={<AdminPanel />} />
                                <Route path="requests" element={<RequestsPage />} />
                                <Route path="orders" element={<OrdersPage />} />
                                <Route path="orders/:orderId" element={<OrderPage />} />

                            </Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </>
    );
};

export default App;

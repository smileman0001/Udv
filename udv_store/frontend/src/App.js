import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import ProtectedRoutes from './utils/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext'

import Header from './components/Header';
import PersonalPage from './pages/store/PersonalPage'
import StorePage from "./pages/store/StorePage"
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/store/ProductPage'
import ConfirmPage from './pages/store/ConfirmPage'
import AdminPanel from './pages/admin/AdminPanel'
import RequestsPage from './pages/admin/RequestsPage'
import OrdersPage from './pages/admin/OrdersPage'
import OrderPage from './pages/admin/OrderPage'

import "./css/mainStyles.css"
import TestPage1 from './pages/SearchUser';

const App = () => {
    return (
        <>
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path='/' exact element={<TestPage1 />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<ProtectedRoutes />}>
                            <Route path="personal" element={<PersonalPage />} />
                            <Route path="confirm" element={<ConfirmPage />} />
                            <Route path="store" element={<StorePage />} />
                            <Route path="store/:productId" element={<ProductPage />} />
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

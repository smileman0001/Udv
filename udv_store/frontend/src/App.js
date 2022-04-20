import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import ProtectedRoutes from './utils/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext'

import Header from './components/Header';
import PersonalPage from './pages/PersonalPage'
import StorePage from "./pages/StorePage"
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'
import TestPage from './pages/TestPage'
// import TaskExample from "./TasksExample"


const App = () => {
    return (
        <>
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        {/* <Route path="/task" element={<TaskExample />} /> */}
                        <Route element={<ProtectedRoutes />}>
                            <Route path="/personal" element={<PersonalPage />} />
                            <Route path="/store" element={<StorePage />} />
                            <Route path="/store/:productId" element={<ProductPage />} />
                        </Route>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/test" element={<TestPage />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </>
    );
};

export default App;

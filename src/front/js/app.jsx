import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import Me from './pages/me.jsx';
import SignUp from './pages/sign-up.jsx';
import Unavailable from './pages/unavailable.jsx';
import injectContext from "./store/appContext";

const App = () => {
    return (
        <div>
            <BrowserRouter basename={process.env.BASENAME}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/me" element={<Me />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<Unavailable />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(App);

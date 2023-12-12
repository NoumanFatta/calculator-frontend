import React from 'react'
import { Routes,Route, } from 'react-router-dom';
import CalculatorApp from '../components/Calculator';
import Auth from '../components/auth/Auth';
import Signup from '../components/auth/Signup';
const ProjRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Auth/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/cal" element={<CalculatorApp />} />
        </Routes>
    )
}

export default ProjRoutes
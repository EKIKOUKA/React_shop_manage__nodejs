import React, { ReactNode } from 'react';
import { Navigate, useLocation } from "react-router-dom"

const RequireAuth = ({ children }: { children: ReactNode}) => {
    const userInfo = localStorage.getItem("userInfo")
    const location = useLocation()

    if (!userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children;
}

export default RequireAuth;
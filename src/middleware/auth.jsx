import React from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom';

const Auth = ({children}) => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    if (!access_token || !refresh_token) {
        return <Navigate to="/login" />;
    } else {
        return children;
    }
}

export default Auth
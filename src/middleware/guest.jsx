import React from 'react'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Guest = ({children}) => {

    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    if (access_token && refresh_token) {
        return <Navigate to={"/"} />;
    } else {
        return children
    }
}

export default Guest
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearSession } from '../context/slices/userSlice';

const useRefreshToken = () => {

    const {
        email
    } = useSelector(state => state.user)

    const [isFetching, setIsFetching] = useState(false);
    const [isError, setIsError] = useState(false);

    const navigator = useNavigate();
    const dispatch = useDispatch()

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchRefreshToken = async (callback) => {
        try {
            setIsFetching(true);
            setIsError(false);

            const refresh_token = Cookies.get('refresh_token');

            const url = `${apiUrl}/refresh_token`;
            const body = {
                email
            };

            const options = {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${refresh_token}`,
                },
            };

            const { data } = await axios.post(url, body, options);
            setIsFetching(false);

            if (data?.statuscode === 200) {
                Cookies.set("refresh_token", data?.refresh_token)
                Cookies.set("access_token", data?.access_token)

                callback();
                return true;
            } else {
                handleAuthError();
                return false;
            }
        } catch (e) {
            setIsFetching(false);
            setIsError(true);
            console.error("Refresh token error:", e);
            handleAuthError();
            return false;
        }
    };

    const handleAuthError = () => {
        toast.dismiss();
        toast('Session expired');

        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        dispatch(clearSession())
        navigator('/login');
    };

    return { isFetching, isError, fetchRefreshToken };
};

export default useRefreshToken;
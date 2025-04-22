import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../utils/HttpUtil';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, setUsername } from '../context/slices/userSlice';
import useRefreshToken from '../hooks/useRefreshToken';
import ConfirmBox from '../components/ConfirmBox';
import Cookies from 'js-cookie';

const ProfileScreen = () => {

    const {
        username,
        email,
        phone
    } = useSelector(state => state.user)

    const usernameInputRef = useRef()
    const emailInputRef = useRef()
    const phoneInputRef = useRef()

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const { isFetching, isError, fetchRefreshToken } = useRefreshToken();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const handleEditMode = () => {
        if (!editMode) {
            setEditMode(true);
            setTimeout(() => {
                usernameInputRef.current.focus()
            }, 50);
        } else {
            setIsLoading(true)
            const requestBody = {
                name: usernameInputRef.current.value,
                email
            }

            postRequest('/edit_profile', requestBody).then(({data}) => {
                if (data?.statuscode === 200) {
                    dispatch(setUsername(usernameInputRef.current.value));
                    toast.success('Profile updated successfully')
                    setEditMode(false)                    
                } else if (data?.statuscode === 400) {
                    toast.error(data.message)
                    console.log(data)
                } else if (data?.statuscode == 403) {
                    toast.error(data?.message)
                    dispatch(clearSession())
                    Cookies.remove('access_token')
                    navigator('/login')
                } else if (data?.statuscode == 401) {
                    fetchRefreshToken(handleEditMode)   
                } else {
                    toast.error('Something went wrong')
                    console.log(data)
                }
            }).catch((error) => {
                toast.error('Something went wrong')
                console.log(error)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    const handleLogout = () => {
        setIsLogoutModalOpen(true)
    }

    const onLogout = () => {
        setIsLoading(true)
        const requestBody = {
            email: email
        }

        postRequest('/logout', requestBody).then(({data}) => {
            if (data?.statuscode === 200) {
                dispatch(clearSession())
                Cookies.remove('access_token')
                Cookies.remove('refresh_token')
                navigator('/login');
            } else if (data?.statuscode === 400) {
                toast.error(data.message)
                console.log(data)
            } else if (data?.statuscode == 403) {
                toast.error(data?.message)
                dispatch(clearSession())
                Cookies.remove('access_token')
                navigator('/login')
            } else if (data?.statuscode == 401) {
                fetchRefreshToken(onLogout)   
            } else {
                toast.error('Something went wrong')
                console.log(data)
            }
        }).catch((error) => {
            toast.error('Something went wrong')
            console.log(error)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleCancelEdit = () => {
        usernameInputRef.current.value = username;
        emailInputRef.current.value = email;
        phoneInputRef.current.value = phone;

        setEditMode(false)
    }

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(true)
    }

    const onDeleteAccount = () => {
        setIsLoading(true)
        const requestBody = {
            email: email
        }

        postRequest('/account_delete', requestBody).then(({data}) => {
            if (data?.statuscode === 200) {
                dispatch(clearSession())
                Cookies.remove('access_token')
                Cookies.remove('refresh_token')
                navigator('/signup');
            } else if (data?.statuscode === 400) {
                toast.error(data.message)
                console.log(data)
            } else if (data?.statuscode == 403) {
                toast.error(data?.message)
                dispatch(clearSession())
                Cookies.remove('access_token')
                navigator('/login')
            } else if (data?.statuscode == 401) {
                fetchRefreshToken(onDeleteAccount)   
            } else {
                toast.error('Something went wrong')
                console.log(data)
            }
        }).catch((error) => {
            toast.error('Something went wrong')
            console.log(error)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        usernameInputRef.current.value = username;
        emailInputRef.current.value = email;
        phoneInputRef.current.value = phone;
    }, [])

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-10'>
            {(isFetching || isLoading) && (
                <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50'>
                    <div className="bg-[#FBFCFB]/20 p-4 rounded-full">
                        <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}
            
            {isLogoutModalOpen && (
                <ConfirmBox 
                    message={'Are you sure you want to logout?'} 
                    onClose={() => setIsLogoutModalOpen(false)} 
                    onConfirm={onLogout} 
                />
            )}
            
            {isDeleteModalOpen && (
                <ConfirmBox 
                    message={'Are you sure you want to delete your account?'} 
                    onClose={() => setIsDeleteModalOpen(false)} 
                    onConfirm={onDeleteAccount} 
                />
            )}

            <div className="w-full max-w-md mx-auto">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link 
                            to={-1} 
                            className="mr-3 text-slate-500 hover:text-slate-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h1 className='text-2xl font-bold text-slate-800'>Your Profile</h1>
                    </div>
                </div>

                <div className="bg-[#FBFCFB] p-6 rounded-xl shadow-md border border-slate-200">
                    <div className="mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Manage your account details</p>
                            
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/change_password" 
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    Change Password
                                </Link>
                                
                                <button 
                                    className="text-sm font-medium text-red-600 hover:text-red-800" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input 
                                ref={usernameInputRef}
                                disabled={!editMode}
                                type="text" 
                                id="username" 
                                className={`block w-full rounded-lg border ${editMode ? 'bg-[#FBFCFB] border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500' : 'bg-slate-50 border-slate-200'} py-3 px-4 text-slate-900`}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <input 
                                    ref={emailInputRef}
                                    disabled
                                    type="email" 
                                    id="email" 
                                    className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <input 
                                    ref={phoneInputRef}
                                    disabled
                                    type="text" 
                                    id="phone_number" 
                                    className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center gap-3">
                        {editMode && (
                            <button
                                className="w-full py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-[#FBFCFB] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                        )}
                        
                        <button
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${editMode ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                            onClick={handleEditMode}
                        >
                            {editMode ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
                
                <div className="mt-6 p-5 bg-red-50 border border-red-100 rounded-lg">
                    <h3 className="text-md font-medium text-red-800 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        className="w-full flex justify-center items-center py-3 px-4 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-[#FBFCFB] hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        onClick={handleDeleteAccount}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileScreen
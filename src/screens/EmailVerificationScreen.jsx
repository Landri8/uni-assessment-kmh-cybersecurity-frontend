import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { setEmailVerified } from '../context/slices/userSlice'
import { postRequest } from '../utils/HttpUtil'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

const EmailVerificationScreen = () => {
    const {
        email
    } = useSelector(state => state.user)

    const locationData = useLocation();
    const {login} = locationData?.state || {};

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const inputRef = useRef('')
    const [isValid, setIsValid] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const inputValue = e.target.value;

        inputRef.current.value = inputValue.toUpperCase();

        if (inputValue.length == 6) {
            setIsValid(true);
        } else if (inputValue.length < 6) {
            setIsValid(false);
        } else {
            inputRef.current.value = inputValue.slice(0, 6);
        }

    }

    const handleVerifyEmail = () => {
        if (isValid) {
            setIsValidating(true);
            const requestBody = {
                email,
                verification_code: inputRef.current.value,
                login: login ?? false
            }

            postRequest('/verify_email', requestBody).then(({data}) => {
                if (data?.statuscode === 200) {
                    toast.success('Email verified')
                    dispatch(setEmailVerified(true))

                    if (login && login == true) {
                        Cookies.set('access_token', data?.access_token)
                        Cookies.set('refresh_token', data?.refresh_token)
                        navigator('/')
                    } else{
                        navigator('/add_phone')
                    }
                } else if (data?.statuscode === 400) {
                    setErrorMessage(data?.message);
                    toast.error("Failed to verify email")
                } else {
                    toast.error('Something went wrong')
                }
            }).catch((error) => {
                toast.error('Something went wrong')
                console.log(error)
            }).finally(() => {
                inputRef.current.value = '';
                setIsValidating(false)
                setIsValid(false)
            })
        } else {
            toast.dismiss()
            toast.error('Please fill the input')
        }
    }

    const handleResend = () => {
        setIsResending(true);
        toast.loading("Resending verification code...")
        const requestBody = {
            email: email
        }

        postRequest('/resend_email', requestBody).then(({data}) => {
            toast.dismiss()
            if (data?.statuscode === 200) {
                toast.success('Verification code resent')
            } else {
                toast.error('Something went wrong')
            }
        }).catch((error) => {
            toast.dismiss()
            toast.error('Something went wrong')
            console.log(error);
        }).finally(() => {
            setIsResending(false)
        })
    }

    useEffect(() => {
        console.log(email)
        if (email == null) {
            navigator('/login');
        } else {
            inputRef.current.focus();
        }
    }, [])

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-10'>
            <div className="w-full max-w-md mx-auto">
                <div className="bg-[#FBFCFB] p-8 rounded-xl shadow-lg border border-slate-200">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                    )}
                    
                    <div className="text-center mb-8">
                        <img className='h-10 mx-auto mb-6' src="/images/logo.png" alt="Logo" />
                        <h2 className='text-2xl font-bold text-slate-800 mb-2'>Verify your email</h2>
                        <p className='text-slate-500 text-sm'>We've sent a verification code to your email address</p>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="verification-code" className="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
                        <input 
                            id="verification-code"
                            ref={inputRef}
                            disabled={isValidating}
                            type="text" 
                            onChange={handleInputChange}
                            className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='Enter the 6-digit code'
                        />
                    </div>
                    
                    <button
                        disabled={!isValid || isValidating}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isValid ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-indigo-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                        onClick={handleVerifyEmail}
                    >
                        {isValidating ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            "Verify Email"
                        )}
                    </button>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 mb-2">Didn't receive the code?</p>
                        <button 
                            onClick={handleResend} 
                            disabled={isResending}
                            className={`text-sm font-medium ${isResending ? 'text-slate-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800'} transition-colors flex mx-auto items-center`}
                        >
                            {isResending ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending new code...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Resend verification code
                                </>
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        If you're having trouble, please contact <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailVerificationScreen
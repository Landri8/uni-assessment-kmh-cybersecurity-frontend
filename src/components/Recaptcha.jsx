import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEmail, setPhone, setUsername } from '../context/slices/userSlice';
import { RiCloseFill } from "react-icons/ri";

const Recaptcha = ({url, refreshCaptcha, onVerify, onClose, isRefreshing}) => {

    const recaptchaInputRef = useRef('');
    const [isVerifying, setIsVerifying] = useState(false);

    const dispatch = useDispatch();
    const navigator = useNavigate();

    const handleVerifyRecaptcha = () => {
        if (recaptchaInputRef.current.value) {
            setIsVerifying(true);

            onVerify(recaptchaInputRef.current.value).then(async ({data}) => {
                console.log('data', data);
                if (data?.statuscode == 200) {
                    toast.success('Recaptcha verified');

                    let user = data?.user;
                    
                    dispatch(setUsername(user.name));
                    dispatch(setEmail(user.email));

                    if (user.phone && user.phone.length) {
                        dispatch(setPhone(user.phone));
                        navigator('/email_verification', {state: {login: true}});
                    } else {
                        navigator('/email_verification');
                    }
                    

                } else if (data?.statuscode == 400) {
                    toast.loading('Failed to verify. Refreshing recaptcha...', {duration: 1400},);
                    await refreshCaptcha();

                    console.log(data);
                } else {
                    toast.loading('Failed to verify. Refreshing recaptcha...', {duration: 1400},);
                    await refreshCaptcha();

                    console.log(data);
                }
            }).catch(err => {
                toast.error('Something went wrong');
                console.log(err);
            }).finally(() => {
                setIsVerifying(false);
                recaptchaInputRef.current.value = '';
            })
        } else {
            toast.error('Please enter recaptcha');
        }
    }

    const handleInputChange = (e) => {
        recaptchaInputRef.current.value = e.target.value.toUpperCase();
    }


    useEffect(() => {
        recaptchaInputRef.current.focus();
    }, [])

    useEffect(() => {
        if (!isRefreshing) {
            recaptchaInputRef.current.focus();
        }
    }, [isRefreshing])

    return createPortal(
        <div className='fixed inset-0 bg-slate-900 bg-opacity-50 z-40 flex items-center justify-center backdrop-blur-sm'>
            <div className='w-full max-w-md bg-[#FBFCFB] rounded-xl shadow-lg p-8 relative'>
                <button 
                    onClick={onClose} 
                    className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors'
                >
                    <RiCloseFill className="w-6 h-6" />
                </button>
                
                <div className="text-center mb-6">
                    <h2 className='text-xl font-bold text-slate-800 mb-2'>Security Verification</h2>
                    <p className="text-slate-500 text-sm">Please enter the characters you see in the image below</p>
                </div>
                
                <div className="mb-6">
                    {url ? (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <img 
                                src={url} 
                                className='w-full rounded-md select-none shadow-sm mx-auto' 
                                alt="CAPTCHA verification" 
                            />
                            
                            <button 
                                onClick={refreshCaptcha}
                                disabled={isRefreshing}
                                className="mt-3 flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-800 w-full"
                            >
                                {isRefreshing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-4 w-4 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading new image...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh image
                                    </span>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex flex-col items-center text-slate-400">
                                <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm">Loading verification image...</span>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mb-6">
                    <label htmlFor="captcha" className="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
                    <input 
                        ref={recaptchaInputRef} 
                        id="captcha"
                        type="text" 
                        placeholder='Enter characters from image'
                        onChange={handleInputChange}
                        disabled={isVerifying || isRefreshing}
                        className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <button
                    disabled={isVerifying || isRefreshing}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={handleVerifyRecaptcha}
                >
                    {isVerifying ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        "Verify"
                    )}
                </button>
                
                <p className="mt-4 text-xs text-center text-slate-500">
                    This verification helps us protect our service from automated bots
                </p>
            </div>
        </div>,
        document.body
    )
}

export default Recaptcha
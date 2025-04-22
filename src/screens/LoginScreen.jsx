import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { postRequest } from '../utils/HttpUtil'
import Recaptcha from '../components/Recaptcha'
import { FiEyeOff, FiEye, FiUser, FiLock } from "react-icons/fi";

const LoginScreen = () => {
    const emailInputRef = useRef("")
    const passwordInputRef = useRef("")

    const [showPassword, setShowPassword] = useState(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [recaptchaUrl, setRecaptchaUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [isLogingIn, setIsLogingIn] = useState(false);
    const [formStatus, setFormStatus] = useState({
        email: false,
        password: false,
    });
    
    const [formError, setFormError] = useState({
        email: "",
        password: "",
    })

    const navigator = useNavigate();
    const dispatch = useDispatch();

    // All the handlers remain the same
    const handleEmailChange = (e) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!e.target.value) {
          setFormStatus(prev => ({ ...prev, email: false }))
          setFormError(prev => ({ ...prev, email: 'Email is required' }))
        }
        else if (!emailRegex.test(e.target.value)) {
          setFormStatus(prev => ({ ...prev, email: false }))
          setFormError(prev => ({ ...prev, email: 'Invalid email format' }))
        } else {
          setFormStatus(prev => ({ ...prev, email: true }))
          setFormError(prev => ({ ...prev, email: '' }))
        }
    }

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const rev1 = /^.{8,}$/
    
        if (rev1.test(password)) {
            setFormStatus(prev => ({ ...prev, password: true }))
            setFormError(prev => ({ ...prev, password: '' }))
        } else {
            setFormStatus(prev => ({ ...prev, password: false }))
            setFormError(prev => ({ ...prev, password: 'Password should contain at least 8 characters' }))
        }
    }

    const handleSubmit = async () => {
        if (formStatus.email && formStatus.password) {
            setIsLogingIn(true);
            const requestBody = {
                email: emailInputRef.current.value,
                password: passwordInputRef.current.value
            }

            postRequest('/login', requestBody).then(({data}) => {
                if (data?.statuscode == 200) {
                    setShowRecaptcha(true)
                    setRecaptchaUrl(data.recaptchaurl)
                }
                else if (data?.statuscode == 400) {
                    resetForm()
                    setErrorMessage(data.message)
                    toast.error("Failed to login")
                } 
                else {
                    resetForm()
                    toast.error('Something went wrong')
                }
            }).catch((error) => {
                resetForm()
                toast.error("Something went wrong")
                console.log(error)
            }).finally(() => {
                window.scrollTo(0, 0)
                setIsLogingIn(false)
            })
        } else {
            toast.dismiss()
            toast.error('Please fill in all required fields')
        }
    }

    const handleVerifyRecaptcha = (code) => {
        const requestBody = {
          email: emailInputRef.current.value,
          recaptcha_code: code,
          login: "true"
        }
    
        return postRequest('/verify_recaptcha', requestBody)
    }

    const handleCloseModal = () => {
        setShowRecaptcha(false)
        setRecaptchaUrl('')
    }

    const resetForm = () => {
        emailInputRef.current.value = ''
        passwordInputRef.current.value = ''
        setFormStatus({
            email: false,
            password: false,
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            {showRecaptcha && <Recaptcha isRefreshing={isLogingIn} onClose={handleCloseModal} url={recaptchaUrl} refreshCaptcha={handleSubmit} onVerify={handleVerifyRecaptcha} />}
            
            <div className="w-full max-w-md">
                <div className="bg-[#FBFCFB] p-8 rounded-xl shadow-lg border border-slate-200">
                    <div className="mb-8 text-center">
                        <img src="/images/logo.png" alt="Logo" className="h-10 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
                        <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
                    </div>
                    
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                    )}
                    
                    <form>
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    ref={emailInputRef}
                                    id="email"
                                    type="email"
                                    onChange={handleEmailChange}
                                    disabled={isLogingIn}
                                    placeholder="your@email.com"
                                    className="pl-10 block w-full rounded-lg border border-slate-200 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            {formError.email && <p className="mt-1 text-sm text-red-600">{formError.email}</p>}
                        </div>
                        
                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    ref={passwordInputRef}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    onChange={handlePasswordChange}
                                    disabled={isLogingIn}
                                    placeholder="Enter password"
                                    className="pl-10 block w-full rounded-lg border border-slate-200 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? 
                                        <FiEye className="h-5 w-5 text-slate-400 hover:text-slate-500" /> : 
                                        <FiEyeOff className="h-5 w-5 text-slate-400 hover:text-slate-500" />
                                    }
                                </button>
                            </div>
                            {formError.password && <p className="mt-1 text-sm text-red-600">{formError.password}</p>}
                        </div>
                        
                        <button
                            type="button"
                            disabled={isLogingIn}
                            onClick={handleSubmit}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            {isLogingIn ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-800">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen
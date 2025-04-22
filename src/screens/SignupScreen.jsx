import { animated, useTransition } from '@react-spring/web'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import PasswordErrorMessage from '../components/SignupScreen/PasswordErrorMessage';
import toast from 'react-hot-toast';
import { postRequest } from '../utils/HttpUtil';
import { FiEyeOff, FiEye } from "react-icons/fi";

import Recaptcha from '../components/Recaptcha';

const SignupScreen = () => {

  const usernameInputRef = useRef("")
  const emailInputRef = useRef("")
  const passwordInputRef = useRef("")
  const confirmPasswordInputRef = useRef("")

  const [showPassword, setShowPassword] = useState(false);

  const [showPasswordSchema, setShowPasswordSchema] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [recaptchaUrl, setRecaptchaUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStatus, setFormStatus] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [formError, setFormError] = useState({
    username: "",
    email: "",
    confirmPassword: "",
  })

  const [passwordValidationSchema, setPasswordValidationSchema] = useState({
    v1: false, // at least 8 characters
    v2: false, // one lowercase letter
    v3: false, // one uppercase letter
    v4: false, // one digit number
    v5: false // one special character
  })

  const transition = useTransition(showPasswordSchema, {
    from: { opacity: 0 },
    enter: { opacity: 1},
    leave: { opacity: 0},
    config: { duration: 400 },
  });

  const handleUsernameChange = (e) => {
    if (!e.target.value) {
      console.log('Username is required');
      setFormStatus(prev => ({ ...prev, username: false }))
      setFormError(prev => ({ ...prev, username: 'Username is required' }))
    }
    else if (e.target.value.length < 3) {
      console.log('Username is too short');
      setFormStatus(prev => ({ ...prev, username: false }))
      setFormError(prev => ({ ...prev, username: 'Username is too short' }))
    }
    else {
      setFormStatus(prev => ({ ...prev, username: true }))
      setFormError(prev => ({ ...prev, username: '' }))
    }
  }

  const handleEmailChange = (e) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!e.target.value) {
      console.log('Email is required');
      setFormStatus(prev => ({ ...prev, email: false }))
      setFormError(prev => ({ ...prev, email: 'Email is required' }))
    }
    else if (!emailRegex.test(e.target.value)) {
      console.log('Email is invalid');
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
    const rev2 = /(?=.*[a-z])/
    const rev3 = /(?=.*[A-Z])/
    const rev4 = /(?=.*\d)/
    const rev5 = /(?=.*[!@#$%^&*])/

    if (rev1.test(password)) {
      setPasswordValidationSchema(prev => ({ ...prev, v1: true }))
    } else {
      setPasswordValidationSchema(prev => ({ ...prev, v1: false }))
    }

    if (rev2.test(password)) {
      setPasswordValidationSchema(prev => ({ ...prev, v2: true }))
    } else {
      setPasswordValidationSchema(prev => ({ ...prev, v2: false }))
    }

    if (rev3.test(password)) {
      setPasswordValidationSchema(prev => ({ ...prev, v3: true }))
    } else {
      setPasswordValidationSchema(prev => ({ ...prev, v3: false }))
    }

    if (rev4.test(password)) {
      setPasswordValidationSchema(prev => ({ ...prev, v4: true }))
    } else {
      setPasswordValidationSchema(prev => ({ ...prev, v4: false }))
    }

    if (rev5.test(password)) {
      setPasswordValidationSchema(prev => ({ ...prev, v5: true }))
    } else {
      setPasswordValidationSchema(prev => ({ ...prev, v5: false }))
    }

  }

  const handleConfirmPasswordChange = () => {
    if (passwordInputRef.current.value !== confirmPasswordInputRef.current.value) {
      setFormStatus(prev => ({ ...prev, confirmPassword: false }))
      setFormError(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
    } else {
      setFormStatus(prev => ({ ...prev, confirmPassword: true }))
      setFormError(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  const handleSubmit = async () => {
    if (formStatus.username && formStatus.email && formStatus.password && formStatus.confirmPassword) {
      setRecaptchaUrl('')
      setIsSigningIn(true);

      const requestBody = {
        name: usernameInputRef.current.value,
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        password_confirmation: confirmPasswordInputRef.current.value
      }

      postRequest('/signup', requestBody).then(({data}) => {
        if (data?.statuscode === 200) {
          setShowRecaptcha(true)
          setRecaptchaUrl(data.recaptchaurl)
        } else if (data?.statuscode === 400) {
          setErrorMessage(data.message)
          toast.error("Failed to create account")
        } else {
          toast.error('Something went wrong')
        }
      }).catch((error) => {
        toast.error('Something went wrong')
        console.log(error)
      }).finally(() => {
        window.scrollTo(0, 0)
        setIsSigningIn(false)
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
      login: "false"
    }

    return postRequest('/verify_recaptcha', requestBody)
  }

  const handleCloseModal = () => {
    setShowRecaptcha(false)
    setRecaptchaUrl('')
  }

  useEffect(() => {
    if (passwordValidationSchema.v1 && passwordValidationSchema.v2 && passwordValidationSchema.v3 && passwordValidationSchema.v4 && passwordValidationSchema.v5) {
      setFormStatus(prev => ({ ...prev, password: true }))
    } else {
      setFormStatus(prev => ({ ...prev, password: false }))
    }
  }, [passwordValidationSchema])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-10'>
      {showRecaptcha && <Recaptcha isRefreshing={isSigningIn} onClose={handleCloseModal} url={recaptchaUrl} refreshCaptcha={handleSubmit} onVerify={handleVerifyRecaptcha} />}
      
      <div className="w-full max-w-md mx-auto">
          <div className="bg-[#FBFCFB] p-8 rounded-xl shadow-lg border border-slate-200">
              {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
              )}
              
              <div className="text-center mb-6">
                  <img className='h-10 mx-auto mb-4' src="/images/logo.png" alt="Logo" />
                  <h2 className='text-2xl font-bold text-slate-800'>Create an account</h2>
                  <p className="text-slate-500 text-sm mt-1">Sign up to get started</p>
              </div>
              
              <form className='w-full'>
                  <div className="mb-4">
                      <label htmlFor="username" className='block text-sm font-medium text-slate-700 mb-1'>Username</label>
                      <input 
                          ref={usernameInputRef}
                          disabled={isSigningIn}
                          type="text" 
                          id='username' 
                          onChange={handleUsernameChange}
                          placeholder="Choose a username"
                          className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {formError.username && <p className='mt-1 text-sm text-red-600'>{formError.username}</p>}
                  </div>

                  <div className="mb-4">
                      <label htmlFor="email" className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
                      <input 
                          ref={emailInputRef}
                          disabled={isSigningIn}
                          type="email" 
                          id='email' 
                          onChange={handleEmailChange}
                          placeholder="your@email.com"
                          className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {formError.email && <p className='mt-1 text-sm text-red-600'>{formError.email}</p>}
                  </div>

                  <div className="mb-4">
                      <label htmlFor="password" className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
                      <div className='relative'>
                          <input
                              ref={passwordInputRef}
                              disabled={isSigningIn}
                              type={showPassword ? 'text' : 'password'}
                              id='password'
                              onFocus={() => setShowPasswordSchema(true)}
                              onChange={handlePasswordChange}
                              placeholder="Create a strong password"
                              className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button 
                              type='button' 
                              onClick={() => setShowPassword(prev => !prev)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                              {showPassword ? 
                                  <FiEye className='h-5 w-5 text-slate-400 hover:text-slate-500' /> : 
                                  <FiEyeOff className='h-5 w-5 text-slate-400 hover:text-slate-500' />
                              }
                          </button>
                      </div>

                      {transition((style, item) =>
                          item ? (
                              <animated.div 
                                  style={style} 
                                  className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                              >
                                  <h3 className='font-medium text-slate-700 mb-2'>Your password must contain:</h3>

                                  <PasswordErrorMessage message={'At least 8 characters'} validated={passwordValidationSchema.v1} />
                                  <PasswordErrorMessage message={'At least one lowercase character'} validated={passwordValidationSchema.v2} />
                                  <PasswordErrorMessage message={'At least one uppercase character'} validated={passwordValidationSchema.v3} />
                                  <PasswordErrorMessage message={'At least one digit number'} validated={passwordValidationSchema.v4} />
                                  <PasswordErrorMessage message={'At least one special character'} validated={passwordValidationSchema.v5} />
                              </animated.div>
                          ) : null
                      )}
                  </div>

                  <div className="mb-6">
                      <label htmlFor="confirm_password" className='block text-sm font-medium text-slate-700 mb-1'>Confirm Password</label>
                      <input 
                          ref={confirmPasswordInputRef}
                          disabled={isSigningIn}
                          type="password" 
                          id='confirm_password' 
                          onChange={handleConfirmPasswordChange}
                          placeholder="Confirm your password"
                          className="block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {formError.confirmPassword && <p className='mt-1 text-sm text-red-600'>{formError.confirmPassword}</p>}
                  </div>
                  
                  <button
                      disabled={isSigningIn}
                      type="button"
                      onClick={handleSubmit}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                      {isSigningIn ? (
                          <span className="flex items-center">
                              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Account...
                          </span>
                      ) : (
                          "Create Account"
                      )}
                  </button>

                  <div className="mt-6 text-center">
                      <p className="text-sm text-slate-600">
                          Already have an account?{' '}
                          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800">
                              Sign in
                          </Link>
                      </p>
                  </div>
              </form>
          </div>
      </div>
  </div>
  )
}

export default SignupScreen
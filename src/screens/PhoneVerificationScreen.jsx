import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postRequest } from '../utils/HttpUtil';

const PhoneVerificationScreen = () => {

    const {
        email,
        email_verified,
        phone
    } = useSelector(state => state.user)
    
    const [otp, setOTP] = useState(new Array(6).fill(''));
    const otpInputs = useRef([]);

    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isResending, setIsResending] = useState(false);

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const handleVerify = () => {
        setIsValidating(true);
        toast.loading("Verifying phone number...")
        const requestBody = {
            email,
            otp: otp.join('')
        }

        postRequest('/verify_otp', requestBody).then(({data}) => {
            toast.dismiss()
            if (data?.statuscode == 200) {
                toast.success('Phone number verified')

                navigator('/login')
                console.log(data)
            } else if (data?.statuscode == 400) {
                toast.error(data?.message)
                console.log(data)
            } else {
                toast.error('Something went wrong')
                console.log(data)
            }
        }).catch((error) => {
            toast.dismiss()
            toast.error('Something went wrong')
            console.log(error)
        }).finally(() => {
            clearOTPInputs();
            setIsValidating(false);
        })
    }

    const handleResend = () => {
        setIsResending(true);
        toast.loading("Resending OTP code...")
        const requestBody = {
            email,
            phone
        }

        postRequest('/resend_otp', requestBody).then(({data}) => {
            toast.dismiss()
            if (data?.statuscode === 200) {
                toast.success('OTP code resent')
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
    
    const handleChange = (index, value) => {
        if (!isNaN(value)) {
          const newOTP = [...otp];
          newOTP[index] = value;
          setOTP(newOTP);
          if (value !== '') {
            focusNextInput(index);
          }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && index > 0 && otp[index] === '') {
            focusPrevInput(index);
        }
    };

    const focusNextInput = (index) => {
        if (otpInputs.current[index + 1]) {
            otpInputs.current[index + 1].focus();
        }
    };

    const focusPrevInput = (index) => {
        if (otpInputs.current[index - 1]) {
            otpInputs.current[index - 1].focus();
        }
    };

    const clearOTPInputs = () => {
        setOTP(new Array(6).fill(''))
    }
  
  

    useEffect(() => {
        console.log(email, email_verified)
        if (email == null || email_verified == false || phone == null) {
            navigator('/login')
        } else {
        }
    }, [])

    useEffect(() => {
        if(otp.join('').length == 6) {
          handleVerify();
        }
    }, [otp])
  

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-10'>
            <div className="w-full max-w-md mx-auto">
                <div className="bg-[#FBFCFB] p-8 rounded-xl shadow-lg border border-slate-200">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                    )}
                    
                    <div className="text-center mb-6">
                        <img className='h-10 mx-auto mb-4' src="/images/logo.png" alt="Logo" />
                        <h2 className='text-2xl font-bold text-slate-800 mb-2'>Verify your phone</h2>
                        <p className="text-slate-500 text-sm">
                            We've sent a verification code to +959******{phone.slice(-4)}
                        </p>
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-700 mb-3 text-center">Enter verification code</label>
                        
                        <div className='flex items-center justify-center gap-2 max-w-xs mx-auto'>
                            {otp.map((digit, index) => (
                                <input
                                    disabled={isValidating || isResending}
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    inputMode='numeric'
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(input) => (otpInputs.current[index] = input)}
                                    className='w-12 h-12 border-2 rounded-lg border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg font-medium text-slate-800'
                                    aria-label={`Digit ${index + 1}`}
                                />
                            ))}
                        </div>
                        
                        {isValidating && (
                            <div className="mt-4 flex justify-center">
                                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center space-y-4">
                        <p className="text-sm text-slate-600">Didn't receive the code?</p>
                        
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
                        
                        <button 
                            className="text-sm text-slate-500 hover:text-slate-700 mt-2 block mx-auto"
                            onClick={() => window.history.back()}
                        >
                            Change phone number
                        </button>
                    </div>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                        Having trouble? <a href="#" className="text-indigo-600 hover:underline">Contact support</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PhoneVerificationScreen
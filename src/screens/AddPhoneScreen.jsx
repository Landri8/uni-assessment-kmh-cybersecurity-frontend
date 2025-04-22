import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../utils/HttpUtil';
import { setPhone } from '../context/slices/userSlice';
import toast from 'react-hot-toast';

let phone_regex = /^959\d{8,}$/
const AddPhoneScreen = () => {

    const {
        email,
        email_verified
    } = useSelector(state => state.user)
    const inputRef = useRef('');

    const [isValid, setIsValid] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const handleAddPhone = () => {
        if (isValid) {
            setIsValidating(true);
            const requestBody = {
                email,
                phone: inputRef.current.value
            }

            postRequest('/add_phone', requestBody).then(({data}) => {
                if (data?.statuscode == 200) {
                    toast.success('Phone number added successfully')
                    dispatch(setPhone(inputRef.current.value))
                    navigator('/phone_verification')
                } else if (data?.statuscode == 400) {
                    toast.error(data?.message)
                    console.log(data)
                } else {
                    toast.error('Something went wrong')
                    console.log(data)
                }
            }).catch((error) => {
                toast.error('Something went wrong')
                console.log(error)
            }).finally(() => {
                inputRef.current.value = '';
                setIsValidating(false);
            })
            
        } else {
            toast.dismiss()
            toast.error('Please fill the input')
        }
    }

    const handleInputChange = (e) => {
        const inputValue = e.target.value;

        const onlyNumbers = inputValue.replace(/[^0-9]/g, '');
        inputRef.current.value = onlyNumbers;

        if (phone_regex.test(inputValue)) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }

    useEffect(() => {
        console.log(email, email_verified)
        if (email == null || email_verified == false) {
            navigator('/login')
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
                    
                    <div className="text-center mb-6">
                        <img className='h-10 mx-auto mb-4' src="/images/logo.png" alt="Logo" />
                        <h2 className='text-2xl font-bold text-slate-800 mb-2'>Verify your phone</h2>
                        <p className="text-slate-500 text-sm px-4">
                            We'll only use your phone number to verify sign-in or for account protection
                        </p>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="phone-number" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            
                            <input 
                                id="phone-number"
                                type="text" 
                                ref={inputRef}
                                disabled={isValidating}
                                onChange={handleInputChange}
                                placeholder="959*******"
                                className="pl-12 block w-full rounded-lg border border-slate-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <p className="mt-2 text-xs text-slate-500">
                            Format: Country code followed by phone number (e.g., 959*******) 
                        </p>
                    </div>
                    
                    <button
                        disabled={isValidating || !isValid}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isValid ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-indigo-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                        onClick={handleAddPhone}
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
                            "Verify Phone Number"
                        )}
                    </button>
                    
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to receive SMS messages for verification and security purposes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPhoneScreen
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postRequest } from '../utils/HttpUtil';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmBox from '../components/ConfirmBox';
import toast from 'react-hot-toast';
import useRefreshToken from '../hooks/useRefreshToken';
import Cookies from 'js-cookie';
import { clearSession } from '../context/slices/userSlice';
import { useSpring, animated } from '@react-spring/web';

const HomeScreen = () => {

  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { duration: 400 },
    }),
    []
  )

  const {
    email,
  } = useSelector(state => state.user)
  const { isFetching, isError, fetchRefreshToken } = useRefreshToken();


  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <>
      {(isLoading) && (
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
      
      <animated.div style={props} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <header className="bg-[#FBFCFB] shadow-sm border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                      <div className="flex">
                          <div className="flex-shrink-0 flex items-center">
                              <img className="h-8 w-auto" src="/images/logo.png" alt="Logo" />
                          </div>
                      </div>
                      <div className="flex items-center">
                          <Link 
                              to="/profile" 
                              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors"
                          >
                              Profile
                          </Link>
                          <button 
                              onClick={handleLogout} 
                              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                          >
                              Logout
                          </button>
                      </div>
                  </div>
              </div>
          </header>

          <main>
              <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                  <div className="bg-[#FBFCFB] overflow-hidden shadow-lg rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                          <div className="text-center mb-10">
                              <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Your Dashboard</h1>
                              <p className="text-slate-500">We're glad to have you here</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4 mx-auto">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                      </svg>
                                  </div>
                                  <h2 className="text-lg font-medium text-slate-800 text-center mb-2">Latest Updates</h2>
                                  <p className="text-slate-600 text-center">Check out what's new in our latest platform updates</p>
                              </div>
                              
                              <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4 mx-auto">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                  </div>
                                  <h2 className="text-lg font-medium text-slate-800 text-center mb-2">Quick Actions</h2>
                                  <p className="text-slate-600 text-center">Access frequently used features with a single click</p>
                              </div>
                              
                              <div className="bg-amber-50 border border-amber-100 rounded-lg p-6">
                                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white mb-4 mx-auto">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                      </svg>
                                  </div>
                                  <h2 className="text-lg font-medium text-slate-800 text-center mb-2">Security</h2>
                                  <p className="text-slate-600 text-center">Your account is protected with our advanced security measures</p>
                              </div>
                          </div>
                          
                          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                              <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                  </div>
                                  <div className="ml-3">
                                      <h3 className="text-sm font-medium text-slate-800">Getting Started</h3>
                                      <div className="mt-2 text-sm text-slate-600">
                                          <p>
                                              Welcome to your dashboard! This is where you'll find all the tools and resources you need. 
                                              To get started, you can:
                                          </p>
                                          <ul className="list-disc pl-5 mt-2 space-y-1">
                                              <li>Visit your <Link to="/profile" className="text-indigo-600 hover:text-indigo-800">profile page</Link> to manage your account settings</li>
                                              <li>Explore the features in the cards above</li>
                                              <li>Check back regularly for new updates and improvements</li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </main>
          
          <footer className="bg-[#FBFCFB] border-t border-slate-200 mt-12">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-500">© 2023 Your Company. All rights reserved.</p>
                      <div>
                          <button className="text-sm text-slate-500 hover:text-indigo-600">Terms</button>
                          <span className="mx-2 text-slate-300">|</span>
                          <button className="text-sm text-slate-500 hover:text-indigo-600">Privacy</button>
                      </div>
                  </div>
              </div>
          </footer>
      </animated.div>
  </>
  )
}

export default HomeScreen
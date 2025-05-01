import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignupScreen from './screens/SignupScreen'
import Guest from './middleware/guest'
import EmailVerificationScreen from './screens/EmailVerificationScreen'
import Auth from './middleware/auth'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import ChangePasswordScreen from './screens/ChangePasswordScreen'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Auth><HomeScreen /></Auth>} />
      <Route path='/profile' element={<Auth><ProfileScreen /></Auth>} />
      <Route path='/change_password' element={<Auth><ChangePasswordScreen /></Auth>} />

      <Route path='/login' element={<Guest><LoginScreen /></Guest>} />
      <Route path='/signup' element={<Guest><SignupScreen /></Guest>} />
      <Route path='/email_verification' element={<Guest><EmailVerificationScreen /></Guest>} />
    </Routes>
  )
}

export default Router
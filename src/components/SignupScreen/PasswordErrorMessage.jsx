import React from 'react'

const PasswordErrorMessage = ({validated, message}) => {
  return (
    <p className={`text-sm my-1.5 flex items-center ${validated ? 'text-green-600' : 'text-slate-600'}`}>
        {validated ? (
            <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ) : (
            <svg className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )}
        {message}
    </p>
  )
}

export default PasswordErrorMessage
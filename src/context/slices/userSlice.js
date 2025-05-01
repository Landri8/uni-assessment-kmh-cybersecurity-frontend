import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    email: null,
    email_verified: false,
    id: null,
}

const userSlice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        setUsername: (state, {payload}) => {
            state.username = payload;
        },

        setEmail: (state, {payload}) => {
            state.email = payload;
        },

        setEmailVerified: (state, {payload}) => {
            state.email_verified = payload;
        },

        setId: (state, {payload}) => {
            state.id = payload;
        },

        clearSession: (state) => {
            state = initialState
        }
    }
})

export const { 
    setUsername,
    setEmail,
    setEmailVerified,
    setId,
    clearSession
 } = userSlice.actions

export default userSlice.reducer
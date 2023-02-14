import {createSlice} from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        is_authenticated: false,
        hasData: false,
        userData: {
            role: localStorage.getItem('role') ?? 'normal',
        }

    },
    reducers: {
        invokeToken(state, action) {
            localStorage.removeItem("role");
            state.accessToken = null;
            state.is_authenticated = false;
            state.hasData = false;
            state.userData = {}
        },
        setOrUpdateAuthenticationInfo(state, action) {
            state.is_authenticated = true;
            state.hasData = true;
            localStorage.setItem("role", action.payload.data.role);
            state.accessToken = action.payload.accessToken;
            state.userData = action.payload.data;
        },
        updateUserData(state, action) {
            state.hasData = true;
            state.userData = action.payload.data;
        }

    },
})


export const {invokeToken, setOrUpdateAuthenticationInfo, updateUserData} = authSlice.actions

export default authSlice.reducer
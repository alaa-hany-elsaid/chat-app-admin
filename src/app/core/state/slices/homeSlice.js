import {createSlice} from '@reduxjs/toolkit'

export const homeSlice = createSlice({
    name: 'normal', initialState: {
        init: false, chatsInit: false, usersInit: false, invitationsInit: false, chats: [], invitations: [], users: []
    }, reducers: {
        updateInit(state, action) {
            state[action.payload.key] = action.payload.value;
        }, setChats(state, action) {
            state.chats = action.payload
            state.chatsInit = true;
        }, setUsers(state, action) {
            state.users = action.payload
            state.usersInit = true;
        }, setInvitations(state, action) {
            state.invitations = action.payload
            state.invitationsInit = true;
        }
    },
})


export const {updateInit, setChats, setInvitations, setUsers} = homeSlice.actions

export default homeSlice.reducer
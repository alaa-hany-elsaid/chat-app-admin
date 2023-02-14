import {createSlice} from '@reduxjs/toolkit'

export const chatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chatsPagination: {
            count: 0,
            rows: [],
        },
        invitationsPagination: {
            count: 0,
            rows: [],
        },
        chatsInit: false,
        invitationInit: false,

    },
    reducers: {
        updateChats(state, action) {
            state.chatsPagination = action.payload
            state.chatsInit = true;
        },
        updateInvitations(state, action) {

            state.invitationsPagination = action.payload
            state.invitationInit = true;
        },
        revokeChatInit(state) {
            state.chatsInit = false;
        },
        revokeInvitationInit(state) {
            state.invitationInit = false;
        }
    },
})


export const {updateChats, updateInvitations, revokeChatInit , revokeInvitationInit} = chatsSlice.actions

export default chatsSlice.reducer
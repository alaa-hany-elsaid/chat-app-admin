import {createSlice} from '@reduxjs/toolkit'

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        usersPagination: {
            count: 0,
            rows: [],
        },
        page: 1,
        limit: 10,
        search: "",
        init: false,

    },
    reducers: {
        updateUsers(state, action) {
            state.usersPagination = action.payload
            state.init = true;
        },
        updateSearch(state, action) {
            state.search = action.payload
        },
        updatePage(state, action) {
            state.page = action.payload
        },
        updatelimit(state, action) {
            state.limit = action.payload
        }
    },
})


export const {updateUsers , updateSearch , updatePage , updatelimit} = usersSlice.actions

export default usersSlice.reducer
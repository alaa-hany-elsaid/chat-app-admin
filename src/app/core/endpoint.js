const base = `/api`
const endpoints = {
    auth: {
        login: `${base}/auth/login`,
        register: `${base}/auth/register`,
        profile: `${base}/auth/profile`,
        logout: `${base}/auth/logout`,
    },
    users: {
        r: `${base}/users/`,
        chats: `${base}/users/chats`
    },
    chats: {
        base: `${base}/chats/`,
        invitations: `${base}/chats/invitations`,
        users: `${base}/chats/users`
    }
}

export {endpoints} ;
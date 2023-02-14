import {Login} from "../views/pages/guest/login.jsx";
import {Register} from "../views/pages/guest/register.jsx";
import {Profile} from "../views/pages/global/profile";
import {Users} from "../views/pages/global/users";
import {Logout} from "../views/pages/global/logout";
import {UserChats} from "../views/pages/user/user_chats";
import {AdminChats} from "../views/pages/admin/admin_chats";
import {Home} from "../views/pages/global/home";
import {Chat} from "../views/pages/global/chat";
// add every role's pages as an array then export it to use it in main file
const guestPages = [
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
        path: '/logout',
        element: <Logout/>
    }
];

const userPages = [
    {
        path: '/normal/',
        element: <Home/>
    },
    {
        path: '/normal/profile',
        element: <Profile/>
    },
    {
        path: '/normal/users',
        element: <Users/>
    },
    {
        path: '/normal/chats',
        element: <UserChats/>
    },
    {
        path: '/chats/:chatId',
        element: <Chat/>,

    }

];
const adminPages = [
    {
        path: '/admin/',
        element: <Home/>
    },
    {
        path: '/admin/profile',
        element: <Profile/>
    },
    {
        path: '/admin/users',
        element: <Users/>
    },
    {
        path: '/admin/chats',
        element: <AdminChats/>
    },

];


export {guestPages, adminPages, userPages}
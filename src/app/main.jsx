import './css/main.css';
import 'flowbite/dist/flowbite.min.css';
import React from 'react'
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import 'flowbite/dist/datepicker.min';
import 'flowbite/dist/flowbite.min';
import App from './views/App';
import {Provider} from "react-redux";
import store from "./core/state/store";
import {adminPages, guestPages, userPages} from "./core/pages";
import {Flowbite} from "flowbite-react";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    ...guestPages,
    ...adminPages,
    ...userPages

]);



ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Flowbite>
                <RouterProvider router={router}/>
        </Flowbite>
    </Provider>,
)

import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {invokeToken} from "../../../core/state/slices/authSlice";
import React from "react";
import {post} from "../../../core/http_client";
import {endpoints} from "../../../core/endpoint";

export function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    React.useEffect(() => {
        post(endpoints.auth.logout )
        dispatch(invokeToken())
        navigate('/');
    })

    return <></>

}
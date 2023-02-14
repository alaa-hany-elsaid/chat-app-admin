import {AppNavbar} from "../components/navbar";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {displayLoader, hideLoader} from "../../core/helpers";
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../core/http_client";
import {endpoints} from "../../core/endpoint";
import {invokeToken, updateUserData} from "../../core/state/slices/authSlice";

export function AuthLayout({children}) {
    const navigate = useNavigate();
    const is_authenticated = useSelector((state) => state.auth.is_authenticated)
    const hasData = useSelector((state) => state.auth.hasData)
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        if (!is_authenticated || !hasData) {
            displayLoader()
            get(endpoints.auth.profile).then((data) => {
                dispatch(updateUserData(data))
                setLoading(false)
            }).catch(() => {
                dispatch(invokeToken())
                navigate('/')
            }).finally(() => {
                hideLoader();
            })
        }


        setLoading(false);

    }, [is_authenticated])
    return (

        <div className="flex flex-col overflow-x-hidden min-h-screen">
            <AppNavbar/>
            <main className="h-full p-10">
                {isLoading ? <> </> : children}
            </main>
        </div>
    );

}
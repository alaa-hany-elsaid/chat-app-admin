import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { invokeToken, updateUserData } from "../../core/state/slices/authSlice";
import { displayLoader, hideLoader } from "../../core/helpers";
import { get } from "../../core/http_client";
import { endpoints } from "../../core/endpoint";

export default function GuestLayout({ props, children }) {
  const is_authenticated = useSelector((state) => state.auth.is_authenticated);
  const role = useSelector((state) => state.auth.userData.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    displayLoader();
    get(endpoints.auth.profile)
      .then((res) => {
        dispatch(updateUserData(res));
        navigate(`/${res.data.role}/`);
      })
      .catch(() => {
        dispatch(invokeToken());
        // navigate('/')
      })
      .finally(() => {
        hideLoader();
      });
  }, [is_authenticated]);

        displayLoader()
        get(endpoints.auth.profile).then((res) => {
            dispatch(updateUserData(res))
            navigate(`/${res.data.role}/`)
        }).catch(() => {
            dispatch(invokeToken())
            // navigate('/')
        }).finally(() => {
            hideLoader();
        })
    }, [is_authenticated]);


    return <div className="min-h-screen min-w-screen   overflow-x-hidden flex">
        {children}
    </div>;
}

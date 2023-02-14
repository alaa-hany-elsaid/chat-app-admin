import GuestLayout from "../../layout/guest";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {displayLoader, hideLoader} from "../../../core/helpers";
import {post} from "../../../core/http_client";
import {endpoints} from "../../../core/endpoint";
import {useDispatch} from "react-redux";
import {setOrUpdateAuthenticationInfo} from "../../../core/state/slices/authSlice";
import React from "react";
import Logo from '../../../assets/logo.svg';

export function Login({props, children}) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {register, handleSubmit, setError, setValue, clearErrors, formState: {errors}} = useForm();
    const onSubmit = data => {
        displayLoader()
        post(endpoints.auth.login, data, (resData) => {
            hideLoader();
            dispatch(setOrUpdateAuthenticationInfo(resData))
            navigate(`/${resData.data.role}/`)
        }, ({errors}) => {
            errors.forEach((error) => {
                setError(error.param, {
                    type: "custom",
                    message: error.msg
                })

            })
        }).then(() => {
            setValue('password', '');
        }).finally(() => {
            hideLoader();
        });

    };

    return (<GuestLayout>

        <div className="flex flex-col items-center justify-center px-6 py-8 m-auto  w-full sm:max-w-md lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src={Logo}
                     alt="logo"/>
                App Chat Admin
            </a>
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                email</label>
                            <input type="email" id="email"
                                   {...register("email", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="name@gmail.com"/>
                            {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.email?.type === 'required' ? 'This field is required' : errors.email?.message}
                            </p>}


                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                   {...register("password", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                            {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.password?.type === 'required' ? 'This field is required' : errors.password?.message}
                            </p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                           required=""/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember
                                        me</label>
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg"
                            type="submit">
                            Sign in
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <Link to="/register"
                                                             className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                            up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </GuestLayout>);
}
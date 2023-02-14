import {AuthLayout} from "../../layout/auth_layout";
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {post} from "../../../core/http_client";
import {endpoints} from "../../../core/endpoint";
import {displayLoader, hideLoader} from "../../../core/helpers";
import {updateUserData} from "../../../core/state/slices/authSlice";

const profile = yup.object().shape({
    firstName: yup.string().trim().min(3, "first name length should be at least 4 characters")
        .max(255, "first name cannot exceed more than 12 characters"),
    lastName: yup.string().trim().min(3, "last name length should be at least 4 characters")
        .max(255, "last name cannot exceed more than 12 characters"),
    email: yup.string().email("Field should contain a valid e-mail").max(255),
    phone: yup.string().trim().matches(/^[0-9]{10}$/, 'phone number must be correct'),
    password: yup.string()
        .matches(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})|(^$))/, 'Password must be at least 8 characters long and contain at least one capital letter and special character'),
    confirm_password: yup.string()
        .oneOf([yup.ref("password")], "Passwords do not match")

});

export function Profile() {

    const userData = useSelector((state) => state.auth.userData)
    const {register, handleSubmit, setError, setValue, formState: {errors}} = useForm({
        mode: "onTouched",
        resolver: yupResolver(profile)
    });

    const dispatch = useDispatch();
    const onSubmit = data => {
        data = Object.fromEntries(Object.entries(data).filter(([k, v]) => !!v))
        displayLoader();
        post(endpoints.auth.profile, data, (resData) => {
             dispatch(updateUserData(resData))
        } , ({errors}) => {
            errors.forEach((error) => {
                setError(error.param, {
                    type: "custom",
                    message: error.msg
                })

            })
        }).finally(() => {
            hideLoader();
        })
    };


    return <AuthLayout>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  w-full sm:max-w-md lg:py-0">
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Profile
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="first-name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                First name</label>
                            <input type="text" name="name" id="first-name"
                                   defaultValue={userData.firstName}
                                   {...register("firstName", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="First name"/>
                            {errors.firstName && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.firstName?.type === 'required' ? 'This field is required' : errors.firstName?.message}
                            </p>}
                        </div>
                        <div>
                            <label htmlFor="last-name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                Last name</label>
                            <input type="text" name="lastName" id="last-name"
                                   defaultValue={userData.lastName}
                                   {...register("lastName", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Last Name" required=""/>
                            {errors.lastName && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.lastName?.type === 'required' ? 'This field is required' : errors.lastName?.message}
                            </p>}
                        </div>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                email</label>
                            <input type="email" id="email"
                                   defaultValue={userData.email}
                                   {...register("email", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="name@gmail.com"/>
                            {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.email?.type === 'required' ? 'This field is required' : errors.email?.message}
                            </p>}
                        </div>
                        <div>
                            <label htmlFor="phone"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                phone</label>
                            <input type="text" name="phone" id="phone"
                                   autoComplete="phone"
                                   defaultValue={userData.phone}
                                   {...register("phone", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="xxxxxxxxxx" required=""/>
                            {errors.phone && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.phone?.type === 'required' ? 'This field is required' : errors.phone?.message}
                            </p>}
                        </div>

                        <div>
                            <label htmlFor="password"

                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                   autoComplete="new-password"
                                   {...register("password")}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                            {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.password?.type === 'required' ? 'This field is required' : errors.password?.message}
                            </p>}
                        </div>


                        <div>
                            <label htmlFor="confirm-password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                                Password</label>
                            <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••"
                                   autoComplete="new-password"
                                   {...register("confirm_password")}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                            {errors.confirm_password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.confirm_password?.type === 'required' ? 'This field is required' : errors.confirm_password?.message}
                            </p>}
                        </div>

                        <button
                            className="w-full text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg"
                            type="submit"><span
                            className="flex items-center rounded-md text-sm px-4 py-2">Update</span>
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </AuthLayout>
}
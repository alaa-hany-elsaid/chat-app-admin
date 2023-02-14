import GuestLayout from "../../layout/guest";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {displayLoader, hideLoader} from "../../../core/helpers";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from "yup";
import {endpoints} from "../../../core/endpoint";
import {post} from "../../../core/http_client";
import {setOrUpdateAuthenticationInfo} from "../../../core/state/slices/authSlice";
import {useDispatch} from "react-redux";
import Logo from '../../../assets/logo.svg';
const formSchema = Yup.object().shape({
    firstName: Yup.string().trim().min(3, "first name length should be at least 4 characters")
        .max(255, "first name cannot exceed more than 12 characters").required(),
    lastName: Yup.string().trim().min(3, "last name length should be at least 4 characters").required()
        .max(255, "last name cannot exceed more than 12 characters").required(),
    email: Yup.string().email("Field should contain a valid e-mail").max(255),
    phone: Yup.string().trim().matches(/^[0-9]{10}$/, 'phone number must be correct'),
    password: Yup.string()
        .required("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Password must be at least 8 characters long and contain at least one capital letter and special character'),
    confirm_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords do not match")
});

export function Register({props, children}) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {register, handleSubmit, setError, setValue, formState: {errors}} = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
    });


    const onSubmit = data => {
        displayLoader()
        post(endpoints.auth.register, data, (resData) => {
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
            setValue('confirm_password', '');
        }).finally(() => {
            hideLoader();
        });

    };
    return (<GuestLayout>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  w-full sm:max-w-md lg:py-0">
            <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src={Logo}
                     alt="logo"/>
                App Chat Admin
            </a>
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create New Account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="first-name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                First name</label>
                            <input type="text" name="name" id="first-name"
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
                                   {...register("password", {required: true})}
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
                            <input type="password" name="confirm-password" id="password" placeholder="••••••••"
                                   {...register("confirm_password", {required: true})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                            {errors.confirm_password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.confirm_password?.type === 'required' ? 'This field is required' : errors.confirm_password?.message}
                            </p>}
                        </div>

                        <button
                            className="w-full text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg"
                            type="submit"><span
                            className="flex items-center rounded-md text-sm px-4 py-2">Sign up</span>
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already registered? <Link to="/login"
                                                      className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                            in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </GuestLayout>);
}
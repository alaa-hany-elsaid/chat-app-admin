import {AuthLayout} from "../../layout/auth_layout";

import {Pagination} from "flowbite-react";
import {UserAvatar} from "../../components/user_avatar";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../../core/http_client";
import {endpoints} from "../../../core/endpoint";
import {displayLoader, hideLoader} from "../../../core/helpers";
import {updatePage, updateSearch, updateUsers} from "../../../core/state/slices/usersSlice";
import {ChatModal} from "../../components/chat_modal";

export function Users() {
    const usersPagination = useSelector((state) => state.users.usersPagination)
    const isInit = useSelector((state) => state.users.init)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState('');
    const page = useSelector((state) => state.users.page)
    const search = useSelector((state) => state.users.search);
    const limit = 10;

    const [startChatWith, setStartChatWith] = useState({})

    const getUsers = () => {
        displayLoader()
        get(`${endpoints.users.r}?page=${page}&limit=${limit}&search=${search}`).then((data) => {
            dispatch(updateUsers(data))
        }).catch(() => {
        }).finally(() => {
            hideLoader()
        })
    }


    useEffect(() => {
        if (isInit) {
            setIsLoading(false);
            return;
        }
        displayLoader()
        get(`${endpoints.users.r}?page=${page}&limit=${limit}&search=${search}`).then((data) => {
            dispatch(updateUsers(data))
        }).catch(() => {
        }).finally(() => {
            setIsLoading(false);
            hideLoader()
        })
    }, [])


    const onPageChange = (p) => {
        if (p !== page) {
            dispatch(updatePage(p))
            getUsers();
        }

    }


    return <AuthLayout>


        {!!startChatWith.id ? <ChatModal show={startChatWith.id > 0} defaultSearch={startChatWith.firstName}
                                         defaultSelectedUsers={[startChatWith.id]} onClose={() => {
                setStartChatWith({})
            }}/>
            :
            <></>
        }

        <div className="flex flex-col">

            <div className="mb-5">
                <label htmlFor="default-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                           defaultValue={search}
                           onKeyDown={(e) => e.key === 'Enter' && getUsers()}
                           onChange={(evt) => dispatch(updateSearch(evt.target.value))}
                           className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search names, email"/>
                    <button type="button"
                            onClick={() => getUsers()}
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                    </button>
                </div>
            </div>

            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

            <div className="mb-5">

                <h4 className="text-2xl font-bold dark:text-white">Filter By</h4>
                <div className="flex flex-row flex-wrap justify-between my-4 max-w-2xl mx-auto">

                    <div className="flex items-center mb-4">
                        <input id="name-filter" type="radio" name="filter"
                               defaultChecked={filterType === 'name'}
                               onChange={(e) => {
                                   setFilterType('name')
                               }}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="name-filter"
                               className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Name
                        </label>
                    </div>

                    <div className="flex items-center mb-4">
                        <input id="join-date-filter" type="radio" name="filter"
                               defaultChecked={filterType === 'join_date'}
                               onChange={(e) => {
                                   setFilterType('join_date')
                               }}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="join-date-filter"
                               className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Join Date
                        </label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="reset-filter" type="radio" name="filter"
                               onChange={(e) => {
                                   setFilterType('')
                               }}
                               defaultChecked={filterType === ''}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="reset-filter"
                               className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Default
                        </label>
                    </div>
                </div>
            </div>

            {
                isLoading ? <></> : <>

                    <div className="flex flex-row justify-evenly flex-wrap">
                        {
                            [...usersPagination.rows].sort((a, b) => {
                                if (filterType === 'name') {
                                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
                                } else if (filterType === 'join_date') {
                                    return new Date(a.createdAt) - new Date(b.createdAt)
                                }
                                return 0;
                            }).map((user) => {
                                return (<UserAvatar key={user.id} user={user} onStartChat={() => {
                                    setStartChatWith(user)
                                }}/>)
                            })
                        }


                    </div>

                    <div className="flex items-center justify-center text-center">
                        {usersPagination.count / limit > 1 ? <Pagination
                            currentPage={page}
                            layout="pagination"
                            onPageChange={onPageChange}
                            showIcons={true}
                            totalPages={parseInt((usersPagination.count / limit).toString())}
                            previousLabel="Go back"
                            nextLabel="Go forward"
                        /> : <></>
                        }
                    </div>
                </>
            }
        </div>


    </AuthLayout>
}
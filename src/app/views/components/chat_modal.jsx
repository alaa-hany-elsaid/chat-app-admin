import {Modal, Spinner} from "flowbite-react";
import {get, post} from "../../core/http_client";
import {endpoints} from "../../core/endpoint";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {useNavigate} from "react-router-dom";
import {revokeChatInit} from "../../core/state/slices/chatsSlice";
import {useDispatch} from "react-redux";
import {updateInit} from "../../core/state/slices/homeSlice";

const formSchema = Yup.object().shape({
    subject: Yup.string().trim().min(4, "subject length should be at least 4 characters")
        .max(255, "subject cannot exceed more than 12 characters").required(),
});

export function ChatModal({
                              show = false,
                              defaultSelectedUsers = [],
                              defaultSearch = '',
                              onClose = () => {
                              }
                          }) {

    const {register, handleSubmit, setError, formState: {errors}} = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
    });
    const navigator = useNavigate()
    const dispatch = useDispatch()
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(defaultSelectedUsers);
    const [search, setSearch] = useState(defaultSearch);
    const [isLoading, setIsLoading] = useState(false);

    const onCloseCreationModal = () => {
        onClose();
        setSelectedUsers([])
    }


    const getUsers = () => {
        setIsLoading(true)
        get(`${endpoints.users.r}?limit=100&search=${search}`).then((data) => {
            setUsers(data.rows)
            setSelectedUsers(data.rows.filter((user) => selectedUsers.includes(user.id)).map((u) => u.id))
        }).catch(() => {
        }).finally(() => {
            setIsLoading(false)
        })
    }


    const toggle = (id) => {
        if (selectedUsers.includes(id))
            setSelectedUsers([...selectedUsers.filter((userId) => userId !== id)])
        else
            setSelectedUsers([...selectedUsers, id])
    }


    useEffect(() => {
    })
    const onCreate = data => {
        if (isLoading) return;
        if (selectedUsers.length === 0) {
            setError('selectedUsers', {
                type: "custom",
                message: "You should select at least one user"
            })
            return;
        }
        data.selectedUsers = selectedUsers;
        setIsLoading(true);
        post(endpoints.chats.base, data, ({data}) => {
            dispatch(revokeChatInit())
            dispatch(updateInit({key: 'chatsInit', value: false}))
            navigator(`/chats/${data.id}`)
        }, ({errors}) => {

            errors.forEach((error) => {
                setError(error.param, {
                    type: "custom",
                    message: error.msg
                })

            })

        }).finally(() => {
            setIsLoading(false);
        })

    }


    useEffect(() => {
        getUsers();
    }, [])


    return <Modal
        show={show}
        size="2xl"
        onClose={onCloseCreationModal}
    >
        <Modal.Header>
            Create Chat
        </Modal.Header>
        <Modal.Body>
            <div className="mb-6">
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Subject
                </label>
                <input id="subject"
                       {...register("subject", {required: true, min: 4, max: 99})}
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                       placeholder="Subject"/>
                {errors.subject && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.subject?.type === 'required' ? 'This field is required' : errors.subject?.message}
                </p>}
            </div>
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
                           onKeyDown={(e) => e.key === 'Enter' && !isLoading && getUsers()}
                           onChange={(evt) => {
                               setSearch(evt.target.value)
                           }}

                           className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search names, email"/>
                    <button type="button"
                            onClick={() => !isLoading && getUsers()}
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                    </button>
                    <input type='hidden'    {...register("selectedUsers")} />
                    {errors.selectedUsers && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.selectedUsers?.type === 'required' ? 'This field is required' : errors.selectedUsers?.message}
                    </p>}
                </div>
            </div>


            <div className="max-h-72  overflow-y-auto px-4">
                {isLoading ? <div className="flex justify-center h-[18rem] items-center">
                    <Spinner aria-label="Center-aligned Loading spinner" size="xl"/>
                </div> : users.map(
                    (user) => {
                        return <div key={user.id} onClick={() => {
                            toggle(user.id)
                        }}
                                    className='flex flex-row justify-between items-center mt-2 rounded-lg p-4 dark:hover:bg-gray-600 hover:bg-gray-100 hover:cursor-pointer'>
                            <label htmlFor={"checked-checkbox-" + user.id}
                                   className="flex items-center space-x-4 hover:cursor-pointer">
                                <div
                                    className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor"
                                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div className="font-medium dark:text-white">
                                    <div>{user.firstName + ' ' + user.lastName} </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {`Email : ${user.email}`}
                                    </div>
                                </div>
                            </label>
                            <input checked={selectedUsers.includes(user.id)} onChange={() => {
                                toggle(user.id)
                            }} id={"checked-checkbox-" + user.id} type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                    })

                }
            </div>
        </Modal.Body>
        <Modal.Footer>
            <button type="button"
                    onClick={handleSubmit(onCreate)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                Create
            </button>
            <button type="button"
                    onClick={onCloseCreationModal}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Cancel
            </button>
        </Modal.Footer>
    </Modal>
}
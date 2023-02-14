import {Modal, Spinner} from "flowbite-react";
import React, {useState} from "react";
import {get} from "../../core/http_client";
import {endpoints} from "../../core/endpoint";

export function AddUsersModal({
                                  show = false,
                                  onClose = () => {
                                  },
                                  expectedUsers = [],
                                  onAdd = (selectedUsers) => {
                                  }
                              }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toggle = (id) => {
        if (selectedUsers.includes(id))
            setSelectedUsers([...selectedUsers.filter((userId) => userId !== id)])
        else
            setSelectedUsers([...selectedUsers, id])
    }

    const getUsers = () => {
        setIsLoading(true)
        get(`${endpoints.users.r}?limit=100&search=${search}`).then((data) => {
            setUsers(data.rows.filter((user) => !expectedUsers.includes(user.id)))
            setSelectedUsers(users.filter((user) => selectedUsers.includes(user.id)).map((u) => u.id))
        }).catch(() => {
        }).finally(() => {
            setIsLoading(false)
        })
    }


    return (
        <Modal
            show={show}
            size="2xl"
            onClose={onClose}
        >
            <Modal.Header>
                Add Users
            </Modal.Header>
            <Modal.Body>
                {isLoading ? <div className="flex justify-center h-[10rem] items-center">
                        <Spinner aria-label="Center-aligned Loading spinner" size="xl"/>
                    </div> :
                    <div className="flex flex-col">
                        <div className="mb-5">
                            <label htmlFor="default-search"
                                   className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                         fill="none"
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
                                                <svg className="absolute w-12 h-12 text-gray-400 -left-1"
                                                     fill="currentColor"
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

                    </div>
                }
            </Modal.Body>


            <Modal.Footer>
                <button type="button"
                        onClick={() => {
                            onAdd(selectedUsers)
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Add
                </button>
                <button type="button"
                        onClick={() => {
                            onClose()
                        }}
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );

}
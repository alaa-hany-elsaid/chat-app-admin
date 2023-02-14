import {Pagination, Table} from "flowbite-react";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../core/http_client";
import {endpoints} from "../../core/endpoint";
import {updateChats} from "../../core/state/slices/chatsSlice";
import {setChats} from "../../core/state/slices/homeSlice";

export function ChatTable({
                              slice = 'chats',
                              filterable = false,
                              withPagination = true, beforeLoad = () => {
    }, afterLoad = () => {
    }
                          }) {


    const chatsPagination = useSelector((state) => {
        return slice === 'chats' ? state.chats.chatsPagination : state.home.chats
    })
    const isChatsInit = useSelector((state) => {
        return slice === 'chats' ? state.chats.chatsInit : state.home.chatsInit
    })
    const [filterType, setFilterType] = useState('');
    const dispatch = useDispatch();

    const [chatsPage, setChatsPage] = useState(1)

    const getChats = () => {

        beforeLoad()

        get(`${endpoints.chats.base}?page=${chatsPage}`).then((data) => {
            console.log(data)
            if (slice === 'chats')
                dispatch(updateChats(data))
            else
                dispatch(setChats(data.rows))
        }).finally(() => {
            afterLoad()
        })


    }

    useEffect(() => {
        if (!isChatsInit) {
            getChats();
        }

    })

    return <>
        {
            filterable ? <>
                <div className="mb-5">

                    <h4 className="text-2xl font-bold dark:text-white">Filter By</h4>
                    <div className="flex flex-row flex-wrap justify-between my-4 max-w-2xl mx-auto">

                        <div className="flex items-center mb-4">
                            <input id="name-filter" type="radio" name="filter"
                                   defaultChecked={filterType === 'subject'}
                                   onChange={(e) => {
                                       setFilterType('subject')
                                   }}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="name-filter"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Subject
                            </label>
                        </div>

                        <div className="flex items-center mb-4">
                            <input id="join-date-filter" type="radio" name="filter"
                                   defaultChecked={filterType === 'last_message'}
                                   onChange={(e) => {
                                       setFilterType('last_message')
                                   }}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="join-date-filter"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Last Message
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
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
            </> : <></>
        }
        <Table>
            <Table.Head>
                <Table.HeadCell>
                    Subject
                </Table.HeadCell>
                <Table.HeadCell>
                    By
                </Table.HeadCell>
                <Table.HeadCell>
                          <span className="sr-only">
                            Actions
                          </span>
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                <>
                    {[...(slice === 'chats' ? chatsPagination.rows : chatsPagination)].sort((a, b) => {
                        if (filterType === 'subject') {
                            return `${a.subject}`.localeCompare(`${b.subject}`)
                        } else if (filterType === 'last_message') {
                            return b.lastMessage.id - a.lastMessage.id;
                        }
                        return 0;
                    }).map((chat) => {
                        return (

                            <Table.Row key={chat.id}
                                       className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell
                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {chat.subject}
                                </Table.Cell>
                                <Table.Cell
                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {chat.owner.firstName + ' ' + chat.owner.lastName}
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        chat.status === 'active' ?
                                    <Link
                                        to={`/chats/${chat.id}`}
                                        className="font-medium text-blue-600 hover:underline dark:text-blue-500 text-center"
                                    >
                                        Join
                                    </Link>
                                            :
                                            <span className="text-xl font-bold text-red-400">
                                                { chat.status }
                                            </span>
                                    }
                                </Table.Cell>
                            </Table.Row>)
                    })}
                </>
            </Table.Body>
        </Table>
        {withPagination ? <div className="flex items-center justify-center text-center mt-2">
                <Pagination
                    currentPage={chatsPage}
                    layout="pagination"
                    onPageChange={(p) => {
                        setChatsPage(p)
                        getChats();
                    }}
                    showIcons={true}
                    totalPages={Math.ceil(chatsPagination.count / 10)}
                    previousLabel="Go back"
                    nextLabel="Go forward"
                />
            </div>
            : <></>}
    </>

}
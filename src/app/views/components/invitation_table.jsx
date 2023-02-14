import {Pagination, Table} from "flowbite-react";
import {InvitationActions} from "./invitation_actions";
import React, {useEffect, useState} from "react";
import {get} from "../../core/http_client";
import {endpoints} from "../../core/endpoint";
import {updateInvitations} from "../../core/state/slices/chatsSlice";
import {useDispatch, useSelector} from "react-redux";
import {setInvitations} from "../../core/state/slices/homeSlice";

export function InvitationTable({
                                    slice = 'chats',
                                    withPagination = true, beforeLoad = () => {
    }, afterLoad = () => {
    }
                                }) {

    const invitationsPagination = useSelector(
        // (state) => state.chats.invitationsPagination
        (state) => {
            return slice === 'chats' ? state.chats.invitationsPagination : state.home.invitations
        }
    )
    const isInvitationsInit = useSelector(
        //    (state) => state.chats.invitationInit
        (state) => {
            return slice === 'chats' ? state.chats.invitationInit : state.home.invitationInit
        }
    )
    const [invitationsPage, setInvitationsPage] = useState(1)

    const dispatch = useDispatch();
    const getInvitations = () => {
        beforeLoad()
        get(`${endpoints.chats.invitations}?page=${invitationsPage}`).then((data) => {
            if(slice === 'chats'){
                dispatch(updateInvitations(data))
            }else {
                dispatch(setInvitations(data.rows))
            }

        }).finally(() => {
            afterLoad()
        })

    }


    useEffect(() => {

        if (!isInvitationsInit) {
            getInvitations()
        }

    }, [isInvitationsInit])


    return <div >
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
                    {(slice === 'chats' ? invitationsPagination.rows : invitationsPagination).map((chat, index) => {
                        return (<Table.Row key={chat.id}
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
                                <InvitationActions chat={chat} index={index}/>
                            </Table.Cell>
                        </Table.Row>)
                    })}
                </>
            </Table.Body>
        </Table>
        {
            withPagination ? <div className="flex items-center justify-center text-center mt-2">
                <Pagination
                    currentPage={invitationsPage}
                    layout="pagination"
                    onPageChange={(p) => {
                        setInvitationsPage(p)
                        getInvitations();
                    }}
                    showIcons={true}
                    totalPages={Math.ceil(invitationsPagination.count / 10)}
                    previousLabel="Go back"
                    nextLabel="Go forward"
                />
            </div> : <></>
        }

    </div>

}
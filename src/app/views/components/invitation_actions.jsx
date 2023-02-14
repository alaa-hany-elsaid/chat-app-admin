import {useState} from "react";
import {Link} from "react-router-dom";
import {post} from "../../core/http_client";
import {endpoints} from "../../core/endpoint";
import {useDispatch} from "react-redux";
import {revokeInvitationInit} from "../../core/state/slices/chatsSlice";
import {updateInit} from "../../core/state/slices/homeSlice";


export function InvitationActions({chat, index}) {

    const [status, setStatus] = useState('invited')

    const dispatch = useDispatch();
    const reject = (chatId) => {

        post(`${endpoints.chats.base}${chatId}` , {} , () => {
            dispatch(revokeInvitationInit())
            dispatch(updateInit({ key : 'invitationsInit' , value : false }))
            setStatus('reject_invitation')
        }).catch(()=> {

        })

    }


    return <div className="flex flex-row">

        {
            status === 'invited' ? <>
                <Link
                        to={`/chats/${chat.id}`}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Accept
                </Link>
                <button type="button"
                        onClick={() => {
                            reject(chat.id)
                        }}
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                    Reject
                </button>
            </> : (  status === 'reject_invitation' ?  <>
                <h4 className="text-xl font-bold text-red-400 "> Rejected </h4>
            </> : <>
            </> )
        }

    </div>;


}
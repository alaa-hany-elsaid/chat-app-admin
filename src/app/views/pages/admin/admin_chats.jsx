import React, {useState} from "react";
import {Spinner} from "flowbite-react";
import {ChatTable} from "../../components/chat_table";
import {AuthLayout} from "../../layout/auth_layout";


export function AdminChats() {

    const [isLoading, setIsLoading] = useState(false)

    return <AuthLayout>
        {

            isLoading ? <div className='flex flex-row justify-center items-center h-[20rem]'>
                    <Spinner aria-label="Center-aligned Loading spinner" size="xl"/>
                </div> :
                <div className="pt-4 overflow-x-auto">
                    <ChatTable filterable={true} withPagination={true} beforeLoad={() => {
                        setIsLoading(true)
                    }} afterLoad={() => {
                        setIsLoading(false)
                    }}/>

                </div>
        }
    </AuthLayout>;
}
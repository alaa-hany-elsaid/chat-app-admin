import Avatar from "../../assets/avatar.svg";

export function UserAvatar({user, onStartChat}) {
    return <div
        className="w-[24rem] bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 px-4 m-4 ">
        <div className="flex flex-col items-center py-10 px-2">
            <img className="w-32 h-32 mb-3 rounded-full shadow-lg"
                 src={Avatar}
                 alt="Teacher"/>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstName + " " + user.lastName}</h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
            <div className="flex mt-4 justify-center md:mt-6">
                <button
                    onClick={() => onStartChat()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Start
                    Chat
                </button>
            </div>
        </div>
    </div>
}
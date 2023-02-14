import { AuthLayout } from "../../layout/auth_layout";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersLogo from "../../../assets/users.svg";
import { Alert, Spinner, Table } from "flowbite-react";
import { UserActionsModal } from "../../components/user_actions_modal";
import PlusIcon from "../../../assets/plus.svg";
import { AddUsersModal } from "../../components/add_users_modal";

export function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [chat, setChat] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [active, setActive] = useState(0);
  const [showCurrentUserAction, setShowCurrentUserAction] = useState(false);
  const [showAddUsersModal, setShowAddUsersModal] = useState(false);
  const [currentUserAction, setCurrentUserAction] = useState({});

  if (!window.socket || window.socket.disconnected) {
    window.socket = io({
      auth: {
        chatId: chatId,
      },
    });
  }

  socket.on("message", (data) => {
    setMessages([...messages, data]);
  });

  socket.on("init-info", (info) => {
    setChat(info.chat);
    setCurrentUser(info.user);
    setUsers(info.users ?? []);
    setMessages(info.messages ?? []);
    setIsLoading(false);
  });

  socket.on("update-users", (users) => {
    setUsers(users);
  });
  socket.on("update-messages", (messages) => {
    setMessages(messages);
  });

  socket.on("connect_error", (error) => {
    try {
      const res = JSON.parse(error.message);
      if (res.code === 402) navigate("/");
    } catch (e) {}
  });

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const onSend = (data) => {
    socket.emit("message", data, (res) => {
      if (res.code === 200) {
        setMessages([
          ...messages,
          {
            content: data,
            sender: currentUser,
            ...res,
          },
        ]);
      } else if (res.code === 403) {
        navigate("/");
      } else if (res.code === 404 || res.code === 400) {
        setShowAlert(true);
        setAlertMessage(res.description);
        setAlertColor("failure");
      }
    });
  };

  const deleteMessage = (messageId) => {
    socket.emit("delete-message", messageId, (res) => {
      setShowAlert(true);
      setAlertMessage(res.description);
      if (res.code === 200) {
        setAlertColor("info");
      } else if (res.code === 404 || res.code === 400) {
        setAlertColor("failure");
      }
    });
  };

  return (
    <AuthLayout>
      {showAlert ? (
        <Alert
          color={alertColor}
          onDismiss={() => {
            setShowAlert(false);
          }}
        >
          <span>
            <span className="font-medium">{alertMessage}</span>
          </span>
        </Alert>
      ) : (
        <></>
      )}

      {showAddUsersModal ? (
        <AddUsersModal
          show={showAddUsersModal}
          onClose={() => {
            setShowAddUsersModal(false);
          }}
          expectedUsers={users.map((u) => u.id)}
          onAdd={(selectedUsers) => {
            socket.emit("add-users", selectedUsers, (res) => {
              setShowAddUsersModal(false);
              setAlertMessage(res.description);
              if (res.code === 200) {
                setAlertColor("info");
              } else {
                setAlertColor("failure");
              }
              setShowAlert(true);
            });
          }}
        />
      ) : (
        <></>
      )}

      {currentUserAction.id ? (
        <UserActionsModal
          chatId={chat.id}
          show={showCurrentUserAction}
          onClose={(status) => {
            setShowCurrentUserAction(false);
            console.log(currentUserAction, status);
            setCurrentUserAction({});
            const cu = currentUserAction;
            setUsers([
              ...users.filter((u) => u.id !== cu.id),
              { ...cu, status },
            ]);
          }}
          user={currentUserAction}
          socket={window.socket}
        />
      ) : (
        <></>
      )}
      <div className="my-2 border-b border-gray-300 dark:border-gray-700">
        <ul
          className="flex  justify-between -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          <li className="mr-2 w-5/12" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 text-lg sm:text-xl  rounded-t-lg ${
                active === 0
                  ? "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:text-gray-300"
              } `}
              type="button"
              role="tab"
              aria-controls="chats"
              aria-selected="false"
              onClick={() => {
                setActive(0);
              }}
            >
              Chat
            </button>
          </li>
          <li className="mr-2 w-5/12" role="presentation">
            <button
              className={`inline-block p-4 border-b-2  text-lg sm:text-xl   rounded-t-lg ${
                active === 1
                  ? "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600  dark:text-gray-300 hover:border-gray-400 dark:hover:text-gray-300"
              } `}
              type="button"
              role="tab"
              aria-controls="Invitations"
              aria-selected="false"
              onClick={() => {
                setActive(1);
              }}
            >
              Users
            </button>
          </li>
        </ul>
      </div>

      {isLoading ? (
        <div className="flex flex-row justify-center items-center h-[20rem]">
          <Spinner aria-label="Center-aligned Loading spinner" size="xl" />
        </div>
      ) : (
        <div className="py-4">
          <div
            className={` ${
              active !== 0 ? "hidden" : ""
            } flex flex-row justify-center items-center`}
          >
            <div className="container mx-auto">
              <div className=" border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="">
                    <div className="flex justify-between p-3 border-b border-gray-300 text-blue-600 dark:border-gray-700">
                      <div className="relative flex items-center items-center">
                        <img
                          className="object-cover w-10 h-10 rounded-full bg-blue-200 "
                          src={UsersLogo}
                          alt="users"
                        />
                        <span className="block ml-2 font-bold text-gray-900 dark:text-white ">
                          {chat.subject}
                        </span>
                      </div>

                      {currentUser.role === "admin" ||
                      currentUser.id === chat.createdBy ? (
                        <div
                          className="hover:cursor-pointer"
                          onClick={() => {
                            setShowAddUsersModal(true);
                          }}
                        >
                          <img
                            className="object-cover w-8 h-8 rounded-full "
                            src={PlusIcon}
                            alt="add users"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="relative w-full p-6   h-[28rem] md:h-[30rem]  overflow-y-auto flex flex-col-reverse ">
                      <ul className="space-y-2">
                        {messages.map((message) => {
                          return (
                            <li
                              key={message.id + Math.random()}
                              className={`flex items-end ${
                                message.sender.id === currentUser.id
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div className="flex flex-col">
                                {message.sender.id === currentUser.id ? (
                                  <> </>
                                ) : (
                                  <div className="py-1">
                                    <span className="text-xs text-gray-900 dark:text-gray-400">
                                      By{" "}
                                    </span>
                                    <span className="my-2 font-medium text-xs text-blue-600 hover:underline dark:text-blue-500 hover:cursor-pointer">
                                      {" "}
                                      {message.sender.role === "admin"
                                        ? "Admin"
                                        : message.sender.firstName +
                                          " " +
                                          message.sender.lastName}{" "}
                                    </span>
                                  </div>
                                )}
                                <div
                                  className={`relative max-w-xs px-6 py-2 text-white ${
                                    message.sender.id === currentUser.id
                                      ? message.code && message.code !== 200
                                        ? "bg-red-700"
                                        : "bg-blue-700"
                                      : "bg-gray-500 dark:bg-gray-700"
                                  }   rounded-full shadow`}
                                >
                                  <span className="block">
                                    {message.content}
                                  </span>
                                </div>
                                {message.code && message.code !== 200 ? (
                                  <span className="self-end px-6 text-xs py-1 text-red-500">
                                    {message.description}
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>
                              {currentUser.role === "admin" ? (
                                <div
                                  onClick={() => {
                                    deleteMessage(message.id);
                                  }}
                                >
                                  <svg
                                    className="w-8 h-8 px-2 text-red-400 hover:cursor-pointer "
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                  >
                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                  </svg>
                                </div>
                              ) : (
                                <></>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between w-full p-3 border-t border-gray-300 dark:border-gray-700">
                      <input
                        value={currentMessage}
                        type="text"
                        placeholder="Message"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && currentMessage.trim()) {
                            onSend(currentMessage);
                            setCurrentMessage("");
                          }
                        }}
                        onChange={({ target }) => {
                          const message = target.value.trim();
                          if (message.length > 0) {
                            setCurrentMessage(target.value);
                          }
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-3 rounded-lg "
                        name="message"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (currentMessage.trim()) {
                            onSend(currentMessage);
                            setCurrentMessage("");
                          }
                        }}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${active !== 1 ? "hidden" : ""}`}>
            <Table>
              <Table.Head>
                <Table.HeadCell>name</Table.HeadCell>
                <Table.HeadCell>email</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Actions</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <>
                  {[...users]
                    .sort((a, b) => a.id - b.id)
                    .map((user) => {
                      return (
                        <Table.Row
                          key={user.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {user.firstName + " " + user.lastName}
                          </Table.Cell>
                          <Table.Cell>{user.email}</Table.Cell>
                          <Table.Cell>
                            {currentUser.role === "admin" ||
                            currentUser.id === chat.createdBy ? (
                              <button
                                onClick={() => {
                                  setCurrentUserAction(user);
                                  setShowCurrentUserAction(true);
                                }}
                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                              >
                                Actions
                              </button>
                            ) : (
                              <></>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </>
              </Table.Body>
            </Table>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

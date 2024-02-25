import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { HiOutlinePlus } from "react-icons/hi";
import GridLoader from "react-spinners/GridLoader";
import { getSender } from "../config/ChatLogic";

function Mychats() {
  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,

    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    modalOpen,
    setModalOpen,
    fetchAgain,
    notification,
    notificationUpdate,
    setNotificationUpdate,
    updateNotification,
  } = ChatState();
  const fetchChat = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);

      setChats(data);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  }, [fetchAgain]);

  useEffect(() => {
    const chatIds = notification && notification?.map((item) => item.chat._id);

    if (selectedChat && chatIds.includes(selectedChat._id)) {
      updateNotification();
    }
  }, [selectedChat, notification]);

  const handleChat = (chat) => {
    // const chatIds = notification && notification?.map((item) => item.chat._id);

    // if (chatIds.includes(chat._id)) {
    //   updateNotification();
    // }
    setSelectedChat(chat);
  };
  const formateCreatedAt = (createdAt) => {
    const today = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    createdAt = new Date(createdAt);
    var istDateString = createdAt.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    var hours = createdAt.getHours();
    var minutes = createdAt.getMinutes().toString().padStart(2, "0");

    var amPm = hours >= 12 ? "PM" : "AM";
    hours = hours > 12 ? hours - 12 : hours;

    var istTimeString =
      hours.toString().padStart(2, "0") + ":" + minutes + " " + amPm;

    if (today === istDateString) {
      return istTimeString;
    } else {
      return istDateString;
    }
  };

  return (
    <div
      className={`text-green-600  bg-zinc-800 mr-1  ml-2 mb-2 opacity-95 text-2xl  px-4 pt-4 font-normal z-1000 rounded-lg md:w-1/3 w-screen ${
        selectedChat && "hidden  md:block"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row text-2xl font-bold justify-between ">
          My Chats
          <button
            className="bg bg-zinc-600 p-2 rounded-lg  "
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span className="flex flex-row justify-center items-center text-xl font-bold ">
              New Group Chats <HiOutlinePlus className="mx-2" />
            </span>
          </button>
        </div>

        {chats ? (
          <div
            className={`bg-zinc-700 mt-4 mb-5 py-2 rounded-lg overflow-x-auto  flex-1${
              chats.length > 5 ? "overflow-y-auto" : ""
            }`}
          >
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChat(chat)}
                className={`m-5 p-3 text-xl rounded-lg ${
                  selectedChat === chat
                    ? "bg-green-700 text-white"
                    : "bg-zinc-600 text-green-600"
                }`}
              >
                <div className="flex flex-col">
                  <div className=" flex flex-row justify-between">
                    <span>
                      {chat.isGroupChat
                        ? chat.chatName
                        : getSender(loggedUser, chat.users)}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {chat.latestMessage
                        ? formateCreatedAt(chat.latestMessage.createdAt)
                        : "start chating"}
                    </span>
                  </div>
                  <span
                    className="text-sm text-zinc-400 "
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.latestMessage?.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <GridLoader
            color={"#22b642"}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </div>
    </div>
  );
}

export default Mychats;

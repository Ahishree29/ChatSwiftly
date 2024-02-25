import React from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupModal from "./miscellaneous/UpdateGroupModal";
import SingleChat from "./SingleChat";

import { HiArrowLeft } from "react-icons/hi";

function ChatBox() {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <div
      className={`text-green-600  bg-zinc-800 mr-2 ml-1 mb-2 opacity-95 text-2xl  px-4 pt-1 font-normal z-1000 rounded-lg md:w-1/3 w-screen flex-1 ${
        !selectedChat && "hidden md:block"
      }`}
    >
      <div className="">
        <div className="flex-grow flex flex-col justify-end ">
          {selectedChat?.isGroupChat ? (
            <div className="flex flex-row justify-between">
              <div
                className={`block md:hidden`}
                onClick={() => setSelectedChat()}
              >
                <HiArrowLeft className="text-green-600 text-lg" />
              </div>
              <div className="font-bold">
                {selectedChat?.chatName.toUpperCase()}
              </div>
              <div>
                <UpdateGroupModal />
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-between">
              <div
                className={`block md:hidden`}
                onClick={() => setSelectedChat()}
              >
                <HiArrowLeft className="text-green-600 text-lg md:block" />
              </div>
              <div className="font-bold">
                {getSender(user, selectedChat?.users).toUpperCase()}
              </div>
              <div>
                {selectedChat && (
                  <ProfileModal
                    user={getSenderFull(user, selectedChat?.users)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SingleChat />
    </div>
  );
}

export default ChatBox;

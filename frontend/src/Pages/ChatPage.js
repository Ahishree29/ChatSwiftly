
import React from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import Mychats from "../Components/Mychats";
import ChatBox from "../Components/ChatBox";
import GroupChatModal from "../Components/miscellaneous/GroupChatModal";

const ChatPage = () => {
  const { user, modalOpen } = ChatState();

  return (
    <div
      className="bg-black h-screen   flex flex-col overflow-y-scroll overflow-x-hidden "
      style={{
        backgroundImage: `url("./bg-black.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
      }}
    >
      {user && <SideDrawer />}
      <div className=" flex flex-1">
        {user && <Mychats />}
        {user && <ChatBox />}
      </div>
      {modalOpen && <GroupChatModal />}
    </div>
  );
};

export default ChatPage;

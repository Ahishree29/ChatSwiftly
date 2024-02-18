import React, { useState } from "react";
import { HiEye, HiOutlineX } from "react-icons/hi";
import UserBadgeItem from "./UserBadgeItem";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import UserListItem from "../UserAvatar/UserListItem";
function UpdateGroupModal({ fetchMessage }) {
  const [openModal, setOpenmodal] = useState(false);
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();
  const [rename, setRename] = useState();
  const [renameLoding, setReanameLoading] = useState(false);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const handleremove = async (userid) => {
    if (selectedChat.groupAdmin._id !== user._id && userid._id !== user._id) {
      toast.error("only adims can remove someone");
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: userid },
        config
      );
      userid._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessage();
    } catch (error) {
      toast.error("search failed");
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!rename) return;
    try {
      setReanameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: rename },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setReanameLoading(false);
      setRename("");
    } catch (error) {
      toast.error("search failed");
    }
  };
  const handleSearch = async (query) => {
    if (!query) {
      setSearch([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearch(data);
      setLoading(false);
    } catch (error) {
      toast.error("search failed");
    }
  };
  const handleAddUser = async (userId) => {
    if (selectedChat.users.find((u) => u._id === userId._id)) {
      toast.error("user Already in group!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: userId._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {}
  };

  return (
    <div>
      <button onClick={() => setOpenmodal(!openModal)}>
        <HiEye />
      </button>
      {openModal && (
        <>
          <div
            className=" fixed bg-zinc-700 opacity-70 shadow-2xl shadow-gray-600  top-0 left-0 w-screen h-screen z-40  overflow-hidden
          "
          ></div>
          <div className="absolute translate-x-1/2 translate-y-1 transform top-1/4 right-1/2 bg-zinc-900 text-green-700 z-50 p-4">
            <button
              onClick={() => setOpenmodal(false)}
              className="absolute top-0 right-0 text-green-700 text-xl font-bold p-2"
            >
              <HiOutlineX />
            </button>
            <div className="flex justify-center flex-col items-center">
              <div className="font-bold">
                {selectedChat.chatName.toUpperCase()}
              </div>
              <div className="flex flex-row">
                {selectedChat &&
                  selectedChat.users.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      groupAdmin={selectedChat.groupAdmin._id}
                      handleFunction={() => handleremove(user._id)}
                    />
                  ))}
              </div>
            </div>
            <form className="flex flex-col items-center">
              <div className="flex justify-center items-center">
                <input
                  placeholder="Group Name"
                  className="bg-zinc-700 p-2 text-green-600 m-2 rounded-lg text-lg font-medium focus:outline-none focus:ring focus:border-green-400"
                  value={rename}
                  onChange={(e) => setRename(e.target.value)}
                />
                <button
                  onClick={handleRename}
                  className="bg-green-700 text-white text-lg rounded-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring focus:border-green-400"
                >
                  Update
                </button>
              </div>
              <div className="flex justify-center items-center flex-col">
                <input
                  placeholder="Add User"
                  className="bg-zinc-700 p-2 text-green-600 m-2 rounded-lg text-lg font-medium focus:outline-none focus:ring focus:border-green-400 mt-8"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {loading ? (
                <PulseLoader
                  color={"#22b642"}
                  loading={loading}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                search?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleFunction={() => {
                      handleAddUser(user);
                    }}
                  />
                ))
              )}
              <button
                className="text-red-600 text-lg font-medium mt-4 hover:underline focus:outline-none "
                onClick={() => handleremove(user._id)}
              >
                Leave Group
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default UpdateGroupModal;

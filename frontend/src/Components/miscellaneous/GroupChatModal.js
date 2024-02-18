import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineX } from "react-icons/hi";
import PulseLoader from "react-spinners/PulseLoader";
import UserListItem from "../UserAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";

function GroupChatModal() {
  const {
    user,
   
    chats,
    setChats,
    modalOpen,
    setModalOpen,
  } = ChatState();

  const [groupName, setGroupName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const handleGroup = (userToAdd) => {
    if (selectedUser.some((user) => user._id === userToAdd._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };
  const handleDelete = (userId) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== userId));
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setModalOpen(false);
      setSelectedUser([]);
      setGroupName("");
      toast.success("group created successfully");
    } catch (error) {
      toast.error("error while creating a group");
    }
  };
  return (
    <>
      {modalOpen && (
        <>
          <div
            className=" fixed bg-zinc-700 opacity-70 shadow-2xl shadow-gray-600  top-0 left-0 w-screen h-screen z-40
          "
          ></div>
          <div className="absolute  right-1/2 transform translate-x-1/2 translate-y-1 bg-zinc-900 rounded-lg p-5 shadow-xl shadow-zinc-800 z-50">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-0 right-0 text-green-700 text-xl font-bold p-2"
            >
              <HiOutlineX />
            </button>
            <div className="text-green-600 text-2xl font-bold py-5">
              Create Group Chat
            </div>
            <form>
              <div className="flex flex-col">
                <label className="text-lg text-green-700">Group Name</label>
                <input
                  placeholder="Enter the group name"
                  className="bg-zinc-700 p-2 text-green-600 m-2 rounded-lg mb-6 text-lg font-medium"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-lg  text-green-700">Add members</label>
                <input
                  placeholder="add the group name"
                  className="bg-zinc-700 p-2 text-green-600 m-2 rounded-lg text-lg font-medium"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-row ">
                {selectedUser.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user._id)}
                  />
                ))}
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
                      handleGroup(user);
                    }}
                  />
                ))
              )}
              <div className="flex justify-end items-end">
                <button
                  className="bg-green-700 text-white p-2 text-lg rounded-lg mt-3 "
                  onClick={handleSubmit}
                >
                  submit
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default GroupChatModal;

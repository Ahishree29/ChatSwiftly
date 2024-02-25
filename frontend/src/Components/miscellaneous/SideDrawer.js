import React, { useEffect, useRef, useState } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { HiBell, HiChevronDown } from "react-icons/hi";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import PropagateLoader from "react-spinners/PropagateLoader";

import { Tooltip } from "react-tooltip";
import axios from "axios";

import "react-loading-skeleton/dist/skeleton.css";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import UserListItem from "../UserAvatar/UserListItem";

function SideDrawer() {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const {
    user,
    setUser,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain,
    notificationSent,
    notification,
    setNotification,
    setNotificationSent,
    notify,
    setNotify,
    notificationUpdate,
    setNotificationUpdate,
  } = ChatState();
  const modalRef = useRef(null);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowMenu(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const handelSearch = async () => {
    if (!search) {
      toast.error("please enter something in search");
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load the search results");
      setLoading(false);
    }
  };
  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
    setSearchResult("");
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (error) {
      toast.error("unable to access chat");
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    const getNotification = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          "/api/notification",

          config
        );
        setNotification(data);
        fetchAgain(true);
      } catch (error) {}
    };
    getNotification();
  }, [notificationSent, notify]);

  // useEffect(() => {
  //   const updateNotification = async () => {
  //     try {
  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       };
  //       const { data } = await axios.put(
  //         `/api/notification/${selectedChat._id}`,
  //         {},
  //         config
  //       );
  //       setNotification(data);
  //       setNotificationSent(true);
  //     } catch (error) {}
  //   };
  //   updateNotification();
  // }, [notificationUpdate]);

  const handleNotification = () => {
    setSelectedChat(notification[0].chat);
    const chatIds = notification?.map((item) => item.chat._id);

    if (chatIds.includes(notification[0].chat._id)) {
      setNotificationUpdate(true);
    }
  };

  return (
    <div className="bg-black  h-20 shadow-lg shadow-zinc-900 p-2 flex items-center">
      <div
        className=" w-screen o  flex flex-row items-center justify-between shadow-xl bg-zinc-900 p-3"
        style={{ height: "4rem" }}
      >
        <div
          id="search-user"
          className="flex  flex-row  items-center justify-center "
        >
          <HiOutlineSearch className="text-green-500 text-2xl font-bold mr-2" />

          <button
            className="text-zinc-500 text-sm font-medium active:bg-zinc-600"
            onClick={handleDrawerOpen}
          >
            Search user
          </button>
        </div>
        <Tooltip anchorSelect="#search-user" className="z-50">
          <span className="  text-green-700">click to search user</span>
        </Tooltip>
        <div>
          <img src="./app-logo.png" alt="logo" style={{ height: "3.5rem" }} />
        </div>
        <div className="flex flex-row items-center justify-center">
          <div id="notification">
            {notification.length > 0 && (
              <div className="relative inline-block">
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 mb-4 ">
                  {notification.length}
                </span>
              </div>
            )}
            <HiBell className="text-green-700 text-2xl font-bold mr-8" />
          </div>
          <Tooltip anchorSelect="#notification" className="z-50" clickable>
            {notification.length ? (
              <span className="text-green-700" onClick={handleNotification}>
                `message from
                {notification.map((note) =>
                  note.chat?.isGroupChat ? note.chat.chatName : note.sender.name
                )}
                `
              </span>
            ) : (
              <span className="text-green-700">no notifications</span>
            )}{" "}
          </Tooltip>
          <div className="flex flex-row justify-center items-center bg-zinc-700 p-2 px-5 rounded-md opacity-70 ">
            {user.pic ? (
              <img
                src={user.pic}
                alt="profile"
                className="rounded-full h-10 w-10"
              />
            ) : (
              <div className="bg-green-800 rounded-full h-10 w-10 flex items-center justify-center text-white text-2xl font-medium pb-2">
                {user.name.charAt(0)}
              </div>
            )}
            <button onClick={() => setShowMenu(!showMenu)} className="ml-2">
              {" "}
              <HiChevronDown className="text-green-600 ml-2 text-xl" />
            </button>
          </div>
          {showMenu && (
            <div
              className="absolute bg-zinc-800 p-2 rounded-md top-12 right-0 mr-6 mt-8 z-10"
              ref={modalRef}
            >
              <ProfileModal user={user}>
                {" "}
                <div className="text-white p-3">Profile</div>
              </ProfileModal>

              <div
                className="text-white p-2 active:bg-zinc-500"
                onClick={logoutHandler}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
      {drawerOpen && (
        <div
          className="absolute top-0 left-0 bg-zinc-900 h-screen p-6 shadow-zinc-800 shadow-xl z-10"
          data-aos="fade-right"
          ref={modalRef}
        >
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-0 right-0 text-green-700 text-xl font-bold p-2"
          >
            <HiOutlineX />
          </button>
          <span className="text-green-800 text-2xl font-semibold p-3">
            Search User
          </span>
          <div className="flex  flex-row  items-center justify-center p-5 mt-9">
            <input
              placeholder="Search User"
              className=" border-green-700 bg-zinc-700 p-2 rounded-lg text-green-700 text-lg font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-zinc-700 p-1 ml-2 rounded-md text-green-700 text-lg font-bold"
              onClick={handelSearch}
            >
              Go
            </button>
          </div>
          <div className="flex ml-3 mt-2 flex-col ">
            <SkeletonTheme
              baseColor="#202020"
              highlightColor="#444"
              height="70px"
            >
              {loading ? (
                <Skeleton count={2} style={{ marginBottom: "1rem" }} />
              ) : (
                searchResult &&
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      accessChat(user._id);
                    }}
                  />
                ))
              )}
            </SkeletonTheme>
          </div>
          <div className="flex justify-center items-center">
            {loadingChat && (
              <PropagateLoader
                color={"#22b642"}
                loading={loadingChat}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SideDrawer;

import React, { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import SyncLoader from "react-spinners/SyncLoader";

import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import toast from "react-hot-toast";
import ScrollableChat from "./UserAvatar/ScrollableChat";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
function SingleChat() {
  const [newMessage, setNewMessage] = useState("");
  const {
    user,
    selectedChat,

    setNotificationSent,

    fetchAgain,
    setFetchAgain,
    notify,
    setNotify,
  } = ChatState();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState();
  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast.error("failed to fetch message");
    }
  };
  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log("roomId", roomId);
  useEffect(() => {
    socket.on("message recived", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        setNotify({
          senderId: newMessageRecived.sender._id,
          chatId: newMessageRecived.chat._id,
        });
        setFetchAgain(!fetchAgain);
      } else {
        setMessage((prevMessages) => [...prevMessages, newMessageRecived]);
        setFetchAgain(true);
      }
    });
    return () => {
      socket.off("message received");
    };
  }, []);
  useEffect(() => {
    const sendNotification = async () => {
      const { senderId, chatId } = notify;
      if (!senderId && !chatId) {
        return;
      }
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.post("/api/notification", { senderId, chatId }, config);
        setNotificationSent(true);

        setNotify({ senderId: "", chatId: "" });
      } catch (error) {
        toast.error("Failed to send notification");
      }
    };
    sendNotification();
  }, [notify]);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    socket.on("typing", (room) => setRoomId(room));
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessage([...message, data]);
        setFetchAgain(true);
      } catch (error) {
        toast.error("failed to send message");
      }
    }
  };

  return (
    <>
      {" "}
      {!selectedChat ? (
        <div className="text-center items-center  font-medium flex justify-center my-80 ">
          <div>Click on a user to start chatting</div>
        </div>
      ) : (
        <div className="flex flex-col h-full ">
          <div
            className={`bg-zinc-700 mt-4  p-2 rounded-lg   flex flex-col  justify-end `}
            style={{ marginBottom: "3.5rem", height: "100%" }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-5 ">
                <PuffLoader
                  color={"#22b642"}
                  loading={loading}
                  size={80}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <div onKeyDown={sendMessage}>
                <ScrollableChat message={message} />
                {isTyping ? (
                  <SyncLoader
                    color={"#22b642"}
                    loading={isTyping}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <></>
                )}
                <textarea
                  value={newMessage}
                  onChange={typingHandler}
                  placeholder="Type a message..."
                  style={{
                    minHeight: "50px",
                    maxHeight: "100px",
                    resize: "none",
                  }}
                  className="w-full p-1 border rounded bg-zinc-600"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SingleChat;

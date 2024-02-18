import React, { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatProvider";
import {
  lastMessage,
  sameMessage,
  sameMessageMargin,
} from "../../config/ChatLogic";

function ScrollableChat({ message }) {
  const { user } = ChatState();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);

  const formatCreatedAt = (createdAt) => {
    const today = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    createdAt = new Date(createdAt);
    const istDateString = createdAt.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const hours = createdAt.getHours();
    const minutes = createdAt.getMinutes().toString().padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours > 12 ? hours - 12 : hours;

    return {
      date: istDateString,
      time: `${formattedHours.toString().padStart(2, "0")}:${minutes} ${amPm}`,
    };
  };

  return (
    <ScrollableFeed forceScroll={true}>
      <div
        ref={chatContainerRef}
        style={{
          maxHeight: "700px",
          overflowY: "auto",
          paddingTop: "0",
          marginTop: "0",
        }}
        className="px-3 pb-4"
      >
        {message &&
          message.map((msg, i) => {
            const formattedDate = formatCreatedAt(msg.createdAt);
            const isFirstMessage =
              i === 0 ||
              formatCreatedAt(message[i - 1].createdAt).date !==
                formattedDate.date;

            return (
              <div>
                {isFirstMessage && (
                  <div className="font-bold  flex justify-center m-5  text-zinc-300 text-lg">
                    <span className="bg-zinc-600 rounded-lg p-1">
                      {formattedDate.date}
                    </span>
                  </div>
                )}
                <div className="flex flex-row" key={i}>
                  {(sameMessage(message, msg, i, user._id) ||
                    lastMessage(message, msg, i, user._id)) && (
                    <img
                      src={msg.sender.pic}
                      alt="img"
                      className="h-10 rounded-full mx-2"
                    />
                  )}

                  <div
                    className={`${
                      msg.sender._id === user._id
                        ? "bg-zinc-400 text-green-800"
                        : "bg-green-500 text-white"
                    }`}
                    style={{
                      borderRadius: "1rem",
                      padding: "5px",
                      fontSize: "18px",
                      marginLeft: sameMessageMargin(message, msg, i, user._id),

                      marginTop: "3px",
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{msg.content}</span>
                      <div className="text-sm text-end pl-10 flex flex-col">
                        <span>{formattedDate.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </ScrollableFeed>
  );
}

export default ScrollableChat;

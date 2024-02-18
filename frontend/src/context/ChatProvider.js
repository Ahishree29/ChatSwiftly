import { useNavigate } from "react-router-dom";

const { createContext, useContext, useState, useEffect } = require("react");

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notify, setNotify] = useState({ senderId: "", chatId: "" });
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        setSelectedChat,
        selectedChat,
        chats,
        setChats,
        modalOpen,
        setModalOpen,
        fetchAgain,
        setFetchAgain,
        notificationSent,
        setNotificationSent,
        notification,
        setNotification,
        notify,
        setNotify,
        notificationUpdate,
        setNotificationUpdate,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { Toaster } from "react-hot-toast";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ChatProvider>
                <HomePage />
              </ChatProvider>
            }
          />
          <Route
            path="/chats"
            element={
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;

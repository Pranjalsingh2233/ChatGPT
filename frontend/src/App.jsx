import { use, useState } from "react";
import "./App.css";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import Sidebar from "./Sidebar";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import { ToastContainer } from "react-toastify";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState("new");
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    user,
    setUser,
    isCollapsed,
    setIsCollapsed,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <Sidebar />
              <ChatWindow />
            </div>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </MyContext.Provider>
  );
}

export default App;

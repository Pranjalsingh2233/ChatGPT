import React, { useContext, useState, useEffect } from "react";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { ScaleLoader } from "react-spinners";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    setPrevChats,
    setNewChat,
    user,
    setUser,
    setIsCollapsed,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId("new");
    setPrevChats([]);
  };

  const getReply = async () => {
    if (!prompt) return;
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        id: currThreadId,
      }),
      credentials: "include",
    };
    try {
      const res = await fetch("https://chatgpt-se61.onrender.com/api/chat", options);
      const data = await res.json();
      setReply(data?.data ?? null);
      if (currThreadId === "new") {
        setCurrThreadId(data.threadId);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setIsLoggingOut(false);
  }, []);

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
      setPrompt("");
    }
  }, [reply]);

  useEffect(() => {
    const handleOutsideClick = () => setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isLoggingOut) return;

    const verifyCookie = async () => {
      const { data } = await axios.post(
        "https://chatgpt-se61.onrender.com/api",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      if (status) {
        setUser(user);
      } else {
        await axios.post(
          "https://chatgpt-se61.onrender.com/api/logout",
          {},
          { withCredentials: true }
        );
        createNewChat();
        toast.error("You should login first", {
          position: "bottom-left",
        });
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    };
    verifyCookie();
  }, [cookies, user, removeCookie]);

  const Logout = async () => {
    setIsLoggingOut(true);
    const { data } = await axios.post(
      "https://chatgpt-se61.onrender.com/api/logout",
      {},
      { withCredentials: true }
    );
    const { success, message } = data;
    if (success) {
      toast.success(message, {
        position: "bottom-left",
      });
      createNewChat();
      setUser(null);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span className="display">
          <i class="fa-solid fa-bars" onClick={() => setIsCollapsed(true)}></i>
        </span>
        <span>
          ChatGPT <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <div
            className="userIcon"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {user ? (
              user[0].toUpperCase()
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="dropdownItem">
            <i className="fa-solid fa-user"></i>
            {user ? user : "user"}
          </div>
          <div className="dropdownItem">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropdownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
          </div>
          <div className="dropdownItem" onClick={Logout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader
        color="#fff"
        loading={loading}
        style={{ marginBottom: loading ? "20px" : "0px" }}
      />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-arrow-up"></i>
          </div>
        </div>
        <p className="info">
          ChatGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

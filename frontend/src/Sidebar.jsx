import React, { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    isCollapsed,
    setIsCollapsed,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/thread", {
        credentials: "include",
      });
      const data = await res.json();
      const filteredData = data.map((thread) => ({
        title: thread.title,
        threadId: thread._id,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId("new");
    setPrevChats([]);
    setIsCollapsed(false);
  };

  const changeThread = async (id) => {
    setCurrThreadId(id);
    setIsCollapsed(false);

    try {
      const res = await fetch(`http://localhost:8080/api/thread/${id}`);
      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/thread/${id}`, {
        method: "DELETE",
      });
      setAllThreads((prev) => prev.filter((thread) => thread.threadId !== id));
      if (id === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={isCollapsed ? "sidebar open" : "sidebar close"}>
      <i
        className="fa-solid fa-square-xmark close-btn"
        onClick={() => setIsCollapsed(false)}
      ></i>
      <button className="start-btn" onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="GPT logo"
          className="logo"
        ></img>
        <span style={{ fontSize: "14px" }}>New chat</span>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>
      <ul className="history">
        <span>Chats</span>
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>
          By Pranjal Singh <i className="fa-solid fa-heart"></i>
        </p>
      </div>
    </section>
  );
}

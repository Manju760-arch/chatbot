import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import { sendMsgToOpenAI } from './openai';

const App = () => {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Some random welcome messages
  const welcomeMessages = [
    "Hi there! I'm your AI assistant. How can I help you today?",
    "Hello! Ready to chat? Ask me anything!",
    "Welcome! I can help you with programming, APIs, or general questions.",
    "Hey! Let's start our conversation. What's on your mind?"
  ];

  // Show random welcome message on first load
  useEffect(() => {
    const randomMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setChats([{ role: "bot", content: randomMsg }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setChats(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const tempBotMsg = { role: "bot", content: "ChatGPT is typing...", timestamp: new Date() };
    setChats(prev => [...prev, tempBotMsg]);

    try {
      const res = await sendMsgToOpenAI(input);
      setChats(prev => [
        ...prev.slice(0, -1),
        { role: "bot", content: res, timestamp: new Date() }
      ]);
    } catch (err) {
      setChats(prev => [
        ...prev.slice(0, -1),
        { role: "bot", content: "⚠️ Connection error. Try again.", timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle New Chat
  const handleNewChat = () => {
    const randomMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setChats([{ role: "bot", content: randomMsg }]);
  };

  return (
    <div className='App'>
      <div className="sideBar">
        <div className="upperside">
          <div className="upperSideTop">
            <img className="logo" src={gptLogo} alt="logo" />
            <span className="brand">ChatGPT</span>
          </div>

          <button className="midBtn" onClick={handleNewChat}>
            <img src={addBtn} alt="New Chat" className="addBtn" />New Chat
          </button>

          <div className="upperSideBottom">
            <button className="query"><img src={msgIcon} alt="" />What is Programming</button>
            <button className="query"><img src={msgIcon} alt="" />How to use an API</button>
          </div>
        </div>

        <div className="lowerSide">
          <div className="listItems"><img src={home} alt="" className="listitemsImg" />Home</div>
          <div className="listItems"><img src={saved} alt="" className="listitemsImg" />Saved</div>
          <div className="listItems"><img src={rocket} alt="" className="listitemsImg" />Upgrade to Pro</div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {chats.map((chat, i) => (
            <div key={i} className={`chat ${chat.role === "bot" ? "bot" : ""}`}>
              <img
                className="chatImg"
                src={chat.role === "user" ? userIcon : gptImgLogo}
                alt=""
              />
              <p className="txt">{chat.content}</p>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button className="send" onClick={handleSend} disabled={loading}>
              <img src={sendBtn} alt="" />
            </button>
          </div>

          <p>ChatGPT may produce inaccurate information about people, places, or facts.</p>
        </div>
      </div>
    </div>
  );
};

export default App;

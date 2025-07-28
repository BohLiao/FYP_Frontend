import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  simulateKyberAesEncrypt,
  simulateKyberAesDecrypt,
  isEncrypted,
} from "../crypto/kyber_aes";
import { useNavigate } from "react-router-dom";

import "../chat.css";

const QuantumChatApp = ({ auth }) => {
  const navigate = useNavigate();
  const me = auth?.user?.username || "Unknown";
  const isHacker = me === "Hacker";

  const [users, setUsers] = useState([]);
  const [to, setTo] = useState(isHacker ? "*ALL*" : null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [hideEnc, setHideEnc] = useState(false);
  const [theme, setTheme] = useState("light");

  const endRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users`)
      .then((r) => setUsers(r.data.filter((u) => u.username !== me)))
      .catch(console.error);
  }, [me]);

  useEffect(() => {
    const load = () => {
      const params = isHacker ? { from: "Hacker" } : { from: me, to };
      axios
        .get(`${import.meta.env.VITE_API_URL}/messages`, { params })
        .then((r) => setMsgs(r.data))
        .catch(console.error);
    };
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [me, to, isHacker]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const push = (msg) => {
    const payload = simulateKyberAesEncrypt(msg);
    axios
      .post(`${import.meta.env.VITE_API_URL}/send`, { from: me, to, message: payload })
      .then(() => {
        setText("");
        setFile(null);
      })
      .catch(console.error);
  };

  const send = () => {
    if (!text.trim() && !file) return;
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      axios
        .post(`${import.meta.env.VITE_API_URL}/upload`, fd)
        .then((r) => push(`📎 File: ${r.data.url}`))
        .catch(console.error);
    } else {
      push(text.trim());
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const wrapper = theme === "dark" ? "chat-dark" : "chat-light";
  const accent = "bg-amber-600";
  const bubbleMe =
    theme === "dark" ? "bg-amber-700 text-white" : "bg-blue-500 text-white";
  const bubbleYou =
    theme === "dark" ? "bg-slate-700 text-white" : "bg-gray-300 text-black";
  const contactBG =
    theme === "dark"
      ? "bg-slate-800 hover:bg-slate-700 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-black";

  return (
    <div className={`${wrapper} qca-layout`}>
      <aside className="qca-sidebar">
        <div className="qca-topbar-container">
          <div className="qca-sidebar-greeting">
            <div className="text-2xl font-bold">Hi</div>
            <div className="opacity-70">@{me}</div>
          </div>

          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="qca-theme-toggle-button"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {!isHacker && (
          <>
            <div className="qca-contacts-header text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Contacts
            </div>
            <div className="qca-contacts-list">
              {users.map((u) => (
                <button
                  key={u.username}
                  title={simulateKyberAesDecrypt(u.username)}
                  onClick={() => setTo(u.username)}
                  className={`truncate font-medium transition ${
                    to === u.username
                      ? `${accent} text-white shadow-lg ring-2 ring-amber-500`
                      : contactBG
                  }`}
                >
                  {simulateKyberAesDecrypt(u.username)}
                </button>
              ))}
            </div>
             <button className="signout-button" onClick={handleSignOut}>
                Sign Out
              </button>
          </>
        )}
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="qca-chat-panel-container">
          <div className="qca-chat-status-box">
            <div className="qca-chat-status-label">
              {isHacker
                ? "🕁️ Viewing all messages"
                : to
                ? `Chat with ${simulateKyberAesDecrypt(to)}`
                : "Select a contact"}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {msgs
              .filter((m) => !(isHacker && hideEnc && isEncrypted(m.message)))
              .map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.from === me ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`max-w-xl p-3 rounded-2xl text-sm break-words shadow-md ${
                    m.from === me ? bubbleMe : bubbleYou
                  }`}
                >
                  {isHacker && (
                    <div className="text-xs opacity-70 mb-1 font-mono">
                      {m.sender || m.from} → {m.receiver || m.to}
                    </div>
                  )}
                  {m.message?.startsWith("📎 File:") ? (
                    <a
                      href={m.message.replace("📎 File: ", "")}
                      target="_blank"
                      rel="noreferrer"
                      className="qca-chat-file-link underline font-semibold"
                      title={m.message.split("/").pop()}
                    >
                      {m.message.split("/").pop()}
                    </a>
                  ) : isHacker ? (
                    hideEnc ? "[Encrypted hidden]" : m.message
                  ) : (
                    simulateKyberAesDecrypt(m.message)
                  )}
                </motion.div>
              ))}
            <div ref={endRef} />
          </div>

          {!isHacker && (
            <div className="qca-chat-input-wrapper">
              <div className="qca-chat-input-bar">
                <label
                  htmlFor="file-in"
                  className={`qca-input-ctrl file-label cursor-pointer border px-3 py-2 rounded ${
                    theme === "dark"
                      ? "bg-slate-700 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {file ? `${file.name}` : "📎"}
                </label>

                <input
                  id="file-in"
                  type="file"
                  className="qca-hidden-file-input"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message…"
                  className="qca-input-ctrl qca-message-input"
                />

                <button
                  onClick={send}
                  className={`qca-input-ctrl ${accent} hover:bg-amber-700 px-5 text-white rounded`}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuantumChatApp;

"use client";

import React, { useState } from "react";

const ChatForm = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className="flex gap-2 mt-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Send
      </button>
    </form>
  );
};

export default ChatForm;

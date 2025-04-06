"use client";
import React, { useState } from "react";
import ChatForm from "../_components/ChatForm";
import ChatMessage from "../_components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect } from "react";

const ChatRoomPage = () => {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("User joined", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "System", message },
      ]);
    });

    return () => {
      socket.off("User joined");
      socket.off("Message");
    };
  }, []);

  const onSendMessage = (message) => {
    const data = { room, message, sender: userName };
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userName, message },
    ]);
    socket.emit("message", data);
  };
  const handleJoinRoom = () => {
    socket.emit("joinRoom", room, userName);
    setJoined(true);
  };
  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Enter room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: 1</h1>
          <div className="bg-gray-100 border-2 mb-4 p-4 rounded-lg h-[500px] overflow-y-auto">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={onSendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatRoomPage;

"use client";

import { io } from "socket.io-client";
export const socket = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://chatroom-websocket.onrender.com",
  {
    transports: ["websocket"],
  }
);

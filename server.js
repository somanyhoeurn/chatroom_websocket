import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  // const io = new Server(httpServer);
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "https://chatroom-websocket.onrender.com", // backend itself
        "https://somany-chatroom.vercel.app", // your Vercel frontend
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (room, userName) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
      socket.to(room).emit("userJoined", `${userName} has joined the room`);
    });

    socket.on("message", ({ room, message, sender }) => {
      console.log(`Message from ${sender} in room ${room}: ${message}`);
      socket.to(room).emit("message", { sender, message });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  httpServer.listen(port, () => {
    console.log(`> Server running on http://${hostname}:${port}`);
  });
});

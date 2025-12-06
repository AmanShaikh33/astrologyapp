import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDb } from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import astrologerRoutes from "./routes/astrologerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { Message } from "./models/Message.js";
import User from "./models/User.js";
import Astrologer from "./models/Astrologer.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();
connectDb();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("AstroTalk Backend Running");
});

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/** Track online astrologers */
const astrologerSockets = {};

/**
 * Billing memory structure:
 * billingStatus = {
 *   roomId123: {
 *     userJoined: true,
 *     astroJoined: false,
 *     interval: null,
 *     pricePerMinute: 20,
 *     userId: "...",
 *     astrologerId: "..."
 *   }
 * }
 */
let billingStatus = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ⚡ Mark astrologer online
  socket.on("astrologerOnline", ({ astrologerId }) => {
    astrologerSockets[astrologerId] = socket.id;
    console.log("🔮 Astrologer online:", astrologerId);
  });

  // ⚡ User requests chat → notify astrologer immediately
  socket.on("userRequestsChat", (data) => {
    const { astrologerId } = data;

    const targetSocketId = astrologerSockets[astrologerId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("incomingChatRequest", data);
      console.log("📨 Sent chat request to astrologer:", astrologerId);
    } else {
      console.log("⚠ Astrologer offline, cannot send popup.");
    }
  });

  // JOIN ROOM
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  // USER JOINED
  socket.on("user-joined", ({ roomId, userId, pricePerMinute }) => {
    if (!billingStatus[roomId]) {
      billingStatus[roomId] = {
        userJoined: false,
        astroJoined: false,
        interval: null,
        pricePerMinute,
        userId,
        astrologerId: null,
      };
    }
    billingStatus[roomId].userJoined = true;
    billingStatus[roomId].pricePerMinute = pricePerMinute;
    billingStatus[roomId].userId = userId;

    io.to(roomId).emit("userJoinedRoom");

    checkStartBilling(roomId);
  });

  // ASTRO JOINED
  socket.on("astro-joined", ({ roomId, astrologerId }) => {
    if (!billingStatus[roomId]) {
      billingStatus[roomId] = {
        userJoined: false,
        astroJoined: false,
        interval: null,
        pricePerMinute: null,
        userId: null,
        astrologerId,
      };
    }
    billingStatus[roomId].astroJoined = true;
    billingStatus[roomId].astrologerId = astrologerId;

    io.to(roomId).emit("astroJoinedRoom");

    checkStartBilling(roomId);
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (data) => {
    console.log("📩 Message received:", data);

    const message = await Message.create({
      chatRoomId: data.chatRoomId,
      sender: data.senderId,
      receiver: data.receiverId,
      senderModel: "User",
      receiverModel: "Astrologer",
      content: data.message || data.content,
    });

    io.to(data.chatRoomId).emit("receiveMessage", {
      _id: message._id,
      chatRoomId: message.chatRoomId,
      senderId: message.sender.toString(),
      receiverId: message.receiver.toString(),
      content: message.content,
      createdAt: message.createdAt,
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    for (const astroId in astrologerSockets) {
      if (astrologerSockets[astroId] === socket.id) {
        delete astrologerSockets[astroId];
      }
    }
    console.log("Disconnected:", socket.id);
  });
});

/**
 * BILLING LOGIC
 */
async function checkStartBilling(roomId) {
  const room = billingStatus[roomId];
  if (!room.userJoined || !room.astroJoined) return;

  console.log("🚀 Both joined, starting billing for room:", roomId);

  if (room.interval) return;

  io.to(roomId).emit("startBilling");

  room.interval = setInterval(async () => {
    try {
      const user = await User.findById(room.userId);
      if (!user) return;

      if (user.coins < room.pricePerMinute) {
        clearInterval(room.interval);
        room.interval = null;

        io.to(roomId).emit("endChatDueToLowBalance");
        return;
      }

      // Deduct coins
      user.coins -= room.pricePerMinute;
      await user.save();

      io.to(roomId).emit("coinsUpdated", user.coins);
    } catch (err) {
      console.log("Billing error:", err.message);
    }
  }, 60000);
}

server.listen(5000, () => console.log("Server running on port 5000"));

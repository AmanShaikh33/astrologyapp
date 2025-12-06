import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { io } from "socket.io-client";
import { apiCreateOrGetChatRoom, apiGetMessages } from "../../api/api";

// SOCKET
const socket = io("http://10.159.170.71:5000", {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("⚡ User connected:", socket.id);
});

const ChatPage = () => {
  const router = useRouter();
  const { astrologerId } = useLocalSearchParams<{ astrologerId: string }>();

  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [pricePerMinute, setPricePerMinute] = useState(0);
  const [userCoins, setUserCoins] = useState(0);

  const [astroJoined, setAstroJoined] = useState(false);
  const [timer, setTimer] = useState(60);

  const flatListRef = useRef<FlatList>(null);

  // -------------------------
  // TIMER
  // -------------------------
  useEffect(() => {
    if (!astroJoined) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev === 1 ? 60 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [astroJoined]);

  // -------------------------
  // SETUP CHAT
  // -------------------------
  useEffect(() => {
    const setup = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const uData = await AsyncStorage.getItem("userData");

        if (!token || !astrologerId) return;

        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);

        const parsedUser = JSON.parse(uData || "{}");

        // Create room
        const roomRes = await apiCreateOrGetChatRoom(token, astrologerId);
        const roomId = roomRes.chatRoomId || roomRes._id;

        setChatRoomId(roomId);
        setPricePerMinute(roomRes.pricePerMinute || 0);
        setUserCoins(roomRes.userCoins || parsedUser.coins || 0);

        socket.emit("joinRoom", { roomId });

        // ⭐ IMPORTANT: tell backend user has joined
        socket.emit("user-joined", {
          roomId,
          userId: decoded.id,
          pricePerMinute: roomRes.pricePerMinute,
        });

        // messages
        const msgs = await apiGetMessages(token, roomId);
        setMessages(msgs);

        // Notify astrologer that user wants to chat
        socket.emit("requestChat", {
          astrologerId,
          userId: decoded.id,
          roomId,
          userName: parsedUser.name,
        });

      } catch (err) {
        console.log("❌ setup error:", err.message);
      }
    };

    setup();

    // LISTENERS
    socket.on("astroJoinedRoom", () => {
      setAstroJoined(true);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("coinsUpdated", (newCoins) => {
      setUserCoins(newCoins);
    });

    socket.on("endChatDueToLowBalance", () => {
      Alert.alert("Balance Low", "Chat ended due to low balance.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("astroJoinedRoom");
      socket.off("coinsUpdated");
      socket.off("endChatDueToLowBalance");
    };
  }, [astrologerId]);

  // -------------------------
  // SEND MESSAGE
  // -------------------------
  const handleSend = () => {
    if (!astroJoined) {
      Alert.alert("Please Wait", "Astrologer has not joined yet.");
      return;
    }

    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      chatRoomId,
      senderId: userId,
      receiverId: astrologerId,
      content: newMessage,
    });

    setNewMessage("");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      {/* HEADER */}
      <View className="p-4 bg-white border-b border-gray-300">
        <Text className="text-lg font-bold">
          Coins: {userCoins}
        </Text>

        {astroJoined ? (
          <>
            <Text className="text-gray-600 mt-1">
              Price/Min: ₹{pricePerMinute}
            </Text>
            <Text className="text-green-600 mt-1">
              Next charge in: {timer}s
            </Text>
          </>
        ) : (
          <Text className="text-orange-600 mt-2">
            ⏳ Waiting for astrologer…
          </Text>
        )}
      </View>

      {/* MESSAGES */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, i) => item._id || i.toString()}
          renderItem={({ item }) => {
            const mine = String(item.senderId) === String(userId);3

            return (
              <View
                className={`max-w-[75%] px-4 py-2 my-1 rounded-2xl ${
                  mine
                    ? "self-end bg-green-100 rounded-tr-none"
                    : "self-start bg-gray-200 rounded-tl-none"
                }`}
              >
                <Text>{item.content}</Text>
              </View>
            );
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
        />

        {/* INPUT */}
        <View className="absolute bottom-2 left-0 right-0 flex-row p-2 bg-white border-t">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={
              astroJoined ? "Type a message…" : "Waiting for astrologer…"
            }
            editable={astroJoined}
            className="flex-1 border px-3 py-2 rounded-full"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!astroJoined}
            className={`ml-2 px-5 py-2 rounded-full ${
              astroJoined ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;

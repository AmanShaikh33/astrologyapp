import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { apiCreateOrGetChatRoom, apiGetMessages } from "../../../api/api";

interface Message {
  _id?: string;
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt?: string;
}

const socket = io("https://astrologyapp-1.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});

const AstrologerChatPage = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoomId, setChatRoomId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [astrologerId, setAstrologerId] = useState("");

  const [userJoined, setUserJoined] = useState(false);
  const [timer, setTimer] = useState(60);
  const [pricePerMinute, setPricePerMinute] = useState(0);
  const [userCoins, setUserCoins] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  // ----------------------------------------------------
  // COUNTDOWN (only runs when userJoined)
  // ----------------------------------------------------
  useEffect(() => {
    if (!userJoined) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev === 1 ? 60 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [userJoined]);

  // ----------------------------------------------------
  // SETUP CHAT
  // ----------------------------------------------------
  useEffect(() => {
    const setupChat = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !userId) return;

        const decoded: any = jwt_decode(token);
        setAstrologerId(decoded.id);

        // Ensure socket connection
        if (!socket.connected) {
          socket.connect();
          await new Promise((resolve) => socket.once("connect", resolve));
        }

        const chatRoom = await apiCreateOrGetChatRoom(token, null, userId);
        const roomId = chatRoom.chatRoomId || chatRoom._id;
        setChatRoomId(roomId);

        setPricePerMinute(chatRoom.pricePerMinute);
        setUserCoins(chatRoom.userCoins ?? 0);

        socket.emit("joinRoom", { roomId });

        // Notify backend astrologer joined
        socket.emit("astro-joined", {
          roomId,
          astrologerId: decoded.id,
        });

        const msgs = await apiGetMessages(token, roomId);
        setMessages(msgs);

      } catch (error: any) {
        console.log("Chat setup error:", error.message);
      }
    };

    setupChat();

    // LISTENERS
    socket.on("userJoinedRoom", () => {
      setUserJoined(true);
    });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socket.on("startBilling", () => {
      console.log("Billing started for astrologer.");
    });

    socket.on("coinsUpdated", (newCoins) => {
      setUserCoins(newCoins);
    });

    socket.on("endChatDueToLowBalance", () => {
      Alert.alert(
        "User Balance Low",
        "User's coins have finished. Chat ended.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    });

    return () => {
      socket.off("userJoinedRoom");
      socket.off("receiveMessage");
      socket.off("startBilling");
      socket.off("coinsUpdated");
      socket.off("endChatDueToLowBalance");
    };
  }, [userId]);

  // ----------------------------------------------------
  // SEND MESSAGE
  // ----------------------------------------------------
  const handleSend = async () => {
    if (!userJoined) {
      Alert.alert("Please wait", "User has not joined the chat yet.");
      return;
    }

    if (!newMessage.trim() || !chatRoomId) return;

    const msgPayload = {
      chatRoomId,
      senderId: astrologerId,
      receiverId: userId,
      content: newMessage.trim(),
    };

    socket.emit("sendMessage", msgPayload);
    setNewMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>

      {/* BILLING HEADER */}
      <View style={{ padding: 10, backgroundColor: "white", borderBottomWidth: 1, borderColor: "#ddd" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          User Coins: {userCoins}
        </Text>

        {userJoined ? (
          <>
            <Text style={{ color: "#333", marginTop: 3 }}>
              Price/Min: ₹{pricePerMinute}
            </Text>
            <Text style={{ color: "green", marginTop: 3 }}>
              Next charge in: {timer}s
            </Text>
          </>
        ) : (
          <Text style={{ color: "orange", marginTop: 5 }}>
            ⏳ Waiting for user to join…
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item._id ?? index.toString()}
            renderItem={({ item }) => {
              const isSentByAstro = String(item.senderId) === String(astrologerId);
              return (
                <View
                  style={{
                    maxWidth: "75%",
                    padding: 10,
                    marginVertical: 5,
                    borderRadius: 12,
                    alignSelf: isSentByAstro ? "flex-end" : "flex-start",
                    backgroundColor: isSentByAstro ? "#DCF8C6" : "#ECECEC",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.content}</Text>
                </View>
              );
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* INPUT BAR */}
          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              right: 10,
              backgroundColor: "white",
              borderRadius: 25,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <TextInput
              style={{ flex: 1, paddingHorizontal: 10, fontSize: 16 }}
              placeholder={
                userJoined ? "Type a message..." : "Waiting for user..."
              }
              editable={userJoined}
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!userJoined}
              style={{
                backgroundColor: userJoined ? "#007AFF" : "#aaa",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                marginLeft: 10,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AstrologerChatPage;

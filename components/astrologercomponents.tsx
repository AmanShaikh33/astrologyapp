import { Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  name: string;
  bio?: string;
  skills: string;
  languages: string;
  experience: string;
  price: number;
  oldPrice?: number;
  orders?: number;
  status: "online" | "offline" | "busy" | string;
  waitTime?: string;
  profilePic?: string;
};

const AstrologerCard: React.FC<Props> = ({
  name,
  bio,
  skills,
  languages,
  experience,
  price,
  oldPrice,
  orders,
  status,
  waitTime,
  profilePic,
}) => {
  const router = useRouter();

  const BASE_URL = "https://astrologyapp-1.onrender.com";

  // Normalize profilePic
  const normalizedPic =
  profilePic && profilePic.startsWith("http")
    ? profilePic
    : profilePic
    ? `${BASE_URL}/${profilePic.replace(/\\/g, "/")}`
    : null;

  return (
    <View className="flex-row items-center bg-white p-4 rounded-2xl border border-[#2d1e3f] shadow-md mb-4">
      {/* Avatar */}
      {normalizedPic ? (
        <Image
          source={{ uri: normalizedPic }}
          className="w-14 h-14 rounded-full border border-[#2d1e3f]"
        />
      ) : (
        <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center border border-[#2d1e3f]">
          <Ionicons name="person" size={40} color="#2d1e3f" />
        </View>
      )}

      {/* Info */}
      <View className="flex-1 ml-3">
        <Text className="text-lg font-bold text-[#2d1e3f]">{name}</Text>

        {bio && (
          <Text className="text-gray-500 text-sm italic">
            <Text className="font-semibold not-italic text-[#2d1e3f]">Bio: </Text>
            {bio}
          </Text>
        )}

        <Text className="text-gray-600 text-sm">
          <Text className="font-semibold text-[#2d1e3f]">Skills: </Text>
          {skills}
        </Text>

        <Text className="text-gray-600 text-sm">
          <Text className="font-semibold text-[#2d1e3f]">Languages: </Text>
          {languages}
        </Text>

        <Text className="text-xs text-[#2d1e3f]">
          <Text className="font-semibold">Exp: </Text>
          {experience} yrs
        </Text>
      </View>

      {/* Chat Button */}
      {status === "online" ? (
        <TouchableOpacity
          className="bg-[#2d1e3f] px-4 py-2 rounded-lg border border-[#e0c878]"
          onPress={() => router.push("/dashboard/chatpage")}
        >
          <Text className="text-[#e0c878] font-bold">Chat</Text>
        </TouchableOpacity>
      ) : (
        <View className="items-center">
          <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-lg border border-[#e0c878]">
            <Text className="text-[#2d1e3f] font-bold">Chat</Text>
          </TouchableOpacity>
          {waitTime && (
            <Text className="text-red-500 text-[10px] mt-1">wait ~{waitTime}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AstrologerCard;

import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ fixed

type AstrologerProps = {
  name: string;
  skills: string;
  languages: string;
  experience: string;
  price: number;
  oldPrice?: number;
  orders: number;
  status: "online" | "busy" | string;
  waitTime?: string;
};

const AstrologerComponent: React.FC<AstrologerProps> = ({
  name,
  skills,
  languages,
  experience,
  price,
  oldPrice,
  orders,
  status,
  waitTime,
}) => {
  const router = useRouter(); // ✅ fixed

  return (
    <View className="flex-row items-center bg-white p-4 rounded-2xl border border-[#2d1e3f] shadow-md mb-4">
      {/* Avatar */}
      <Ionicons name="person-circle-outline" size={56} color="#2d1e3f" />

      {/* Info Section */}
      <View className="flex-1 ml-3">
        <Text className="text-lg font-bold text-[#2d1e3f]">{name}</Text>
        <Text className="text-gray-700">{skills}</Text>
        <Text className="text-gray-700">{languages}</Text>
        <Text className="text-xs text-[#2d1e3f]">Exp- {experience}</Text>

        {/* Rating */}
        <View className="flex-row items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons key={i} name="star" size={14} color="#e0c878" />
          ))}
          <Text className="ml-1 text-[#2d1e3f]">{orders} orders</Text>
        </View>

        {/* Price */}
        <View className="flex-row items-center mt-2">
          {oldPrice !== undefined && (
            <Text className="text-gray-400 line-through mr-2">
              ₹ {oldPrice}
            </Text>
          )}
          <Text className="text-red-500 font-bold">₹ {price}/min</Text>
        </View>
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
            <Text className="text-red-500 text-[10px] mt-1">
              wait ~{waitTime}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AstrologerComponent;

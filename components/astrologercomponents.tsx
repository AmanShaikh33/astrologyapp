import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGetMyProfile } from "../api/api"; // ✅ fetch astrologer profile

type AstrologerProps = {
  // optional if we fetch from API
  showChatButton?: boolean; 
};

const AstrologerComponent: React.FC<AstrologerProps> = ({ showChatButton = true }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const data = await apiGetMyProfile(token);
        setProfile(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error || "Profile not found"}</Text>
      </View>
    );
  }

  const {
    name,
    skills,
    languages,
    experience,
    pricePerMinute,
    oldPrice,
    orders,
    availability,
    waitTime,
  } = profile;

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
            <Text className="text-gray-400 line-through mr-2">₹ {oldPrice}</Text>
          )}
          <Text className="text-red-500 font-bold">₹ {pricePerMinute}/min</Text>
        </View>
      </View>

      {/* Chat Button */}
      {showChatButton && (
        <>
          {availability === "online" ? (
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
        </>
      )}
    </View>
  );
};

export default AstrologerComponent;

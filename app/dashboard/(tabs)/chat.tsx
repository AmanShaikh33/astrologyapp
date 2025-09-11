import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AstrologerComponent from "../../../components/astrologercomponents"; // adjust path
import { apiGetApprovedAstrologers } from "../../../api/api";

type AstrologerType = {
  _id: string;
  name: string;
  skills: string;
  languages: string;
  experience: string;
  pricePerMinute: number;
  oldPrice?: number;
  orders?: number;
  availability: "online" | "offline" | "busy" | string;
  waitTime?: string;
};

const Chat = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<AstrologerType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const data = await apiGetApprovedAstrologers(); // no token needed
        setAstrologers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch astrologers");
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#2d1e3f]">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#2d1e3f]">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#e0c878"
          onPress={() => router.back()}
        />
        <Text className="text-lg font-bold text-[#e0c878] ml-[140px]">
          Chat
        </Text>
      </View>

      {/* Astrologers List */}
      <View className="px-4 mt-6">
        {astrologers.length === 0 ? (
          <Text className="text-center text-gray-500 mt-6">
            No approved astrologers available.
          </Text>
        ) : (
          astrologers.map((astro) => (
            <AstrologerComponent
              key={astro._id}
              name={astro.name}
              skills={astro.skills}
              languages={astro.languages}
              experience={astro.experience}
              price={astro.pricePerMinute || 0}
              oldPrice={astro.oldPrice}
              orders={astro.orders || 0}
              status={astro.availability}
              waitTime={astro.waitTime}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Chat;

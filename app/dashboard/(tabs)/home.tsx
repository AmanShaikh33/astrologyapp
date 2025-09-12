import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AstrologerComponent from "../../../components/astrologercomponents"; // adjust path
import { apiGetApprovedAstrologers } from "../../../api/api"; // ✅ using same API as chat.tsx

type AstrologerType = {
  _id: string;
  name: string;
  bio?: string;
  skills: string;
  languages: string;
  experience: string;
  pricePerMinute: number;
  oldPrice?: number;
  orders?: number;
  availability: "online" | "offline" | "busy" | string;
  waitTime?: string;
  profilePic?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<AstrologerType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("token");

        if (!userStr || !token) {
          router.replace("/login");
          return;
        }

        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        // ✅ fetch approved astrologers from API
        const data = await apiGetApprovedAstrologers();
        setAstrologers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("userType");
    router.replace("/login");
  };

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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#2d1e3f] px-5 pt-10 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="person-circle" size={40} color="#e0c878" />
          <Text className="text-xl font-bold text-[#e0c878] ml-2">
            Hi {user?.name || "User"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#e0c878] px-3 py-1 rounded-lg"
        >
          <Text className="text-[#2d1e3f] font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // ✅ keeps buttons visible above tab bar
      >
        {/* Search Bar */}
        <View className="px-5 mt-4">
          <View className="bg-gray-200 rounded-full px-4 py-2 flex-row items-center">
            <Ionicons name="search" size={20} color="#2d1e3f" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#555"
              className="ml-2 flex-1 text-base text-[#2d1e3f]"
            />
          </View>
        </View>

        {/* Feature Buttons */}
        <View className="flex-row justify-around mt-5 px-5">
          {[
            { icon: "sunny", label: "Daily Horoscope" },
            { icon: "grid", label: "Kundli Matching" },
            { icon: "infinite", label: "Free Kundli" },
            { icon: "chatbubble", label: "Chat" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              className="items-center"
              onPress={() => console.log(item.label)}
            >
              <View className="w-16 h-16 rounded-full bg-[#e0c878] items-center justify-center">
                <Ionicons name={item.icon as any} size={28} color="#2d1e3f" />
              </View>
              <Text className="text-xs mt-2 text-[#2d1e3f] text-center">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner */}
        <View className="px-5 mt-6">
          <Image
            source={{
              uri: "https://img.freepik.com/free-vector/zodiac-astrology-horoscope-banner_1017-31529.jpg",
            }}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
        </View>

        {/* Astrologers List */}
        <View className="px-5 mt-6">
          {astrologers.length === 0 ? (
            <Text className="text-center text-gray-500 mt-6">
              No astrologers available.
            </Text>
          ) : (
            astrologers.map((astro) => (
              <AstrologerComponent
                key={astro._id}
                name={astro.name}
                bio={astro.bio}
                skills={astro.skills}
                languages={astro.languages}
                experience={astro.experience}
                price={astro.pricePerMinute}
                oldPrice={astro.oldPrice}
                orders={astro.orders}
                status={astro.availability}
                waitTime={astro.waitTime}
                profilePic={astro.profilePic}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

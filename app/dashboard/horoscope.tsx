import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const zodiacSigns = [
  { name: "Aries", icon: "zodiac-aries" },
  { name: "Taurus", icon: "zodiac-taurus" },
  { name: "Gemini", icon: "zodiac-gemini" },
  { name: "Cancer", icon: "zodiac-cancer" },
  { name: "Leo", icon: "zodiac-leo" },
  { name: "Virgo", icon: "zodiac-virgo" },
  { name: "Libra", icon: "zodiac-libra" },
  { name: "Scorpio", icon: "zodiac-scorpio" },
  { name: "Sagittarius", icon: "zodiac-sagittarius" },
  { name: "Capricorn", icon: "zodiac-capricorn" },
  { name: "Aquarius", icon: "zodiac-aquarius" },
  { name: "Pisces", icon: "zodiac-pisces" },
];

export default function HoroscopeScreen() {
  const [selectedSign, setSelectedSign] = useState("Aries");
  const [selectedDay, setSelectedDay] = useState("Today");

  const router = useRouter();

  const horoscopeData = {
    luckyColours: ["#ff0000", "#0066ff"],
    mood: "😍",
    luckyNumber: 7,
    luckyTime: "04:26 PM",
    love: {
      percentage: 40,
      text: "Romance ignites with fiery passion today. Single Aries may encounter someone who matches their dynamic energy, while committed relationships experience renewed excitement. Express your desires boldly but with sensitivity.",
    },
    career: {
      percentage: 60,
      text: "Professional breakthroughs await as your pioneering spirit shines in the workplace. Take initiative on a new project and your determination will inspire others.",
    },
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <TouchableOpacity onPress={() => router.push("/dashboard/home")}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#e0c878] mr-[120px]">
          Daily Horoscope
        </Text>
      </View>

      <ScrollView>
       
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {zodiacSigns.map((sign) => (
            <TouchableOpacity
              key={sign.name}
              onPress={() => setSelectedSign(sign.name)}
              className={`items-center mr-4 ${
                selectedSign === sign.name ? "opacity-100" : "opacity-50"
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  selectedSign === sign.name ? "bg-[#e0c878]" : "bg-[#f5f5f5]"
                }`}
              >
                <MaterialCommunityIcons
                  name={sign.icon}
                  size={28}
                  color={selectedSign === sign.name ? "#2d1e3f" : "#444"}
                />
              </View>
              <Text
                className={`mt-1 text-xs ${
                  selectedSign === sign.name ? "text-[#2d1e3f]" : "text-gray-600"
                }`}
              >
                {sign.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Day Selector */}
        <View className="flex-row justify-center mb-4">
          {["Yesterday", "Today", "Tomorrow"].map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              className={`px-4 py-2 border rounded-full mx-1 ${
                selectedDay === day
                  ? "border-[#e0c878] bg-[#e0c878]"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={`${
                  selectedDay === day ? "text-[#2d1e3f]" : "text-gray-700"
                }`}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Card */}
        <View className="bg-[#2d1e3f] mx-4 p-4 rounded-2xl mb-4 shadow-lg">
          <Text className="text-center text-white mb-2">11-08-2025</Text>
          <Text className="text-center text-[#e0c878] mb-2">
            Your Daily Horoscope is Ready!
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-white text-sm">Lucky Colours</Text>
              <View className="flex-row mt-1">
                {horoscopeData.luckyColours.map((color, i) => (
                  <View
                    key={i}
                    style={{ backgroundColor: color }}
                    className="w-4 h-4 rounded-full mx-1"
                  />
                ))}
              </View>
            </View>
            <View className="items-center">
              <Text className="text-white text-sm">Mood</Text>
              <Text className="mt-1 text-lg">{horoscopeData.mood}</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-sm">Lucky Number</Text>
              <Text className="mt-1 text-[#e0c878]">
                {horoscopeData.luckyNumber}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-sm">Lucky Time</Text>
              <Text className="mt-1 text-[#e0c878]">
                {horoscopeData.luckyTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Love Section */}
        <View className="mx-4 mb-4 border border-[#e0c878] rounded-xl p-4 bg-[#fdf8f0]">
          <View className="flex-row items-center mb-2">
            <Ionicons name="heart" size={20} color="#2d1e3f" />
            <Text className="ml-2 font-semibold text-[#2d1e3f]">Love</Text>
            <Text className="ml-auto text-[#2d1e3f]">
              {horoscopeData.love.percentage}%
            </Text>
          </View>
          <Text className="text-gray-700">{horoscopeData.love.text}</Text>
        </View>

        {/* Career Section */}
        <View className="mx-4 mb-20 border border-[#e0c878] rounded-xl p-4 bg-[#fdf8f0]">
          <View className="flex-row items-center mb-2">
            <Ionicons name="briefcase" size={20} color="#2d1e3f" />
            <Text className="ml-2 font-semibold text-[#2d1e3f]">Career</Text>
            <Text className="ml-auto text-[#2d1e3f]">
              {horoscopeData.career.percentage}%
            </Text>
          </View>
          <Text className="text-gray-700">{horoscopeData.career.text}</Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 flex-row pb-[35px]">
        <TouchableOpacity
          onPress={() => router.push("/dashboard/(tabs)/chat")}
          className="flex-1 bg-[#e0c878] p-4 flex-row items-center justify-center"
        >
          <Ionicons name="chatbubble" size={20} color="#2d1e3f" />
          <Text className="ml-2 font-semibold text-[#2d1e3f]">
            Chat with Astrologer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

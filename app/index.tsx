import { View, Text, Image, TouchableOpacity, Animated, useWindowDimensions, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import astroappimg from "../assets/images/astroappimg.png";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("userData");
      if (token && userStr) {
        const user = JSON.parse(userStr);
        // Redirect based on role
        if (user.role === "admin") router.replace("/admindashboard/home");
        else if (user.role === "user") router.replace("/dashboard/home");
        else if (user.role === "astrologer") router.replace("/astrologerdashboard/home");
        else router.replace("/login");
      } else {
        setLoading(false); // show splash page if not logged in
      }
    };
    checkLogin();
  }, []);

  // Animation for the astrology image
  const imageScale = useRef(new Animated.Value(0.95)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageScale, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(imageScale, { toValue: 0.95, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Animation for pulsing button
  const buttonScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const stars = [
    { style: "absolute w-2 h-2 bg-[#e0c878] rounded-full top-10 left-5" },
    { style: "absolute w-3 h-3 bg-[#e0c878] rounded-full top-20 right-10" },
    { style: "absolute w-2 h-2 bg-[#e0c878] rounded-full bottom-32 left-16" },
    { style: "absolute w-3 h-3 bg-[#e0c878] rounded-full bottom-24 right-20" },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#2d1e3f]">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#2d1e3f] items-center justify-center relative px-6">
      {/* Floating Stars */}
      {stars.map((star, index) => (
        <View key={index} className={star.style} />
      ))}

      {/* Animated Astrology Image */}
      <Animated.Image
        source={astroappimg}
        className="w-[300px] h-[400px] rounded-xl mb-8 shadow-2xl"
        style={{ transform: [{ scale: imageScale }] }}
        resizeMode="cover"
      />

      {/* Welcome Text */}
      <Text className="text-[#e0c878] text-4xl font-extrabold text-center mb-2">
        Welcome
      </Text>
      <Text className="text-white text-lg text-center mb-10 px-4">
        Explore the mystical world of astrology with personalized guidance
      </Text>

      {/* Pulsing Start Now Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          activeOpacity={0.8}
          className="py-4 px-14 rounded-full"
          style={{
            backgroundColor: "#2d1e3f",
            borderWidth: 2,
            borderColor: "#e0c878",
            shadowColor: "#e0c878",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <Text className="text-white text-lg font-bold text-center">
            Start Now
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

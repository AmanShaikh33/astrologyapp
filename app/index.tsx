import { View, Text, Image, TouchableOpacity, Animated, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import astroappimg from "../assets/images/astroappimg.png";
import React, { useEffect, useRef } from "react";

export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

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

  return (
    <View className="flex-1 bg-[#2d1e3f] items-center justify-center relative px-6">

      {/* Floating Stars */}
      <View className="absolute w-2 h-2 bg-[#e0c878] rounded-full top-10 left-5" />
      <View className="absolute w-3 h-3 bg-[#e0c878] rounded-full top-20 right-10" />
      <View className="absolute w-2 h-2 bg-[#e0c878] rounded-full bottom-32 left-16" />
      <View className="absolute w-3 h-3 bg-[#e0c878] rounded-full bottom-24 right-20" />

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

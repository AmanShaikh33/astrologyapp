import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AstrologerComponent from "../../../components/astrologercomponents"; // adjust path if needed


const Chat = () => {
  
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 ">
       <View className="flex-row items-center p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#e0c878] ml-[100px]">Kundli Matching</Text>
      </View>
      <View className="px-4 mt-6">
      <AstrologerComponent
        name="Chavishka"
        skills="Tarot, Numerology"
        languages="English, Hindi"
        experience="5 Years"
        price={18}
        orders={2560}
        status="online"
      />
      <AstrologerComponent
        name="Dhaksha"
        skills="Vedic, Nadi, Numerology"
        languages="English, Hindi"
        experience="6 Years"
        price={19}
        orders={4454}
        status="busy"
        waitTime="4m"
      />
      <AstrologerComponent
        name="AjitTt"
        skills="Vedic, Nadi, Numerology"
        languages="English, Hindi"
        experience="15 Years"
        price={13}
        oldPrice={26}
        orders={36687}
        status="online"
      />
      </View>
    </ScrollView>
  );
};

export default Chat;

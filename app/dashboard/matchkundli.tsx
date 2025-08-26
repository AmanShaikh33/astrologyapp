import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function MatchKundliScreen() {
  const router = useRouter();

  const [boyName, setBoyName] = useState("");
  const [girlName, setGirlName] = useState("");
  const [boyDOB, setBoyDOB] = useState(new Date());
  const [girlDOB, setGirlDOB] = useState(new Date());
  const [boyTime, setBoyTime] = useState(new Date());
  const [girlTime, setGirlTime] = useState(new Date());
  const [boyUnknownTime, setBoyUnknownTime] = useState(false);
  const [girlUnknownTime, setGirlUnknownTime] = useState(false);

  const [pickerMode, setPickerMode] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = (mode) => {
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
    setPickerMode(null);
  };

  const handleConfirm = (selectedDate) => {
    if (pickerMode === "boyDate") setBoyDOB(selectedDate);
    if (pickerMode === "boyTime") setBoyTime(selectedDate);
    if (pickerMode === "girlDate") setGirlDOB(selectedDate);
    if (pickerMode === "girlTime") setGirlTime(selectedDate);
    hidePicker();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#e0c878] ml-[100px]">Kundli Matching</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row m-4 bg-[#604f70] rounded-xl overflow-hidden">
        <TouchableOpacity className="flex-1 py-3 bg-[#e0c878]">
          <Text className="text-center font-bold text-[#2d1e3f]">New Matching</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Boy Details */}
        <View className="bg-white rounded-2xl shadow p-4 mb-6 border border-gray-200">
          <Text className="text-center font-bold text-lg mb-4 text-[#2d1e3f]">Boy's Details</Text>

          {/* Name */}
          <Text className="text-gray-700 mb-1">Name</Text>
          <View className="flex-row items-center border border-[#e0c878] rounded-lg px-3 mb-4">
            <Ionicons name="person-outline" size={18} color="#604f70" />
            <TextInput
              placeholder="Enter name"
              placeholderTextColor="#9e8b4e"
              value={boyName}
              onChangeText={setBoyName}
              className="flex-1 ml-2 py-2 text-black"
            />
          </View>

          {/* Birth Date */}
          <Text className="text-gray-700 mb-1">Birth Date</Text>
          <TouchableOpacity
            onPress={() => showPicker("boyDate")}
            className="flex-row items-center border border-[#e0c878] rounded-lg px-3 py-3 mb-4"
          >
            <Ionicons name="calendar-outline" size={18} color="#604f70" />
            <Text className="ml-2 text-black">{boyDOB.toDateString()}</Text>
          </TouchableOpacity>

          {/* Birth Time */}
          <Text className="text-gray-700 mb-1">Birth Time</Text>
          <TouchableOpacity
            onPress={() => showPicker("boyTime")}
            className="flex-row items-center border border-[#e0c878] rounded-lg px-3 py-3 mb-2"
          >
            <Ionicons name="time-outline" size={18} color="#604f70" />
            <Text className="ml-2 text-black">
              {boyTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>

          {/* Unknown Time Switch */}
          <View className="flex-row items-center mt-2">
            <Switch value={boyUnknownTime} onValueChange={setBoyUnknownTime} />
            <Text className="ml-2 text-gray-700">Don't know my exact time of birth</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            Note: Without time of birth, we can still achieve upto 80% accurate predictions
          </Text>

          {/* Birth Place */}
          <Text className="text-gray-700 mt-4 mb-1">Birth Place</Text>
          <View className="flex-row items-center border border-[#e0c878] rounded-lg px-3">
            <Ionicons name="location-outline" size={18} color="#604f70" />
            <TextInput
              placeholder="New Delhi, Delhi, India"
              placeholderTextColor="#9e8b4e"
              className="flex-1 ml-2 py-2 text-black"
            />
          </View>
        </View>

        {/* Girl Details */}
        <View className="bg-white rounded-2xl shadow p-4 mb-20 border border-gray-200">
          <Text className="text-center font-bold text-lg mb-4 text-[#2d1e3f]">Girl's Details</Text>

          {/* Name */}
          <Text className="text-gray-700 mb-1">Name</Text>
          <View className="flex-row items-center border border-[#e0c878] rounded-lg px-3 mb-4">
            <Ionicons name="person-outline" size={18} color="#604f70" />
            <TextInput
              placeholder="Enter name"
              placeholderTextColor="#9e8b4e"
              value={girlName}
              onChangeText={setGirlName}
              className="flex-1 ml-2 py-2 text-black"
            />
          </View>

          {/* Birth Date */}
          <Text className="text-gray-700 mb-1">Birth Date</Text>
          <TouchableOpacity
            onPress={() => showPicker("girlDate")}
            className="flex-row items-center border border-[#e0c878] rounded-lg px-3 py-3 mb-4"
          >
            <Ionicons name="calendar-outline" size={18} color="#604f70" />
            <Text className="ml-2 text-black">{girlDOB.toDateString()}</Text>
          </TouchableOpacity>

          {/* Birth Time */}
          <Text className="text-gray-700 mb-1">Birth Time</Text>
          <TouchableOpacity
            onPress={() => showPicker("girlTime")}
            className="flex-row items-center border border-[#e0c878] rounded-lg px-3 py-3 mb-2"
          >
            <Ionicons name="time-outline" size={18} color="#604f70" />
            <Text className="ml-2 text-black">
              {girlTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>

          {/* Unknown Time Switch */}
          <View className="flex-row items-center mt-2">
            <Switch value={girlUnknownTime} onValueChange={setGirlUnknownTime} />
            <Text className="ml-2 text-gray-700">Don't know my exact time of birth</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            Note: Without time of birth, we can still achieve upto 80% accurate predictions
          </Text>

          {/* Birth Place */}
          <Text className="text-gray-700 mt-4 mb-1">Birth Place</Text>
          <View className="flex-row items-center border border-[#e0c878] rounded-lg px-3">
            <Ionicons name="location-outline" size={18} color="#604f70" />
            <TextInput
              placeholder="New Delhi, Delhi, India"
              placeholderTextColor="#9e8b4e"
              className="flex-1 ml-2 py-2 text-black"
            />
          </View>
        </View>
      </ScrollView>

      {/* Match Horoscope Button */}
      <TouchableOpacity className="absolute bottom-0 left-0 right-0 bg-[#e0c878] p-4 pb-[35px]">
        <Text className="text-center font-bold text-[#2d1e3f] text-lg">Match Horoscope</Text>
      </TouchableOpacity>

      {/* DateTime Picker Modal */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={pickerMode?.includes("Date") ? "date" : "time"}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
}

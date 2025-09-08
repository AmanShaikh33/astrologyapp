import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCreateProfile } from "../../../api/api";

export default function AstroForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [price, setPrice] = useState("");
  const [experience, setExperience] = useState("");
  const [profilePic, setProfilePic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0]);
    }
  };

  const handleCreateProfile = async () => {
    if (!name || !bio || !skills || !languages || !price || !experience) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("skills", skills);
      formData.append("languages", languages);
      formData.append("pricePerMinute", price);
      formData.append("experience", experience);

      if (profilePic) {
        formData.append("profilePic", {
          uri: profilePic.uri,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        setIsLoading(false);
        return;
      }

      await apiCreateProfile(token, formData);
      Alert.alert("Success", "Profile created successfully!");
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#e0c878] ml-[80px]">Create Profile</Text>
      </View>

      <ScrollView className="px-4 mt-4">
        {/* Form */}
        <View className="bg-white rounded-2xl shadow p-4 mb-20 border border-gray-200">
          {/* Name */}
          <Text className="text-gray-700 mb-1">Full Name</Text>
          <View className="flex-row items-center border border-[#e0c878] rounded-lg px-3 mb-4">
            <Ionicons name="person-outline" size={18} color="#604f70" />
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#9e8b4e"
              value={name}
              onChangeText={setName}
              className="flex-1 ml-2 py-2 text-black"
            />
          </View>

          {/* Bio */}
          <Text className="text-gray-700 mb-1">Bio</Text>
          <TextInput
            placeholder="Tell something about yourself"
            placeholderTextColor="#9e8b4e"
            value={bio}
            onChangeText={setBio}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
            multiline
          />

          {/* Skills */}
          <Text className="text-gray-700 mb-1">Skills (comma separated)</Text>
          <TextInput
            placeholder="e.g. Vedic astrology, Palmistry"
            placeholderTextColor="#9e8b4e"
            value={skills}
            onChangeText={setSkills}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
          />

          {/* Languages */}
          <Text className="text-gray-700 mb-1">Languages (comma separated)</Text>
          <TextInput
            placeholder="e.g. Hindi, English"
            placeholderTextColor="#9e8b4e"
            value={languages}
            onChangeText={setLanguages}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
          />

          {/* Price */}
          <Text className="text-gray-700 mb-1">Price per Minute (₹)</Text>
          <TextInput
            placeholder="Enter your price"
            placeholderTextColor="#9e8b4e"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
          />

          {/* Experience */}
          <Text className="text-gray-700 mb-1">Experience (years)</Text>
          <TextInput
            placeholder="Enter experience"
            placeholderTextColor="#9e8b4e"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
          />

          {/* Profile Picture */}
          <Text className="text-gray-700 mb-1">Profile Picture</Text>
          <TouchableOpacity
            className="bg-[#e0c878] py-3 rounded-lg mb-2 items-center"
            onPress={pickImage}
          >
            <Text className="text-[#2d1e3f] font-bold">
              {profilePic ? "Change Profile Picture" : "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>

          {/* Show selected image */}
          {profilePic && (
            <Image
              source={{ uri: profilePic.uri }}
              className="w-32 h-32 rounded-full self-center mb-4"
            />
          )}

          {/* Submit */}
          <TouchableOpacity
            className="bg-[#e0c878] py-3 rounded-lg mb-10 items-center"
            onPress={handleCreateProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#2d1e3f" />
            ) : (
              <Text className="text-[#2d1e3f] font-bold text-lg">Create Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

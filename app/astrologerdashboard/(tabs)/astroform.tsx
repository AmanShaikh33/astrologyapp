import React, { useState, useEffect } from "react";
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
import { apiCreateProfile, apiGetMyProfile } from "../../../api/api";

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
  const [profileExists, setProfileExists] = useState(false);


  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await apiGetMyProfile(token);
      if (res.profile) {
        setProfileExists(true);
        setName(res.profile.name || ""); 
        setBio(res.profile.bio || "");
        setSkills(res.profile.skills?.join(", ") || "");
        setLanguages(res.profile.languages?.join(", ") || "");
        setPrice(String(res.profile.pricePerMinute || ""));
        setExperience(String(res.profile.experience || ""));
        if (res.profile.profilePic) setProfilePic({ uri: res.profile.profilePic });
      }
    } catch (err) {
      console.log("No profile yet");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const pickImage = async () => {
    if (profileExists) return;
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
      formData.append("name", name); 
      formData.append("bio", bio);
      formData.append("skills", skills);
      formData.append("languages", languages);
      formData.append("pricePerMinute", price);
      formData.append("experience", experience);

      if (profilePic && !profileExists) {
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
      setProfileExists(true);
      await AsyncStorage.setItem("profileExists", "true");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#e0c878] ml-[50px]">
          {profileExists ? "Your Profile" : "Create Profile"}
        </Text>
      </View>

      <ScrollView className="px-4 mt-4">
        <View className="bg-white rounded-2xl shadow p-4 mb-20 border border-gray-200">
          {/* Name */}
          <Text className="text-gray-700 mb-1">Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#9e8b4e"
            value={name}
            onChangeText={setName}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
            editable={!profileExists}
          />

          {/* Bio */}
          <Text className="text-gray-700 mb-1">Bio</Text>
          <TextInput
            placeholder="Tell something about yourself"
            placeholderTextColor="#9e8b4e"
            value={bio}
            onChangeText={setBio}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
            multiline
            editable={!profileExists}
          />

          {/* Skills */}
          <Text className="text-gray-700 mb-1">Skills (comma separated)</Text>
          <TextInput
            placeholder="e.g. Vedic astrology, Palmistry"
            placeholderTextColor="#9e8b4e"
            value={skills}
            onChangeText={setSkills}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
            editable={!profileExists}
          />

          {/* Languages */}
          <Text className="text-gray-700 mb-1">Languages (comma separated)</Text>
          <TextInput
            placeholder="e.g. Hindi, English"
            placeholderTextColor="#9e8b4e"
            value={languages}
            onChangeText={setLanguages}
            className="border border-[#e0c878] rounded-lg px-3 py-2 mb-4 text-black"
            editable={!profileExists}
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
            editable={!profileExists}
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
            editable={!profileExists}
          />

          {/* Profile Picture */}
          <Text className="text-gray-700 mb-1">Profile Picture</Text>
          <TouchableOpacity
            className="bg-[#e0c878] py-3 rounded-lg mb-2 items-center"
            onPress={pickImage}
            disabled={profileExists}
          >
            <Text className="text-[#2d1e3f] font-bold">
              {profilePic
                ? profileExists
                  ? "Profile Picture Uploaded"
                  : "Change Profile Picture"
                : "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>

          {profilePic && (
            <Image
              source={{ uri: profilePic.uri }}
              className="w-32 h-32 rounded-full self-center mb-4"
            />
          )}

          {!profileExists && (
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
          )}

          {profileExists && (
            <View className="bg-gray-200 py-3 rounded-lg mb-10 items-center">
              <Text className="text-gray-700 font-bold text-lg">Profile Created!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

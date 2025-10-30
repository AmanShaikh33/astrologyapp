import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGetMyProfile, apiGetMe, apiUpdateProfile } from "../../../api/api";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://astrologyapp-1.onrender.com"; 


export default function Profile({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [name, setName] = useState(""); 
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [price, setPrice] = useState("");
  const [experience, setExperience] = useState("");


  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const userData = await apiGetMe(token);
      setUserName(userData.name);

      const data = await apiGetMyProfile(token);
      setProfile(data);

      
      setName(data.name || ""); 
      setBio(data.bio || "");
      setSkills(Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "");
      setLanguages(Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "");
      setPrice(data.pricePerMinute?.toString() || "");
      setExperience(data.experience?.toString() || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  
  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("name", name); 
      formData.append("bio", bio);
      formData.append("skills", skills);
      formData.append("languages", languages);
      formData.append("pricePerMinute", price);
      formData.append("experience", experience);

      await apiUpdateProfile(token, formData);

      await fetchProfile(); 
      Alert.alert("Success", "Profile updated!");
      setEditModalVisible(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500 text-lg">No profile data found</Text>
      </View>
    );
  }

  const imageUrl = profile.profilePic
    ? profile.profilePic.startsWith("http")
      ? profile.profilePic
      : `${BASE_URL}/${profile.profilePic.replace(/\\/g, "/")}`
    : null;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-[#2d1e3f] pt-[40px]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#e0c878] ml-[100px]">My Profile</Text>
      </View>

      <ScrollView className="px-4 mt-6">
        <View className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-200">
          {/* Profile Image */}
          <View className="items-center mb-6">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-32 h-32 rounded-full mb-2 border-4 border-[#e0c878] shadow-lg"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-gray-300 justify-center items-center mb-2">
                <Text className="text-gray-600">No Image</Text>
              </View>
            )}
            <Text className="text-xl font-bold text-[#2d1e3f] mt-2">{profile.name || userName}</Text>
          </View>

          
          <View className="space-y-5">
            <View>
              <Text className="text-gray-700 font-semibold mb-1">Bio</Text>
              <Text className="text-gray-800 text-base">{profile.bio}</Text>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-1">Skills</Text>
              <Text className="text-gray-800 text-base">
                {Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills}
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-1">Languages</Text>
              <Text className="text-gray-800 text-base">
                {Array.isArray(profile.languages) ? profile.languages.join(", ") : profile.languages}
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-1">Price per Minute (₹)</Text>
              <Text className="text-gray-800 text-base">{profile.pricePerMinute}</Text>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-1">Experience</Text>
              <Text className="text-gray-800 text-base">{profile.experience} years</Text>
            </View>

            <View className="mt-6">
              <Text
                className={`text-center font-semibold px-4 py-2 rounded-lg ${
                  profile.isApproved === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Approval: {profile.isApproved || "pending"}
              </Text>
            </View>
          </View>

         
          {profile.isApproved === "approved" ? (
            <TouchableOpacity
              className="bg-[#e0c878] mt-6 py-3 rounded-lg items-center"
              onPress={() => setEditModalVisible(true)}
            >
              <Text className="text-[#2d1e3f] font-bold text-lg">Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-yellow-100 mt-6 py-3 rounded-lg items-center border border-yellow-300">
              <Text className="text-yellow-700 font-semibold text-lg">
                You can edit your profile after approval.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white w-11/12 rounded-2xl p-6">
            <Text className="text-xl font-bold text-[#2d1e3f] mb-4">Edit Profile</Text>

            <ScrollView>
            
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
              />

              <TextInput
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
                multiline
              />
              <TextInput
                placeholder="Skills (comma separated)"
                value={skills}
                onChangeText={setSkills}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
              />
              <TextInput
                placeholder="Languages (comma separated)"
                value={languages}
                onChangeText={setLanguages}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
              />
              <TextInput
                placeholder="Price per Minute"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
              />
              <TextInput
                placeholder="Experience (years)"
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
              />

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="bg-gray-400 py-3 px-6 rounded-lg"
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text className="text-white font-bold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[#e0c878] py-3 px-6 rounded-lg"
                  onPress={handleUpdateProfile}
                >
                  <Text className="text-[#2d1e3f] font-bold">Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

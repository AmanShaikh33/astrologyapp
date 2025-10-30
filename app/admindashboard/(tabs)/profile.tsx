import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  apiGetAstrologersWithFilter,
  apiApproveAstrologer,
  apiRejectAstrologer,
  apiAdminDeleteAstrologer, 
} from "../../../api/api";

interface Astrologer {
  _id: string;
  name: string;
  bio: string;
  skills: string[];
  languages: string[];
  pricePerMinute: number;
  experience: number;
  profilePic?: string;
  isApproved: "pending" | "approved";
}

export default function AdminAstrologers() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Admin token not found. Please login again.");
        setLoading(false);
        return;
      }

      const data = await apiGetAstrologersWithFilter(token);
      setAstrologers(data.astrologers || []);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to fetch astrologers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await apiApproveAstrologer(token, id);
      Alert.alert("Success", "Astrologer approved!");
      fetchAstrologers();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to approve astrologer");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await apiRejectAstrologer(token, id);
      Alert.alert("Success", "Astrologer rejected!");
      fetchAstrologers();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to reject astrologer");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this astrologer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) return;

              await apiAdminDeleteAstrologer(token, id); // call backend
              Alert.alert("Success", "Astrologer deleted!");
              fetchAstrologers();
            } catch (error: any) {
              console.error(error);
              Alert.alert("Error", error.message || "Failed to delete astrologer");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  if (astrologers.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">No astrologers found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Astrologer }) => (
    <View className="bg-white p-4 mb-3 rounded-xl border border-gray-200 shadow">
      <View className="flex-row items-center mb-2">
        {item.profilePic ? (
          <Image
            source={{ uri: item.profilePic }}
            className="w-12 h-12 rounded-full mr-3"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 mr-3 justify-center items-center">
            <Text className="text-gray-600">N/A</Text>
          </View>
        )}
        <Text className="text-xl font-bold text-[#2d1e3f]">{item.name}</Text>
      </View>

      <Text className="text-lg font-semibold mb-1">Bio: {item.bio}</Text>
      <Text>Skills: {item.skills.join(", ")}</Text>
      <Text>Languages: {item.languages.join(", ")}</Text>
      <Text>Price/Min: ₹{item.pricePerMinute}</Text>
      <Text>Experience: {item.experience} yrs</Text>
      <Text
        className={`mt-1 font-semibold ${
          item.isApproved === "approved" ? "text-green-600" : "text-yellow-700"
        }`}
      >
        Status: {item.isApproved}
      </Text>

      <View className="flex-row mt-3 space-x-4">
        {item.isApproved === "pending" && (
          <>
            <TouchableOpacity
              className="bg-green-500 px-4 py-2 rounded"
              onPress={() => handleApprove(item._id)}
            >
              <Text className="text-white font-bold">Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 px-4 py-2 rounded"
              onPress={() => handleReject(item._id)}
            >
              <Text className="text-white font-bold">Reject</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Delete button */}
        <TouchableOpacity
          className="bg-gray-600 px-4 py-2 rounded"
          onPress={() => handleDelete(item._id)}
        >
          <Text className="text-white font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={astrologers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

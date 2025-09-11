import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  apiGetAstrologersWithFilter,
  apiApproveAstrologer,
  apiRejectAstrologer,
} from "../../../api/api";

interface Astrologer {
  _id: string;
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

      const data = await apiGetAstrologersWithFilter(token); // Fetch all
      setAstrologers(data.astrologers || []);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error.message || "Failed to fetch astrologers"
      );
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
      <Text className="text-lg font-bold mb-1">Bio: {item.bio}</Text>
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

      {item.isApproved === "pending" && (
        <View className="flex-row mt-3 space-x-4">
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
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <FlatList
        data={astrologers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

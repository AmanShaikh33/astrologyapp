import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserHome = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("token");

        if (!userStr || !token) {
          router.replace("/login");
          return;
        }

        const parsedUser = JSON.parse(userStr);

        if (parsedUser.role !== "admin") {
          router.replace("/login"); // if not user
          return;
        }

        setUser(parsedUser);
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("userType");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#2d1e3f]">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-[#2d1e3f]">
      <Text className="text-2xl font-bold text-[#e0c878]">
        Welcome, {user?.name || "User"}
      </Text>
      <Button title="Logout" onPress={handleLogout} color="#3c2a52" />
    </View>
  );
};

export default UserHome;

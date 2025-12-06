import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AstrologerComponent from "../../../components/astrologercomponents";
import { apiGetApprovedAstrologers, apiGetWalletBalance } from "../../../api/api";
import { BlurView } from "expo-blur"; // ⭐ BLUR IMPORT

type AstrologerType = {
  _id: string;
  name: string;
  bio?: string;
  skills: any;
  languages: any;
  experience: string;
  pricePerMinute: number;
  oldPrice?: number;
  orders?: number;
  availability: "online" | "offline" | "busy" | string;
  waitTime?: string;
  profilePic?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<AstrologerType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [walletBalance, setWalletBalance] = useState(0);

  // ⭐ Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAstro, setSelectedAstro] = useState<any>(null);

  const fetchWallet = async (userId: string) => {
    try {
      const res = await apiGetWalletBalance(userId);
      if (res.success) {
        setWalletBalance(res.balance);
      }
    } catch (err) {
      console.log("Wallet fetch error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("token");

        if (!userStr || !token) {
          router.replace("/login");
          return;
        }

        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        await fetchWallet(parsedUser._id);

        const data = await apiGetApprovedAstrologers();
        setAstrologers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#2d1e3f]">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="bg-[#2d1e3f] px-5 pt-10 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="person-circle" size={40} color="#e0c878" />
            <Text className="text-xl font-bold text-[#e0c878] ml-2">
              Hi {user?.name || "User"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-[#e0c878] px-3 py-1 rounded-lg"
          >
            <Text className="text-[#2d1e3f] font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <View className="bg-white px-3 py-1 rounded-lg">
            <Text className="text-[#2d1e3f] font-semibold">
              Coins: {walletBalance}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/dashboard/addmoney")}
            className="bg-[#e0c878] px-4 py-2 rounded-lg"
          >
            <Text className="text-[#2d1e3f] font-semibold">Add Money</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 mt-4">
          <View className="bg-gray-200 rounded-full px-4 py-2 flex-row items-center">
            <Ionicons name="search" size={20} color="#2d1e3f" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#555"
              className="ml-2 flex-1 text-base text-[#2d1e3f]"
            />
          </View>
        </View>

        <View className="px-5 mt-6">
          <Image
            source={{
              uri: "https://img.freepik.com/free-vector/zodiac-astrology-horoscope-banner_1017-31529.jpg",
            }}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
        </View>

        <View className="px-5 mt-6">
          {astrologers.length === 0 ? (
            <Text className="text-center text-gray-500 mt-6">
              No astrologers available.
            </Text>
          ) : (
            astrologers.map((astro) => (
              <AstrologerComponent
                key={astro._id}
                _id={astro._id}
                name={astro.name}
                bio={astro.bio}
                skills={astro.skills}
                languages={astro.languages}
                experience={astro.experience}
                price={astro.pricePerMinute}
                oldPrice={astro.oldPrice}
                orders={astro.orders}
                status={astro.availability}
                waitTime={astro.waitTime}
                profilePic={astro.profilePic}
                onChatPress={() => {
                  setSelectedAstro(astro);
                  setModalVisible(true);
                }}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* ⭐ BLUR MODAL ⭐ */}
      {modalVisible && selectedAstro && (
        <BlurView
          intensity={40}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="bg-white w-11/12 rounded-2xl p-6">

            {selectedAstro.profilePic && (
              <Image
                source={{
                  uri: selectedAstro.profilePic.startsWith("http")
                    ? selectedAstro.profilePic
                    : `http://10.159.170.71:5000/${selectedAstro.profilePic.replace(/\\/g, "/")}`,
                }}
                className="w-24 h-24 rounded-full self-center mb-4"
              />
            )}

            <Text className="text-xl font-bold text-center text-[#2d1e3f]">
              {selectedAstro.name}
            </Text>

            <Text className="text-gray-600 mt-3">
              <Text className="font-bold">Bio: </Text>
              {selectedAstro.bio}
            </Text>

            <Text className="text-gray-600 mt-2">
              <Text className="font-bold">Skills: </Text>
              {Array.isArray(selectedAstro.skills)
                ? selectedAstro.skills.join(", ")
                : selectedAstro.skills}
            </Text>

            <Text className="text-gray-600 mt-2">
              <Text className="font-bold">Languages: </Text>
              {Array.isArray(selectedAstro.languages)
                ? selectedAstro.languages.join(", ")
                : selectedAstro.languages}
            </Text>

            <Text className="text-gray-600 mt-2">
              <Text className="font-bold">Experience: </Text>
              {selectedAstro.experience} years
            </Text>

            <Text className="text-lg font-bold mt-4 text-center text-[#2d1e3f]">
              ₹{selectedAstro.pricePerMinute}/minute
            </Text>

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-[#2d1e3f] font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#e0c878] px-4 py-2 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                 router.push({
                   pathname: "/dashboard/chatpage",
               params: {
              astrologerId: selectedAstro._id,
             pricePerMinute: selectedAstro.pricePerMinute.toString(),
                 },
              });
                }}
              >
                <Text className="text-[#2d1e3f] font-semibold">Proceed</Text>
              </TouchableOpacity>
            </View>

          </View>
        </BlurView>
      )}
    </View>
  );
}

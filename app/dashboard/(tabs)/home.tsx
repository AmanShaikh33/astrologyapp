import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AstrologerComponent from "../../../components/astrologercomponents"
import astroimage from "../../../assets/images/astroimage.png";

export default function HomeScreen() {
  const liveAstrologers = [
    {
      id: "1",
      name: "Adiana",
      skills: "Tarot, Palmistry",
      languages: "English, Hindi",
      experience: "5 years",
      price: 50,
      oldPrice: 70,
      orders: 120,
      status: "online",
      waitTime: "5 min",
    },
    {
      id: "2",
      name: "Sulbha",
      skills: "Astrology, Numerology",
      languages: "Hindi",
      experience: "8 years",
      price: 80,
      oldPrice: 100,
      orders: 200,
      status: "busy",
      waitTime: "10 min",
    },
    {
      id: "3",
      name: "Neeli",
      skills: "Vastu, Horoscope",
      languages: "English",
      experience: "6 years",
      price: 60,
      orders: 90,
      status: "online",
    },
    {
      id: "4",
      name: "Jas",
      skills: "Palmistry, Tarot",
      languages: "Hindi, English",
      experience: "4 years",
      price: 40,
      orders: 50,
      status: "busy",
      waitTime: "15 min",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-10 pb-4 bg-[#2d1e3f]">
        <View className="flex-row items-center">
          <Ionicons
            name="person-circle-outline"
            size={40}
            color="#e0c878"
            style={{ marginRight: 12 }}
          />
          <Text className="text-lg font-semibold text-[#e0c878]">Hi User</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 my-4">
        <TouchableOpacity
          onPress={() => router.push("/dashboard/searchScreen")}
          className="flex-row items-center bg-[#604f70] rounded-full px-3 py-2"
        >
          <Ionicons name="search" size={20} color="#e0c878" />
          <Text className="ml-2 text-[#e0c878] flex-1">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Buttons */}
      <View className="flex-row justify-around mb-6 px-2">
        {[
          { icon: "sunny", label: "Daily Horoscope", onPress: () => router.push("/dashboard/horoscope") },
          { icon: "grid", label: "kundli Matching", onPress: () => router.push("/dashboard/matchkundli") },
          { icon: "infinite", label: "free Kundli", onPress: () => router.push("/dashboard/freekundli") },
          { icon: "chatbubbles", label: "Chat", onPress: () => router.push("/dashboard/(tabs)/chat") },
        ].map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress} className="items-center">
            <View className="bg-[#e0c878] w-16 h-16 rounded-full items-center justify-center">
              <Ionicons name={item.icon} size={28} color="#2d1e3f" />
            </View>
            <Text className="text-xs text-[#2d1e3f] text-center mt-1">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* App Image */}
      <View className="px-4 mb-6 items-center">
        <Image
          source={astroimage}
          style={{ width: "100%", height: 180, borderRadius: 12 }}
          resizeMode="cover"
        />
      </View>

      {/* Astrologers List */}
      <View className="px-4">
        {liveAstrologers.slice(0, 3).map((astro) => (
          <AstrologerComponent
            key={astro.id}
            name={astro.name}
            skills={astro.skills}
            languages={astro.languages}
            experience={astro.experience}
            price={astro.price}
            oldPrice={astro.oldPrice}
            orders={astro.orders}
            status={astro.status as "online" | "busy"}
            waitTime={astro.waitTime}
          />
        ))}

        {/* View More Button */}
        <TouchableOpacity
          onPress={() => router.push("/dashboard/(tabs)/chat")}
          className=""
        >
          <Text className="text-[grey] underline font-bold text-lg">View More</Text>
        </TouchableOpacity>
      </View>

   <View className="flex-row justify-around mt-6 mb-[100px]">
  {[
    { icon: "lock-closed-outline", label: "Private & Confidential" },
    { icon: "checkmark-done-outline", label: "Verified Astrologers" },
    { icon: "cash-outline", label: "Secure Payments" },
  ].map((item, index) => (
    <View key={index} className="items-center">
      <View className="bg-gray-200 w-16 h-16 rounded-full items-center justify-center mb-2">
        <Ionicons name={item.icon as any} size={28} color="#2d1e3f" />
      </View>
      <Text className="text-center text-sm text-[#2d1e3f]">{item.label}</Text>
    </View>
  ))}
</View>

    </ScrollView>
  );
}

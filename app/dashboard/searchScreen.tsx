import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import AstrologerComponent from "../../components/astrologercomponents"; // Adjust path if needed

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredAstrologers, setFilteredAstrologers] = useState([]);

  // Full astrologers list
  const astrologers = [
    {
      id: "1",
      name: "Chavishka",
      skills: "Tarot, Numerology",
      languages: "English, Hindi",
      experience: "5 Years",
      price: 18,
      orders: 2560,
      status: "online",
    },
    {
      id: "2",
      name: "Dhaksha",
      skills: "Vedic, Nadi, Numerology",
      languages: "English, Hindi",
      experience: "6 Years",
      price: 19,
      orders: 4454,
      status: "busy",
      waitTime: "4m",
    },
    {
      id: "3",
      name: "AjitTt",
      skills: "Vedic, Nadi, Numerology",
      languages: "English, Hindi",
      experience: "15 Years",
      price: 13,
      oldPrice: 26,
      orders: 36687,
      status: "online",
    },
  ];

  // Debounced search logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText.trim() === "") {
        setFilteredAstrologers(astrologers);
      } else {
        const filtered = astrologers.filter((astrologer) =>
          astrologer.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredAstrologers(filtered);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <View className="flex-1 bg-[#2d1e3f] p-4 pt-[50px]">
      {/* Search Bar */}
      <TextInput
        className="bg-[#604f70] text-[#e0c878] rounded-full px-4 py-3 text-base mb-4"
        placeholder="Search astrologer..."
        placeholderTextColor="#c9b78d"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Results */}
      {filteredAstrologers.length > 0 ? (
        <FlatList
          data={filteredAstrologers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AstrologerComponent
              name={item.name}
              skills={item.skills}
              languages={item.languages}
              experience={item.experience}
              price={item.price}
              oldPrice={item.oldPrice}
              orders={item.orders}
              status={item.status}
              waitTime={item.waitTime}
            />
          )}
          bounces={true} // ✅ enables bouncing
          keyboardShouldPersistTaps="handled" // ✅ prevents keyboard issues
          showsVerticalScrollIndicator={false} // cleaner UI
        />
      ) : (
        searchText.length > 0 && (
          <Text className="text-center text-[#c9b78d] text-lg mt-6">
            No astrologer found
          </Text>
        )
      )}
    </View>
  );
};

export default SearchScreen;

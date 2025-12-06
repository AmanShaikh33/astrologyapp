import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RazorpayCheckout from "react-native-razorpay"; 
import { apiCreateOrder, apiVerifyPayment } from "../../api/api";
import { useRouter } from "expo-router";

export default function AddMoneyScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userData");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (err) {
        console.log("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  const handleAddMoney = async (amount: number) => {
    try {
      if (!user) {
        Alert.alert("Error", "User not loaded yet");
        return;
      }

      setLoading(true);

      const order = await apiCreateOrder(amount);

      const options = {
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "AstroTalk Wallet",
        description: "Add Wallet Balance",
        order_id: order.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#2d1e3f" },
      };

      const paymentResponse = await RazorpayCheckout.open(options);

      const verifyRes = await apiVerifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        userId: user._id,
        amount,
      });

      if (verifyRes.success) {
        Alert.alert("Success", "Coins added successfully!");

        const updatedUser = {
          ...user,
          coins: verifyRes.coins,
        };

        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

        
        router.replace("/dashboard/home");  
      } else {
        Alert.alert("Payment Error", "Payment verification failed");
      }

    } catch (error: any) {
      console.log("Payment Error:", error);
      Alert.alert("Payment Failed", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#2d1e3f] justify-center items-center px-6">
      <Text className="text-3xl font-semibold mb-10" style={{ color: "#e0c878" }}>
        Add Money
      </Text>

      {[100, 200, 500, 1000].map((amount) => (
        <TouchableOpacity
          key={amount}
          onPress={() => handleAddMoney(amount)}
          className="w-full py-4 rounded-xl mb-4"
          style={{ backgroundColor: "#3c2a52" }}
          disabled={loading}
        >
          <Text className="text-center text-lg font-bold" style={{ color: "#e0c878" }}>
            Add ₹{amount}
          </Text>
        </TouchableOpacity>
      ))}

      {loading && (
        <ActivityIndicator size="large" color="#e0c878" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}

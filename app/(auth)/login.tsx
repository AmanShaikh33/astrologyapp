import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiLogin } from "../../api/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("userData");
      if (token && userStr) {
        const user = JSON.parse(userStr);
    
        if (user.role === "admin") router.replace("/admindashboard/home");
        else if (user.role === "user") router.replace("/dashboard/home");
        else if (user.role === "astrologer") router.replace("/astrologerdashboard/home");
        else router.replace("/dashboard/home");
      }
    };
    checkLoggedIn();
  }, []);

const onLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  setLoading(true);

  try {
    console.log("🚀 Attempting login with:", { email });
    const loginRes = await apiLogin({ email, password });
    console.log("📦 Raw login response:", loginRes);
    
    const token = loginRes.token;
    const user = loginRes.user || loginRes;

    console.log("✅ Login successful:", {
      token: token ? "Present" : "Missing",
      userId: user._id || user.id || "Missing",
      role: user.role || "Missing"
    });

    if (!token) throw new Error("No token returned from login");
    if (!user || !(user._id || user.id))
      throw new Error("Invalid user data returned from backend");

      const user = loginRes.user || loginRes; // adjust based on API

      // Save in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      await AsyncStorage.setItem("userType", user.role || "user");

      // Role-based redirect
      if (user.role === "admin") router.replace("/admindashboard/home");
      else if (user.role === "user") router.replace("/dashboard/home");
      else if (user.role === "astrologer") router.replace("/astrologerdashboard/home");
      else router.replace("/dashboard/home");

  } catch (error: any) {
    console.log("❌ Login Error:", error);
    Alert.alert("Login Failed", error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center px-6"
      style={{ backgroundColor: "#2d1e3f" }}
    >
      <Text
        className="text-4xl font-bold text-center mb-2"
        style={{ color: "#e0c878" }}
      >
        Welcome Back
      </Text>
      <Text className="text-center mb-10" style={{ color: "#9e8b4e" }}>
        Login to continue your journey
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#9e8b4e"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border rounded-xl px-4 py-3 mb-4 shadow-sm"
        style={{ borderColor: "#9e8b4e", backgroundColor: "#604f70", color: "#e0c878" }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#9e8b4e"
        secureTextEntry
        className="border rounded-xl px-4 py-3 mb-6 shadow-sm"
        style={{ borderColor: "#9e8b4e", backgroundColor: "#604f70", color: "#e0c878" }}
      />

      <TouchableOpacity
        onPress={onLogin}
        className="py-4 rounded-xl shadow-md"
        style={{ backgroundColor: "#3c2a52" }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#e0c878" />
        ) : (
          <Text className="text-lg font-semibold text-center" style={{ color: "#e0c878" }}>
            Login
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")} className="mt-6">
        <Text className="text-center" style={{ color: "#e0c878" }}>
          New here? <Text style={{ fontWeight: "bold", color: "#9e8b4e" }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

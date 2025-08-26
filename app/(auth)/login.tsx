import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center px-6"
      style={{ backgroundColor: "#2d1e3f" }} // Deep Purple background
    >
      {/* Title */}
      <Text
        className="text-4xl font-bold text-center mb-2"
        style={{ color: "#e0c878" }} // Golden Yellow
      >
        Welcome Back
      </Text>
      <Text
        className="text-center mb-10"
        style={{ color: "#9e8b4e" }} // Earthy Gold
      >
        Login to continue your journey
      </Text>

      {/* Email Field */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#9e8b4e" // Earthy Gold placeholder
        keyboardType="email-address"
        autoCapitalize="none"
        className="border rounded-xl px-4 py-3 mb-4 shadow-sm"
        style={{
          borderColor: "#9e8b4e", // Earthy Gold border
          backgroundColor: "#604f70", // Muted Lavender background
          color: "#e0c878", // Golden Yellow text
        }}
      />

      {/* Password Field */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#9e8b4e"
        secureTextEntry
        className="border rounded-xl px-4 py-3 mb-6 shadow-sm"
        style={{
          borderColor: "#9e8b4e",
          backgroundColor: "#604f70",
          color: "#e0c878",
        }}
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={() => console.log("Login Pressed")}
        className="py-4 rounded-xl shadow-md"
        style={{ backgroundColor: "#3c2a52" }} // Dark Plum
      >
        <Text
          className="text-lg font-semibold text-center"
          style={{ color: "#e0c878" }} // Golden Yellow text
        >
          Login
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={() => router.push("/register")} className="mt-6">
        <Text className="text-center" style={{ color: "#e0c878" }}>
          New here?{" "}
          <Text style={{ fontWeight: "bold", color: "#9e8b4e" }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

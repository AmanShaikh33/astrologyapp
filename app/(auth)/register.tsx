import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { apiRegister } from "../../api/api"; // create a simple register API function

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiRegister({ name, email, password, role }); // call your API
      Alert.alert("Success", "Registration successful!");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      style={{ backgroundColor: "#2d1e3f" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-12">
        <Text className="text-4xl font-bold text-center mb-2" style={{ color: "#e0c878" }}>
          Create Account
        </Text>
        <Text className="text-center mb-8" style={{ color: "#9e8b4e" }}>
          Sign up to get started with your journey
        </Text>

        {/* Name */}
        <TextInput
          className="border rounded-xl p-3 mb-4"
          style={{ borderColor: "#9e8b4e", backgroundColor: "#604f70", color: "#e0c878" }}
          placeholder="Full Name"
          placeholderTextColor="#9e8b4e"
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <TextInput
          className="border rounded-xl p-3 mb-4"
          style={{ borderColor: "#9e8b4e", backgroundColor: "#604f70", color: "#e0c878" }}
          placeholder="Email"
          placeholderTextColor="#9e8b4e"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <TextInput
          className="border rounded-xl p-3 mb-4"
          style={{ borderColor: "#9e8b4e", backgroundColor: "#604f70", color: "#e0c878" }}
          placeholder="Password"
          placeholderTextColor="#9e8b4e"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password */}
        <TextInput
          className="border rounded-xl p-3 mb-4"
          style={{ borderColor: "#9e8b4e", backgroundColor: "#604f70", color: "#e0c878" }}
          placeholder="Confirm Password"
          placeholderTextColor="#9e8b4e"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Role Selection */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={() => setRole("user")}
            className={`flex-1 py-3 rounded-xl mr-2 ${role === "user" ? "bg-[#3c2a52]" : "bg-[#604f70]"}`}
          >
            <Text className="text-center font-semibold" style={{ color: "#e0c878" }}>
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRole("astrologer")}
            className={`flex-1 py-3 rounded-xl ml-2 ${role === "astrologer" ? "bg-[#3c2a52]" : "bg-[#604f70]"}`}
          >
            <Text className="text-center font-semibold" style={{ color: "#e0c878" }}>
              Astrologer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="py-3 rounded-xl shadow-md mb-4"
          style={{ backgroundColor: "#3c2a52" }}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-center text-lg font-semibold" style={{ color: "#e0c878" }}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-center" style={{ color: "#e0c878" }}>
            Already have an account? <Text style={{ fontWeight: "bold", color: "#9e8b4e" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

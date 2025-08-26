import { useState } from "react";
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

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // API call placeholder
    Alert.alert("Success", "Registration successful!");
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      style={{ backgroundColor: "#2d1e3f" }} // Deep Purple background
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-12"
      >
        {/* Heading */}
        <Text
          className="text-4xl font-bold text-center mb-2"
          style={{ color: "#e0c878" }} // Golden Yellow
        >
          Create Account
        </Text>
        <Text
          className="text-center mb-8"
          style={{ color: "#9e8b4e" }} // Earthy Gold
        >
          Sign up to get started with your journey
        </Text>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="mb-1 font-medium" style={{ color: "#9e8b4e" }}>
            Full Name
          </Text>
          <TextInput
            className="border rounded-xl p-3 shadow-sm"
            style={{
              borderColor: "#9e8b4e",
              backgroundColor: "#604f70", // Muted Lavender
              color: "#e0c878", // Golden Yellow text
            }}
            placeholder="Enter your name"
            placeholderTextColor="#9e8b4e"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="mb-1 font-medium" style={{ color: "#9e8b4e" }}>
            Email
          </Text>
          <TextInput
            className="border rounded-xl p-3 shadow-sm"
            style={{
              borderColor: "#9e8b4e",
              backgroundColor: "#604f70",
              color: "#e0c878",
            }}
            placeholder="Enter your email"
            placeholderTextColor="#9e8b4e"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="mb-1 font-medium" style={{ color: "#9e8b4e" }}>
            Password
          </Text>
          <TextInput
            className="border rounded-xl p-3 shadow-sm"
            style={{
              borderColor: "#9e8b4e",
              backgroundColor: "#604f70",
              color: "#e0c878",
            }}
            placeholder="Enter your password"
            placeholderTextColor="#9e8b4e"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <Text className="mb-1 font-medium" style={{ color: "#9e8b4e" }}>
            Confirm Password
          </Text>
          <TextInput
            className="border rounded-xl p-3 shadow-sm"
            style={{
              borderColor: "#9e8b4e",
              backgroundColor: "#604f70",
              color: "#e0c878",
            }}
            placeholder="Re-enter your password"
            placeholderTextColor="#9e8b4e"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="py-3 rounded-xl shadow-md"
          style={{ backgroundColor: "#3c2a52" }} // Dark Plum
          onPress={handleRegister}
        >
          <Text
            className="text-center text-lg font-semibold"
            style={{ color: "#e0c878" }}
          >
            Register
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => router.push("/login")} className="mt-6">
          <Text className="text-center" style={{ color: "#e0c878" }}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "bold", color: "#9e8b4e" }}>Login</Text>
          </Text>
        </TouchableOpacity>

        {/* Debug / Direct to Home */}
        <TouchableOpacity
          onPress={() => router.push("/dashboard/(tabs)/home")}
          className="mt-6"
        >
          <Text className="text-center" style={{ color: "#e0c878" }}>
            Go to home page{" "}
            <Text style={{ fontWeight: "bold", color: "#9e8b4e" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

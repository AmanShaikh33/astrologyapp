// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#2d1e3f" }, // Deep Purple background
        headerStyle: { backgroundColor: "#3c2a52" }, // Dark Plum header if enabled
        headerTintColor: "#e0c878", // Golden Yellow header text/icons
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}

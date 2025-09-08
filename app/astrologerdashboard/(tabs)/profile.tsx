import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGetMyProfile } from "../../../api/api";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "http://192.168.0.174:5000"; // Your backend URL

const Profile = ({ navigation }: any) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const data = await apiGetMyProfile(token);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e0c878" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>No profile data found</Text>
      </View>
    );
  }

  const imageUrl =
    profile.profilePic?.startsWith("http") || !profile.profilePic
      ? profile.profilePic
      : `${BASE_URL}/${profile.profilePic}`;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#e0c878" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Profile Picture */}
        <View style={styles.card}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ color: "#888" }}>No Image</Text>
            </View>
          )}

          {/* Name */}
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.text}>{profile.name}</Text>

          {/* Bio */}
          <Text style={styles.label}>Bio</Text>
          <Text style={styles.text}>{profile.bio}</Text>

          {/* Skills */}
          <Text style={styles.label}>Skills</Text>
          <Text style={styles.text}>{profile.skills?.join(", ")}</Text>

          {/* Languages */}
          <Text style={styles.label}>Languages</Text>
          <Text style={styles.text}>{profile.languages?.join(", ")}</Text>

          {/* Price */}
          <Text style={styles.label}>Price per Minute (₹)</Text>
          <Text style={styles.text}>{profile.pricePerMinute}</Text>

          {/* Experience */}
          <Text style={styles.label}>Experience</Text>
          <Text style={styles.text}>{profile.experience} years</Text>

          {/* Approval Status */}
          <Text
            style={[
              styles.approval,
              profile.isApproved === "approved"
                ? styles.approved
                : styles.pending,
            ]}
          >
            Approval: {profile.isApproved || "pending"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d1e3f",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d1e3f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#604f70",
    paddingTop: 50,
    backgroundColor: "#2d1e3f",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e0c878",
    marginLeft: 80,
  },
  formContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  image: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
  },
  placeholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#604f70",
    marginTop: 8,
  },
  text: {
    alignSelf: "flex-start",
    color: "#2d1e3f",
    marginBottom: 4,
    fontSize: 16,
  },
  approval: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  approved: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
});

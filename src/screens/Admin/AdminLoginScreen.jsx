import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

const BACKEND_BASE_URL = "http://192.168.1.211:5000"; // Your backend IP or URL

const AdminLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/teacher-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Login Success", "Welcome, Teacher!");
        // Pass username to TeacherDashboard through navigation params
        navigation.replace("Teacherdashboard", { username: username.trim() });
      } else {
        Alert.alert("Error", data.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Network error during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.panelTitle}>Admin Login</Text>
      <View style={styles.card}>
        <Image
          source={require("../../assets/logo_standford.png")}
          style={styles.logo}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleAdminLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Log In</Text>
          )}
        </TouchableOpacity>
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.separatorLine} />
        </View>
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.switchBtnText}>Switch to Parent Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigation.navigate("StudentLogin")}
        >
          <Text style={styles.switchBtnText}>Switch to Student Login</Text>
        </TouchableOpacity>
        {/* New Admin registration button */}
        <TouchableOpacity
          style={[styles.switchBtn, styles.registerBtn]}
          onPress={() => navigation.navigate("AdminRegistration")}
        >
          <Text style={[styles.switchBtnText, styles.registerBtnText]}>
            New Admin? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    justifyContent: "center",
    alignItems: "center",
  },
  panelTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#008000",
    textAlign: "center",
    marginBottom: 36,
  },
  card: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    alignItems: "center",
  },
  logo: { width: 80, height: 80, resizeMode: "contain", marginBottom: 18 },
  label: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
    marginTop: 10,
    color: "#26344a",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    marginBottom: 10,
    fontSize: 15,
    color: "#000",
  },
  passwordInput: {
    color: "#000",
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  loginBtnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  orText: { marginHorizontal: 12, fontSize: 15, color: "#aaa" },
  switchBtn: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#6fcf6f",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9fbfc",
  },
  switchBtnText: { color: "#008000", fontSize: 16, fontWeight: "500" },
  registerBtn: {
    marginTop: 10,
    backgroundColor: "#008000",
  },
  registerBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AdminLoginScreen;

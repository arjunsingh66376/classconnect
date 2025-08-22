import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, ActivityIndicator } from "react-native";

const BACKEND_BASE_URL = "http://192.168.1.211:5000"; // Your backend URL

const AdminRegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [classes, setClasses] = useState(""); // comma separated classes
  const [username, setUsername] = useState("");
  const [empId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Register handler
  const handleRegister = async () => {
    if (!name.trim() || !username.trim() || !empId.trim() || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const classesArray = classes.split(",").map(c => c.trim()).filter(c => c.length > 0);

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/teachers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          class: classesArray,
          username: username.trim(),
          empId: empId.trim(),
          email: email.trim(),
          contact: contact.trim(),
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Registration Successful", "You can now log in");
        navigation.navigate("AdminLogin");
      } else {
        Alert.alert("Registration Failed", data.error || "Unknown error");
      }
    } catch (error) {
      Alert.alert("Error", "Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.panelTitle}>Admin Registration</Text>
      <View style={styles.card}>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Class(es) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter classes (comma separated)"
          value={classes}
          onChangeText={setClasses}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Username *</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Employee ID *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter employee ID"
          value={empId}
          onChangeText={setEmpId}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number (optional)"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate("AdminLogin")}>
          <Text style={styles.switchBtnText}>Back to Login</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 22,
    backgroundColor: "#f2f4f7",
    flexGrow: 1,
    justifyContent: "center",
  },
  panelTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#008000",
    textAlign: "center",
    marginBottom: 36,
  },
  card: {
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
  registerBtn: {
    width: "100%",
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
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
  switchBtnText: {
    color: "#008000",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AdminRegistrationScreen;

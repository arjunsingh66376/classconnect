import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";

const BACKEND_BASE_URL = "http://192.168.1.211:5000"; // Your backend IP or URL

const ParentLoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send OTP handler
  const handleSendOTP = async () => {
    if (!emailOrPhone.trim()) {
      Alert.alert("Error", "Please enter your email or phone");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: emailOrPhone.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        Alert.alert("Success", "OTP sent successfully! Please check your phone.");
      } else {
        Alert.alert("Error", data.error || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: emailOrPhone.trim(), otp: otp.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Login Success", "Welcome!");
        navigation.replace("Dashboard");
      } else {
        Alert.alert("Error", data.error || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.panelTitle}>Parent Login</Text>
      <View style={styles.card}>
        <Image source={require("../../assets/logo_standford.png")} style={styles.logo} />
        <Text style={styles.label}>Email or Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or phone"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          editable={!otpSent}
        />
        {otpSent && (
          <>
            <Text style={styles.label}>One-Time Password (OTP)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              value={otp}
              keyboardType="numeric"
              maxLength={6}
              onChangeText={setOtp}
            />
          </>
        )}

        {!otpSent ? (
          <TouchableOpacity style={styles.loginBtn} onPress={handleSendOTP} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Send OTP</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={handleVerifyOTP} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
          </TouchableOpacity>
        )}

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate("StudentLogin")}>
          <Text style={styles.switchBtnText}>Switch to Student Login</Text>
        </TouchableOpacity>
        {/* NEW BUTTON FOR ADMIN/TEACHER LOGIN */}
        <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate("AdminLogin")}>
          <Text style={styles.switchBtnText}>Switch to Admin Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7", justifyContent: "center", alignItems: "center" },
  panelTitle: { fontSize: 28, fontWeight: "bold", color: "#447ca8", textAlign: "center", marginBottom: 36 },
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
  label: { alignSelf: "flex-start", fontSize: 15, fontWeight: "bold", marginBottom: 3, marginTop: 10, color: "#26344a" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    marginBottom: 10,
    fontSize: 15,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#447ca8",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  loginBtnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  separator: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 15 },
  separatorLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  orText: { marginHorizontal: 12, fontSize: 15, color: "#aaa" },
  switchBtn: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#92b4d0",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9fbfc",
  },
  switchBtnText: { color: "#447ca8", fontSize: 16, fontWeight: "500" },
});

export default ParentLoginScreen;

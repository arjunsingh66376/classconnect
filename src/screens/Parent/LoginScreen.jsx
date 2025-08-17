import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo Section */}
        <Image
          source={require("../../assets/logo_standford.png")} // REPLACE WITH YOUR LOGO
          style={styles.logo}
        />

        {/* Email/Phone Label & Input */}
        <Text style={styles.label}>Email or Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or phone"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
        />

        {/* OTP Label & Input */}
        <Text style={styles.label}>One-Time Password (OTP)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit OTP"
          value={otp}
          keyboardType="numeric"
          maxLength={6}
          onChangeText={setOtp}
        />

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Log In</Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <View style={styles.separator}>
          <View style={styles.separatorLine}></View>
          <Text style={styles.orText}>or</Text>
          <View style={styles.separatorLine}></View>
        </View>

        {/* Switch to Student Login */}
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigation.navigate("StudentLoginScreen")}
        >
          <Text style={styles.switchBtnText}>Switch to Student Login</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity>
          <Text style={styles.signupText}>New User? Sign Up Here</Text>
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
    alignItems: "center"
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
    alignItems: "center"
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 18
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
    marginTop: 10,
    color: "#26344a"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    marginBottom: 10,
    fontSize: 15
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#447ca8", // match blue in screenshot
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold"
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 15,
    color: "#aaa"
  },
  switchBtn: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#92b4d0",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9fbfc"
  },
  switchBtnText: {
    color: "#447ca8",
    fontSize: 16,
    fontWeight: "500"
  },
  signupText: {
    color: "#447ca8",
    fontSize: 14,
    marginTop: 2,
    textDecorationLine: "underline"
  }
});

export default LoginScreen;

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from "react-native";
import Card from "../../Components/Card";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { getFees } from "../../api/fees";
import { mockAttendance, mockReports } from "../../utils/MockData";

const { width: screenWidth } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const studentId = "101";
  const [fees, setFees] = useState(null);

  useEffect(() => {
    getFees(studentId).then(setFees);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Profile Section fully stretched */}
        <View style={[styles.profileCardContainer, { width: screenWidth }]}>
          <View style={styles.profileCard}>
            <Image
              source={require("../../assets/student1.jpg")}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.profileName}>Amit Sharma</Text>
              <Text style={styles.profileDetails}>Class: 8th, Roll No: 101</Text>
            </View>
          </View>
        </View>

        {/* Other content with padding */}
        <View style={styles.paddedContent}>
          <Header title="Parent Dashboard" />

          {fees && (
            <Card style={styles.feeCard}>
              <Text style={styles.sectionTitle}>💰 Fees</Text>
              <Text style={styles.info}>Paid: ₹{fees.paid}</Text>
              <Text style={[styles.info, fees.remaining > 0 && styles.alert]}>
                Remaining: ₹{fees.remaining}
              </Text>
              <Button text="View Fee Details" onPress={() => navigation.navigate("FeesScreen")} />
            </Card>
          )}

          <Card style={styles.attendanceCard}>
            <Text style={styles.sectionTitle}>📅 Attendance</Text>
            <Text style={styles.info}>Present: {mockAttendance[studentId].present}</Text>
            <Text style={styles.info}>Absent: {mockAttendance[studentId].absent}</Text>
            <Button text="View Attendance" onPress={() => navigation.navigate("AttendanceScreen")} />
          </Card>

          <Card style={styles.reportCard}>
            <Text style={styles.sectionTitle}>📊 Reports Card (Term 1)</Text>
            {Object.entries(mockReports[studentId].term1).map(([sub, mark]) => (
              <Text key={sub} style={styles.info}>{sub}: {mark}</Text>
            ))}
            <Button text="View Full Report" onPress={() => navigation.navigate("Report")} />
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Dashboard")}>
          <Image source={require("../../assets/home.png")} style={styles.navIcon} />
          <Text style={[styles.navText, { color: "#1976d2" }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Notifications")}>
          <Image source={require("../../assets/notification.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../../assets/profile.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  profileCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileDetails: {
    fontSize: 15,
    color: "#666",
  },
  paddedContent: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  alert: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  feeCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#2196F3",
  },
  attendanceCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  reportCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#FFC107",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  navTab: {
    alignItems: "center",
    padding: 8,
  },
  navIcon: {
    width: 22,
    height: 22,
    marginBottom: 3,
  },
  navText: {
    fontSize: 13,
    color: "#888",
  },
});

export default DashboardScreen;

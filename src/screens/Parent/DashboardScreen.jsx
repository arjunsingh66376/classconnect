import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import Card from "../../Components/Card";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { getFees } from "../../api/fees";
import { mockAttendance, mockReports } from "../../utils/MockData";

const DashboardScreen = ({ navigation }) => {
  const studentId = "101";
  const [fees, setFees] = useState(null);

  useEffect(() => {
    getFees(studentId).then(setFees);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={require("../../assets/logo_standford.png")} // use a placeholder image
          style={styles.avatar}
        />
        <View>
          <Text style={styles.profileName}>Amit Sharma</Text>
          <Text style={styles.profileDetails}>Class: 8th, Roll No: 101</Text>
        </View>
      </View>

      <Header title="Parent Dashboard" />

      {/* Fees Card */}
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

      {/* Attendance Card */}
      <Card style={styles.attendanceCard}>
        <Text style={styles.sectionTitle}>📅 Attendance</Text>
        <Text style={styles.info}>Present: {mockAttendance[studentId].present}</Text>
        <Text style={styles.info}>Absent: {mockAttendance[studentId].absent}</Text>
        <Button text="View Attendance" onPress={() => navigation.navigate("AttendanceScreen")} />
      </Card>

      {/* Reports Card */}
      <Card style={styles.reportCard}>
        <Text style={styles.sectionTitle}>📊 Reports (Term 1)</Text>
        {Object.entries(mockReports[studentId].term1).map(([sub, mark]) => (
          <Text key={sub} style={styles.info}>{sub}: {mark}</Text>
        ))}
        <Button text="View Full Report" onPress={() => navigation.navigate("ReportsScreen")} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  alert: { color: "#d32f2f", fontWeight: "bold" },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 15,
    backgroundColor: "#eee"
  },
  profileName: { fontSize: 20, fontWeight: "bold" },
  profileDetails: { fontSize: 15, color: "#666" },
  feeCard: { borderLeftWidth: 5, borderLeftColor: "#2196F3" },
  attendanceCard: { borderLeftWidth: 5, borderLeftColor: "#4CAF50" },
  reportCard: { borderLeftWidth: 5, borderLeftColor: "#FFC107" },
});

export default DashboardScreen;

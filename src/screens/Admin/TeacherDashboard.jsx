import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

const BACKEND_BASE_URL = "http://192.168.1.211:5000"; // Your backend IP

const TeacherDashboard = ({ navigation }) => {
  // Change this to student admission ID to fetch
  const studentId = "stu001";

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    fetchStudentData(studentId);
  }, []);

  const fetchStudentData = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/students/${id}`);
      if (!response.ok) throw new Error("Failed to fetch student data");
      const data = await response.json();
      setStudentData(data);
      setProfilePic(data.profilePicUrl || null);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008000" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (!studentData) {
    return (
      <View style={styles.centered}>
        <Text>No student data found.</Text>
      </View>
    );
  }

  // Extract teacher info substitute
  const teacherName = studentData.name || "Teacher Name"; // Use student's name as placeholder
  const teacherClass = studentData.class || "Class info";
  const empId = studentData.emp_id || "EmpID-123"; // If emp_id not in data, replace or remove

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={[styles.profileCardContainer, { width: screenWidth }]}>
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Image
                source={profilePic ? { uri: profilePic } : require("../../assets/default_user.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.studentInfoContainer}>
              <Text style={styles.profileName}>{teacherName}</Text>
              <Text style={styles.profileDetails}>Class: {teacherClass}</Text>
              <Text style={styles.profileDetails}>Employee ID: {empId}</Text>
            </View>
          </View>
        </View>
        <View style={styles.paddedContent}>

          {/* Fees Card */}
          <View style={[styles.card, styles.feeCard]}>
            <Text style={styles.sectionTitle}>💰 Fees</Text>
            <Text style={styles.info}>Paid: ₹{studentData.fees?.totalPaid || 0}</Text>
            <Text style={[styles.info, studentData.fees?.remainingFees > 0 && styles.alert]}>
              Remaining: ₹{studentData.fees?.remainingFees || 0}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("View Fee Details", "Feature coming soon!")}
            >
              <Text style={styles.buttonText}>View Fee Details</Text>
            </TouchableOpacity>
          </View>

          {/* Attendance Card */}
          <View style={[styles.card, styles.attendanceCard]}>
            <Text style={styles.sectionTitle}>📅 Attendance</Text>
            <Text style={styles.info}>Present: {studentData.attendanceSummary?.presentCount || 0}</Text>
            <Text style={styles.info}>Absent: {studentData.attendanceSummary?.absentCount || 0}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("View Attendance", "Feature coming soon!")}
            >
              <Text style={styles.buttonText}>View Attendance</Text>
            </TouchableOpacity>
          </View>

          {/* Report Card */}
          <View style={[styles.card, styles.reportCard]}>
            <Text style={styles.sectionTitle}>📊 Report Card</Text>
            {studentData.reportCards && studentData.reportCards.length > 0 ? (
              studentData.reportCards.map((report, idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>Term {report.term}</Text>
                  {report.subjects.map((subject, sidx) => (
                    <Text key={sidx} style={styles.info}>
                      {subject.name}: {subject.score} / {subject.max} ({subject.grade}) - {subject.remark}
                    </Text>
                  ))}
                  <Text style={[styles.info, { fontStyle: "italic" }]}>
                    Teacher Remark: {report.teacherRemark?.text} (Final Grade: {report.teacherRemark?.finalGrade})
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.info}>No report cards available.</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("View Full Report", "Feature coming soon!")}
            >
              <Text style={styles.buttonText}>View Full Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Profile Picture Modal */}
      <Modal visible={showModal} animationType="fade" transparent onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPressOut={() => setShowModal(false)}>
          <View style={styles.modalContent}>
            <Image
              source={profilePic ? { uri: profilePic } : require("../../assets/default_user.png")}
              style={styles.dpLarge}
            />
            {/* Add buttons here to upload or remove profile pic if you want */}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { flex: 1, backgroundColor: "#f9f9f9" },
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
  profileCard: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#eee" },
  studentInfoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: { fontSize: 20, fontWeight: "bold" },
  profileDetails: { fontSize: 15, color: "#666" },
  paddedContent: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  alert: { color: "#d32f2f", fontWeight: "bold" },
  feeCard: { borderLeftWidth: 5, borderLeftColor: "#2196F3", marginBottom: 16, paddingLeft: 10 },
  attendanceCard: { borderLeftWidth: 5, borderLeftColor: "#4CAF50", marginBottom: 16, paddingLeft: 10 },
  reportCard: { borderLeftWidth: 5, borderLeftColor: "#FFC107", marginBottom: 32, paddingLeft: 10 },
  button: {
    backgroundColor: "#008000",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  dpLarge: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
});

export default TeacherDashboard;

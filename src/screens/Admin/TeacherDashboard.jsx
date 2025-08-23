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
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../Components/Card";
import Header from "../../Components/Header";
import ButtonComp from "../../Components/Button";
import ImageCropPicker from "react-native-image-crop-picker";

const { width: screenWidth } = Dimensions.get("window");
const BACKEND_BASE_URL = "http://192.168.1.211:5000"; // Your backend IP

async function requestStoragePermission() {
  if (Platform.OS !== "android") return true;
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ];
    if (Platform.Version < 33) {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const anyGranted = Object.values(granted).some(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );
    if (!anyGranted) {
      Alert.alert(
        "Permission required",
        "Storage permission is required to select a profile picture. Please enable it in Settings."
      );
    }
    return anyGranted;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const TeacherDashboard = ({ navigation, route }) => {
  const teacherUsername = route.params?.username;

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teacherUsername) {
      Alert.alert("Error", "No teacher username provided");
      return;
    }
    fetchTeacherInfo(teacherUsername);
  }, [teacherUsername]);

  const fetchTeacherInfo = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/teachers/${username}`);
      if (!response.ok) throw new Error("Failed to fetch teacher info");
      const data = await response.json();
      setTeacherInfo(data);
      setProfilePic(data.profilePicUrl || null);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getExtensionFromMime = (mime) => {
    if (!mime) return "jpg";
    const ext = mime.split("/")[1];
    return ext && ext.length < 6 ? ext : "jpg";
  };

  const uploadPhoto = async (username, uri, mime) => {
    const ext = getExtensionFromMime(mime);
    const filename = `teacher_${username}.${ext}`;
    const data = new FormData();
    data.append("photo", {
      uri,
      name: filename,
      type: mime || `image/${ext}`,
    });
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/teachers/${username}/upload-photo`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (res.ok) {
        return json.profilePicUrl;
      } else {
        Alert.alert("Upload Failed", json.error || "Unknown error");
        return null;
      }
    } catch (err) {
      Alert.alert("Upload Error", err.message);
      return null;
    }
  };

  const selectImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;
    try {
      const picked = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });
      if (picked && picked.path && picked.mime) {
        const uploadedUrl = await uploadPhoto(teacherUsername, picked.path, picked.mime);
        if (uploadedUrl) {
          setProfilePic(uploadedUrl);
        }
      }
    } catch (err) {
      if (err.code === "E_PICKER_CANCELLED") {
        // user cancelled
      } else {
        Alert.alert("ImagePicker Error", err.message || "Unknown error");
      }
    }
  };

  const removeImage = () => {
    Alert.alert(
      "Remove Profile Picture",
      "Are you sure you want to remove the profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setProfilePic(null),
        },
      ]
    );
  };

  // Combine base URL with relative path for React Native <Image />
  const fullProfilePicUrl =
    profilePic && !profilePic.startsWith("http")
      ? BACKEND_BASE_URL + profilePic
      : profilePic;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008000" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (!teacherInfo) {
    return (
      <View style={styles.centered}>
        <Text>No teacher data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={[styles.profileCardContainer, { width: screenWidth }]}>
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Image
                source={fullProfilePicUrl ? { uri: fullProfilePicUrl } : require("../../assets/default_user.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.studentInfoContainer}>
              <Text style={styles.profileName}>{teacherInfo.name}</Text>
              <Text style={styles.profileDetails}>
                Class: {Array.isArray(teacherInfo.class) ? teacherInfo.class.join(", ") : teacherInfo.class}
              </Text>
              <Text style={styles.profileDetails}>Employee ID: {teacherInfo.empId}</Text>
              <Text style={styles.profileDetails}>Email: {teacherInfo.email || "N/A"}</Text>
              {/* <Text style={styles.profileDetails}>Contact: {teacherInfo.contact || "N/A"}</Text> */}
            </View>
          </View>
        </View>

        <View style={styles.paddedContent}>
          <Header title="Teacher Dashboard" />
          <Card style={styles.feeCard}>
            <Text style={styles.sectionTitle}>💰 Fees</Text>
            <Text style={styles.info}>Paid: ₹{teacherInfo.fees?.totalPaid || 0}</Text>
            <Text style={[styles.info, teacherInfo.fees?.remainingFees > 0 && styles.alert]}>
              Remaining: ₹{teacherInfo.fees?.remainingFees || 0}
            </Text>
            <ButtonComp text="View Fee Details" onPress={() => Alert.alert("Feature coming soon!")} />
          </Card>
          <Card style={styles.attendanceCard}>
            <Text style={styles.sectionTitle}>📅 Attendance</Text>
            <Text style={styles.info}>
              Present: {teacherInfo.attendanceSummary?.presentCount || 0}
            </Text>
            <Text style={styles.info}>
              Absent: {teacherInfo.attendanceSummary?.absentCount || 0}
            </Text>
            <ButtonComp text="View Attendance" onPress={() => Alert.alert("Feature coming soon!")} />
          </Card>
          <Card style={styles.reportCard}>
            <Text style={styles.sectionTitle}>📊 Report Card</Text>
            {teacherInfo.reportCards && teacherInfo.reportCards.length > 0 ? (
              teacherInfo.reportCards.map((report, idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>Term {report.term}</Text>
                  {report.subjects.map((subject, sidx) => (
                    <Text key={sidx} style={styles.info}>
                      {subject.name}: {subject.score} / {subject.max} ({subject.grade}) -{" "}
                      {subject.remark}
                    </Text>
                  ))}
                  <Text style={[styles.info, { fontStyle: "italic" }]}>
                    Teacher Remark: {report.teacherRemark?.text} (Final Grade:{" "}
                    {report.teacherRemark?.finalGrade})
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.info}>No report cards available.</Text>
            )}
            <ButtonComp text="View Full Report" onPress={() => Alert.alert("Feature coming soon!")} />
          </Card>
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPressOut={() => setShowModal(false)}>
          <View style={styles.modalContent}>
            <Image
              source={fullProfilePicUrl ? { uri: fullProfilePicUrl } : require("../../assets/default_user.png")}
              style={styles.dpLarge}
            />
            <TouchableOpacity
              style={styles.dpEditIcon}
              onPress={() => {
                setShowModal(false);
                setTimeout(selectImage, 250);
              }}
            >
              <Image source={require("../../assets/pencil.png")} style={styles.iconLarge} />
            </TouchableOpacity>
            {profilePic && (
              <TouchableOpacity
                style={styles.dpRemoveIcon}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(removeImage, 250);
                }}
              >
                <Image source={require("../../assets/trash.png")} style={styles.iconLarge} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

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
  profileDetails: { fontSize: 15, color: "#666", marginTop: 2 },
  paddedContent: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  alert: { color: "#d32f2f", fontWeight: "bold" },
  feeCard: { borderLeftWidth: 5, borderLeftColor: "#2196F3", marginBottom: 16, paddingLeft: 10 },
  attendanceCard: { borderLeftWidth: 5, borderLeftColor: "#4CAF50", marginBottom: 16, paddingLeft: 10 },
  reportCard: { borderLeftWidth: 5, borderLeftColor: "#FFC107", marginBottom: 32, paddingLeft: 10 },
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
  navTab: { alignItems: "center", padding: 8 },
  navIcon: { width: 22, height: 22, marginBottom: 3 },
  navText: { fontSize: 13, color: "#888" },
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
  dpEditIcon: {
    position: "absolute",
    bottom: 15,
    right: 45,
    backgroundColor: "#1976d2",
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 8,
  },
  dpRemoveIcon: {
    position: "absolute",
    bottom: 15,
    left: 45,
    backgroundColor: "#d32f2f",
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 8,
  },
  iconLarge: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
});

export default TeacherDashboard;

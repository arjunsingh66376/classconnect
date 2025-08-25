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
import ImagePicker from "react-native-image-crop-picker";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");
const BACKEND_URL = "http://192.168.1.211:5000"; // Adjust backend

async function requestPermission() {
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
    return Object.values(granted).every((v) => v === PermissionsAndroid.RESULTS.GRANTED);
  } catch {
    return false;
  }
}

const TeacherDashboard = ({ navigation, route }) => {
  const teacherUsername = route?.params?.username;

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!teacherUsername) {
      Alert.alert("Error", "No teacher username provided");
      return;
    }
    fetchTeacher();
  }, [teacherUsername]);

  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/teachers/${teacherUsername}`);
      if (!resp.ok) throw new Error("Failed to fetch teacher data");
      const json = await resp.json();
      setTeacherInfo(json);
      setProfilePic(json.profilePicUrl ? buildUrl(json.profilePicUrl) : null);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const buildUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  const getExtension = (mime) => {
    if (!mime) return "jpg";
    const ext = mime.split("/")[1];
    return ext && ext.length < 6 ? ext : "jpg";
  };

  const uploadPhoto = async (username, uri, mime) => {
    const ext = getExtension(mime);
    const data = new FormData();
    data.append("photo", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name: `profile_${username}.${ext}`,
      type: mime || `image/${ext}`,
    });

    try {
      const resp = await fetch(`${BACKEND_URL}/api/teachers/${username}/upload-photo`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: data,
      });
      const json = await resp.json();
      if (resp.ok) return buildUrl(json.profilePicUrl);
      else {
        Alert.alert("Upload Failed", json.error || "Unknown error");
        return null;
      }
    } catch (e) {
      Alert.alert("Upload Error", e.message);
      return null;
    }
  };

  const selectImage = async () => {
    const perm = await requestPermission();
    if (!perm) return;
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.7,
        mediaType: "photo",
      });
      if (image.path && image.mime) {
        const url = await uploadPhoto(teacherUsername, image.path, image.mime);
        if (url) setProfilePic(url);
      }
    } catch (e) {
      if (e.code !== "E_PICKER_CANCELLED") Alert.alert("Picker Error", e.message);
    }
  };

  const removeImage = () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setProfilePic(null) },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008000" />
        <Text style={{ color: "#008000" }}>Loading data...</Text>
      </View>
    );
  }

  if (!teacherInfo) {
    return (
      <View style={styles.centered}>
        <Text>No teacher info found.</Text>
      </View>
    );
  }

  // Custom Edit button component for consistency
  const EditButtonWithLabel = ({ onPress, label }) => (
    <TouchableOpacity style={styles.editBtnWrapper} onPress={onPress}>
      <View style={styles.editBtnCircle}>
        <Image
          source={require("../../assets/pencil.png")}
          style={styles.editBtnIcon}
        />
      </View>
      <Text style={styles.editBtnLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={[styles.profileCardContainer, { width: screenWidth }]}>
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Image
                source={profilePic ? { uri: profilePic } : require("../../assets/default_user.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.studentInfoContainer}>
              <Text style={styles.profileName}>{teacherInfo.name}</Text>
              <Text style={styles.profileDetail}>
                Class: {Array.isArray(teacherInfo.class) ? teacherInfo.class.join(", ") : teacherInfo.class}
              </Text>
              <Text style={styles.profileDetail}>Employee ID: {teacherInfo.empId}</Text>
              <Text style={styles.profileDetail}>Email: {teacherInfo.email || "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.paddedContent}>
          <Header title="Teacher Dashboard" />

          {/* Fees */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>💰 Fees</Text>
            <Text style={styles.info}>Paid: ₹{teacherInfo.fees?.totalPaid || 0}</Text>
            <Text style={[styles.info, teacherInfo.fees?.remainingFees > 0 && styles.alert]}>
              Remaining: ₹{teacherInfo.fees?.remainingFees || 0}
            </Text>
            <View style={styles.btnRow}>
              <ButtonComp
                text="View Fee Details"
                onPress={() => Alert.alert("Feature coming soon!")}
                style={styles.greenButton}
                textStyle={styles.greenButtonText}
              />
              <EditButtonWithLabel
                label="Edit Record"
                onPress={() => navigation.navigate("EditRecord")}
              />
            </View>
          </Card>

          {/* Attendance */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>📅 Attendance</Text>
            <Text style={styles.info}>Present: {teacherInfo.attendanceSummary?.presentCount || 0}</Text>
            <Text style={styles.info}>Absent: {teacherInfo.attendanceSummary?.absentCount || 0}</Text>
            <View style={styles.btnRow}>
              <ButtonComp
                text="View Attendance"
                onPress={() => Alert.alert("feature is  coming soon")}
                style={styles.greenButton}
                textStyle={styles.greenButtonText}
              />
              <EditButtonWithLabel
                label="Edit Record"
                onPress={() =>navigation.navigate("EditRecord")}
              />
            </View>
          </Card>

          {/* Report Card */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>📊 Report Card</Text>
            {teacherInfo.reportCards && teacherInfo.reportCards.length > 0 ? (
              teacherInfo.reportCards.map((report, idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>Term {report.term}</Text>
                  {report.subjects.map((subject, sid) => (
                    <Text key={sid} style={styles.info}>
                      {`${subject.name}: ${subject.score} / ${subject.max} (${subject.grade}) - ${
                        subject.remark
                      }`}
                    </Text>
                  ))}
                  <Text style={styles.info}>
                    Teacher Remark: {report.teacherRemark?.text} (Final Grade: {report.teacherRemark?.finalGrade})
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.info}>No report cards available</Text>
            )}
            <View style={styles.btnRow}>
              <ButtonComp
                text="View Full Report"
                onPress={() => Alert.alert("feature is  coming soon")}
                style={styles.greenButton}
                textStyle={styles.greenButtonText}
              />
              <EditButtonWithLabel
                label="Edit Record"
                onPress={() => navigation.navigate("EditRecord")}
              />
            </View>
          </Card>
        </View>

        {/* Modal for image */}
        <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={() => setShowModal(false)}>
            <View style={styles.modalContent}>
              <Image
                source={profilePic ? { uri: profilePic } : require("../../assets/default_user.png")}
                style={styles.largeProfilePic}
              />
              <TouchableOpacity
                style={styles.dpEdit}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => selectImage(), 250);
                }}
              >
                <Image source={require("../../assets/pencil.png")} style={styles.iconLarge} />
              </TouchableOpacity>
              {profilePic && (
                <TouchableOpacity
                  style={styles.dpRemove}
                  onPress={() => {
                    setShowModal(false);
                    setTimeout(() => removeImage(), 250);
                  }}
                >
                  <Image source={require("../../assets/trash.png")} style={styles.iconLarge} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Dashboard")}>
          <Image source={require("../../assets/home.png")} style={styles.navIcon} />
          <Text style={[styles.navText, { color: "#008000" }]}>Dashboard</Text>
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
  studentInfoContainer: { marginLeft: 15, flex: 1 },
  profileName: { fontSize: 20, fontWeight: "bold" },
  profileDetail: { fontSize: 15, color: "#666", marginTop: 2 },
  paddedContent: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  info: { fontSize: 16, marginBottom: 6 },
  alert: { color: "#d32f2f", fontWeight: "bold" },
  card: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: "#fff",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  greenButton: {
    backgroundColor: "#008000",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  editBtnWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  editBtnCircle: {
    backgroundColor: "#008000",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  editBtnLabel: {
    marginLeft: 8,
    color: "#008000",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  navTab: { alignItems: "center", padding: 10 },
  navIcon: { width: 22, height: 22, marginBottom: 4 },
  navText: { fontSize: 13, color: "#555" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center" },
  modalContent: { alignItems: "center" },
  largeProfilePic: { width: 260, height: 260, borderRadius: 130, borderWidth: 2, borderColor: "#fff", backgroundColor: "#eee" },
  dpEdit: { position: "absolute", bottom: 15, right: 35, backgroundColor: "#008000", borderRadius: 30, padding: 10, elevation: 7 },
  dpRemove: { position: "absolute", bottom: 15, left: 35, backgroundColor: "#d32f2f", borderRadius: 30, padding: 10, elevation: 7 },
  iconLarge: { width: 28, height: 28, tintColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default TeacherDashboard;

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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../Components/Card";
import Header from "../../Components/Header";
import ButtonComp from "../../Components/Button";
import ImageCropPicker from "react-native-image-crop-picker";
import { getFees } from "../../api/fees";
import { getStudentInfo } from "../../api/studentinfo";
import { mockAttendance, mockReports } from "../../utils/MockData";

const { width: screenWidth } = Dimensions.get("window");

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

const DashboardScreen = ({ navigation }) => {
  const studentId = "101";
  const [fees, setFees] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getFees(studentId).then(setFees);
    getStudentInfo(studentId).then((info) => {
      setStudentInfo(info);
      setProfilePic(info.profilePicUrl);
    });
  }, []);

  // Helper to get extension from mime type
  const getExtensionFromMime = (mime) => {
    if (!mime) return "jpg";
    const ext = mime.split("/")[1];
    return ext && ext.length < 6 ? ext : "jpg";
  };

  // Upload cropped photo, always supplies file name and mime type
  const uploadPhoto = async (studentId, uri, mime) => {
    const ext = getExtensionFromMime(mime);
    const filename = `student_${studentId}.${ext}`;
    const data = new FormData();
    data.append("photo", {
      uri,
      name: filename,
      type: mime || `image/${ext}`,
    });
    data.append("studentId", studentId);
    try {
      const res = await fetch("http://192.168.1.211:5000/api/studentinfo/upload-photo", {
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
        const uploadedUrl = await uploadPhoto(studentId, picked.path, picked.mime);
        if (uploadedUrl) {
          setProfilePic(uploadedUrl);
        }
      }
    } catch (err) {
      if (err.code === "E_PICKER_CANCELLED") {
        // user cancelled - do nothing
      } else {
        Alert.alert("ImagePicker Error", err.message || "Unknown error");
      }
    }
  };

  const removeImage = () => {
    Alert.alert("Remove Profile Picture", "Are you sure you want to remove the profile picture?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setProfilePic(null),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={[styles.profileCardContainer, { width: screenWidth }]}>
          {!studentInfo ? (
            <Text>Loading...</Text>
          ) : (
            <View style={styles.profileCard}>
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Image
                  source={profilePic ? { uri: profilePic } : require("../../assets/default_user.png")}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{studentInfo.name}</Text>
                <Text style={styles.profileDetails}>
                  <Text>Class: {studentInfo.class} </Text>
                  {studentInfo.section
                    ? <Text>Section: {studentInfo.section}</Text>
                    : <Text>Stream: {studentInfo.stream}</Text>}
                </Text>
                <Text style={styles.profileDetails}>Roll No: {studentInfo.rollNumber}</Text>
                <Text style={styles.profileDetails}>Mobile: {studentInfo.registeredMobile}</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.paddedContent}>
          <Header title="Parent Dashboard" />
          {fees && (
            <Card style={styles.feeCard}>
              <Text style={styles.sectionTitle}>💰 Fees</Text>
              <Text style={styles.info}>Paid: ₹{fees.paid}</Text>
              <Text style={[styles.info, fees.remaining > 0 && styles.alert]}>Remaining: ₹{fees.remaining}</Text>
              <ButtonComp text="View Fee Details" onPress={() => navigation.navigate("FeesScreen")} />
            </Card>
          )}
          <Card style={styles.attendanceCard}>
            <Text style={styles.sectionTitle}>📅 Attendance</Text>
            <Text style={styles.info}>Present: {mockAttendance[studentId].present}</Text>
            <Text style={styles.info}>Absent: {mockAttendance[studentId].absent}</Text>
            <ButtonComp text="View Attendance" onPress={() => navigation.navigate("AttendanceScreen")} />
          </Card>
          <Card style={styles.reportCard}>
            <Text style={styles.sectionTitle}>📊 Reports Card (Term 1)</Text>
            {Object.entries(mockReports[studentId].term1).map(([sub, mark]) => (
              <Text key={sub} style={styles.info}>
                {sub}: {mark}
              </Text>
            ))}
            <ButtonComp text="View Full Report" onPress={() => navigation.navigate("Report")} />
          </Card>
        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="fade" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.modalBg} onPress={() => setShowModal(false)} activeOpacity={1} />
          <View style={styles.modalContent}>
            <Image
              source={profilePic ? { uri: profilePic } : require("../../assets/default_user.png")}
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
        </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
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

export default DashboardScreen;

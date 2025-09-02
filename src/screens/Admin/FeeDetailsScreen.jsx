import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Card from "../../Components/Card";
import ButtonComp from "../../Components/Button";

const BACKEND_URL = "http://192.168.1.211:5000"; // Your backend IP
// Replace with your logo import or require
const logoStanford = require("../../assets/logo_standford.png");

const FeeDetailsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);

  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [formError, setFormError] = useState(null);

  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setFormError(null);
    if (!studentName.trim() || !rollNo.trim() || !studentClass.trim() || !section.trim()) {
      setFormError("Please fill in all the fields.");
      return;
    }
    setLoading(true);

    try {
      const resp = await fetch(
        `${BACKEND_URL}/api/student-fee?name=${encodeURIComponent(
          studentName.trim()
        )}&rollNo=${encodeURIComponent(rollNo.trim())}&class=${encodeURIComponent(
          studentClass.trim()
        )}&section=${encodeURIComponent(section.trim())}`
      );

      if (!resp.ok) throw new Error("Failed to fetch fee details. Student may not exist.");

      const data = await resp.json();
      if (!data || !data.fees) {
        Alert.alert("Student Not Found", "No fee data found for this student.");
      } else {
        setFees(data.fees);
        setModalVisible(false);
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#008000" />
        <Text style={{ color: "#008000", marginTop: 10 }}>Loading fee details...</Text>
      </SafeAreaView>
    );
  }

  const renderFeeDetails = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card style={styles.feeCard}>
        <Text style={styles.sectionTitle}>💰 Fee Details</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Paid:</Text>
          <Text style={styles.summaryValue}>₹{fees.totalPaid || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Remaining Fees:</Text>
          <Text style={[styles.summaryValue, fees.remainingFees > 0 && styles.alert]}>
            ₹{fees.remainingFees || 0}
          </Text>
        </View>

        {fees.installments && fees.installments.length > 0 ? (
          <>
            <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>
              Installment Details:
            </Text>
            {fees.installments.map((inst, idx) => (
              <View key={idx} style={styles.installmentRow}>
                <Text style={styles.installmentLabel}>Installment {idx + 1}</Text>
                <Text style={styles.installmentAmount}>₹{inst.amount}</Text>
                <Text style={styles.installmentDate}>{inst.date}</Text>
                <Text
                  style={[styles.installmentStatus, inst.paid ? styles.paid : styles.unpaid]}
                >
                  {inst.paid ? "Paid" : "Unpaid"}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.info}>No installment details available.</Text>
        )}
      </Card>

      <View style={styles.buttonRow}>
        <ButtonComp
          text="Back to Dashboard"
          onPress={() => navigation.goBack()}
          style={styles.greenButton}
          textStyle={styles.greenButtonText}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.centeredModal}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.innerModal}>
              <Image source={logoStanford} style={styles.logo} resizeMode="contain" />
              <Text style={styles.modalTitle}>Enter Student Details</Text>

              <TextInput
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Student Name"
                style={styles.input}
                placeholderTextColor="#888"
                autoCapitalize="words"
              />
              <TextInput
                value={rollNo}
                onChangeText={setRollNo}
                placeholder="Roll No."
                style={styles.input}
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
              <TextInput
                value={studentClass}
                onChangeText={setStudentClass}
                placeholder="Class"
                style={styles.input}
                placeholderTextColor="#888"
                autoCapitalize="characters"
              />
              <TextInput
                value={section}
                onChangeText={setSection}
                placeholder="Section"
                style={styles.input}
                placeholderTextColor="#888"
                autoCapitalize="characters"
              />
              {formError ? <Text style={styles.formError}>{formError}</Text> : null}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnTxt}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {!modalVisible && fees && renderFeeDetails()}

      {!modalVisible && !fees && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Now you can edit the record!</Text>
          {/* Place your edit form or content here */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  innerModal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008000",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#222",
  },
  formError: {
    color: "#d32f2f",
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#008000",
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  submitBtnTxt: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#008000",
  },

  // Fee detail styles (reused from your previous code)
  scrollContent: { padding: 16, paddingBottom: 40 },
  feeCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#008000",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#fff",
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#008000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 16, color: "#444" },
  summaryValue: { fontSize: 16, fontWeight: "bold", color: "#222" },
  alert: { color: "#d32f2f" },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#008000",
    marginBottom: 8,
  },
  installmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  installmentLabel: { fontSize: 16, color: "#333", flex: 2 },
  installmentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "right",
  },
  installmentDate: { fontSize: 14, color: "#666", flex: 2, textAlign: "right" },
  installmentStatus: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    overflow: "hidden",
  },
  paid: {
    backgroundColor: "#c8e6c9",
    color: "#2e7d32",
  },
  unpaid: {
    backgroundColor: "#ffcdd2",
    color: "#c62828",
  },
  info: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 30,
    alignItems: "center",
  },
  greenButton: {
    backgroundColor: "#008000",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 180,
  },
  greenButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },

  // Loading Centered
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
});

export default FeeDetailsScreen;

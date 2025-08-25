import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import logoStanford from "../../assets/logo_standford.png"; // Adjust path as needed

const EditRecordScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = () => {
    if (!studentName || !rollNo || !studentClass) {
      setFormError("Please fill all fields!");
      return;
    }
    // Reset form/error and close the modal
    setFormError("");
    setModalVisible(false);
    // You may store student details to use in the main screen logic if required
  };

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
              />
              {formError ? (
                <Text style={styles.formError}>{formError}</Text>
              ) : null}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnTxt}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {/* Edit record UI goes here after submit */}
      {!modalVisible && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    flex: 1,
  },
  innerModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    padding: 30,
    elevation: 8,
  },
  logo: { width: 80, height: 80, marginBottom: 10 },
  modalTitle: { fontWeight: "bold", fontSize: 17, marginBottom: 15, color: "#333" },
  input: {
    width: 220,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 7,
    marginBottom: 11,
    backgroundColor: "#f2fff6",
    borderColor: "#b5e5cc",
    borderWidth: 1,
    fontSize: 15,
    color: "#222",
  },
  formError: {
    color: "#d32f2f",
    marginBottom: 10,
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 62,
    marginTop: 5,
    alignSelf: "center",
  },
  submitBtnTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  successText: { fontSize: 18, color: "#222", marginTop: 25 },
});

export default EditRecordScreen;

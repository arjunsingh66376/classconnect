import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import Orientation from "react-native-orientation-locker";

const BACKEND_URL = "http://192.168.1.211:5000";

const widthArr = [
  100, // Admission ID
  60,  // Class
  60,  // Section
  80,  // Roll No
  120, // Name
  85,  // Present
  85,  // Absent
  105, // Total
  90,  // Percentage
  110, // Teacher
  100, // Quarterly Fee
  100, // Total Fees
  80,  // Paid
  80,  // Due
];

export default function StudentDatabaseScreen() {
  const [tableHead] = useState([
    "Admission ID",
    "Class",
    "Section",
    "Roll No",
    "Name",
    "Present",
    "Absent",
    "Total",
    "Percentage",
    "Teacher",
    "Quarterly Fee",
    "Total Fees",
    "Paid",
    "Due",
  ]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newRow, setNewRow] = useState({
    admissionId: "",
    studentClass: "",
    section: "",
    rollNo: "",
    studentName: "",
    attendancePresent: "",
    attendanceAbsent: "",
    attendanceTotal: "",
    percentage: "",
    classTeacher: "",
    quarterlyFee: "",
    totalFees: "",
    feesPaid: "",
    feesDue: "",
  });

  const refs = {
    admissionId: useRef(null),
    class: useRef(null),
    section: useRef(null),
    rollNo: useRef(null),
    name: useRef(null),
    attendancePresent: useRef(null),
    attendanceAbsent: useRef(null),
    attendanceTotal: useRef(null),
    percentage: useRef(null),
    classTeacher: useRef(null),
    quarterlyFee: useRef(null),
    totalFees: useRef(null),
    feesPaid: useRef(null),
    feesDue: useRef(null),
  };

  useEffect(() => {
    Orientation.unlockAllOrientations();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (adding && refs.admissionId.current) {
      refs.admissionId.current.focus();
    }
  }, [adding]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/studentdatabase`);
      const students = await res.json();
      const rows = students
        .sort((a, b) => {
          if ((a.class || "") !== (b.class || ""))
            return (a.class || "").localeCompare(b.class || "");
          if ((a.section || "") !== (b.section || ""))
            return (a.section || "").localeCompare(b.section || "");
          return (parseInt(a.rollNo) || 0) - (parseInt(b.rollNo) || 0);
        })
        .map((s) => [
          s.admissionId || "",
          s.class || "",
          s.section || "",
          s.rollNo || "",
          s.name || "",
          (s.attendance && s.attendance[0] && s.attendance[0].present) || "",
          (s.attendance && s.attendance[0] && s.attendance[0].absent) || "",
          (s.attendance && s.attendance[0] && s.attendance[0].total) || "",
          s.percentage || "",
          s.classTeacher || "",
          s.fees?.quarterlyFee || "",
          s.totalFees || "",
          s.feesPaid || "",
          s.feesDue || "",
        ]);
      setTableData(rows);
    } catch (e) {
      Alert.alert("Error", "Failed to fetch students: " + e.message);
    }
    setLoading(false);
  };

  const onChange = (field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    const requiredFields = [
      "admissionId",
      "studentClass",
      "section",
      "rollNo",
      "studentName",
      "attendancePresent",
      "attendanceAbsent",
      "attendanceTotal",
      "quarterlyFee",
    ];

    for (const field of requiredFields) {
      if (!newRow[field]) {
        Alert.alert("Validation Error", `${field} is required.`);
        return;
      }
    }

    const payload = {
      admissionId: newRow.admissionId,
      class: newRow.studentClass,
      section: newRow.section,
      rollNo: newRow.rollNo,
      name: newRow.studentName,
      attendancePresent: newRow.attendancePresent,
      attendanceAbsent: newRow.attendanceAbsent,
      attendanceTotal: newRow.attendanceTotal,
      percentage: newRow.percentage,
      classTeacher: newRow.classTeacher,
      quarterlyFee: parseFloat(newRow.quarterlyFee),
      totalFees: parseFloat(newRow.totalFees),
      feesPaid: parseFloat(newRow.feesPaid),
      feesDue: parseFloat(newRow.feesDue),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/studentdatabase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to save student");
      }
      await fetchStudents();
      setAdding(false);
      setNewRow({
        admissionId: "",
        studentClass: "",
        section: "",
        rollNo: "",
        studentName: "",
        attendancePresent: "",
        attendanceAbsent: "",
        attendanceTotal: "",
        percentage: "",
        classTeacher: "",
        quarterlyFee: "",
        totalFees: "",
        feesPaid: "",
        feesDue: "",
      });
    } catch (e) {
      Alert.alert("Save Error", e.message);
    }
  };

  const renderAddRow = () => (
    <View style={[styles.row, { backgroundColor: "#d9d9d9", flexDirection: "row", marginBottom: 0 }]}>
      <TextInput
        style={[styles.inputCell, { width: widthArr[0] }]}
        placeholder="Admission ID"
        value={newRow.admissionId}
        onChangeText={(text) => onChange("admissionId", text)}
        ref={refs.admissionId}
        returnKeyType="next"
        onSubmitEditing={() => refs.class.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[1] }]}
        placeholder="Class"
        value={newRow.studentClass}
        onChangeText={(text) => onChange("studentClass", text)}
        ref={refs.class}
        returnKeyType="next"
        onSubmitEditing={() => refs.section.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[2] }]}
        placeholder="Section"
        value={newRow.section}
        onChangeText={(text) => onChange("section", text)}
        ref={refs.section}
        returnKeyType="next"
        onSubmitEditing={() => refs.rollNo.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[3] }]}
        placeholder="Roll No"
        value={newRow.rollNo}
        keyboardType="numeric"
        onChangeText={(text) => onChange("rollNo", text)}
        ref={refs.rollNo}
        returnKeyType="next"
        onSubmitEditing={() => refs.name.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[4] }]}
        placeholder="Name"
        value={newRow.studentName}
        onChangeText={(text) => onChange("studentName", text)}
        ref={refs.name}
        returnKeyType="next"
        onSubmitEditing={() => refs.attendancePresent.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[5] }]}
        placeholder="Present"
        value={newRow.attendancePresent}
        keyboardType="numeric"
        onChangeText={(text) => onChange("attendancePresent", text)}
        ref={refs.attendancePresent}
        returnKeyType="next"
        onSubmitEditing={() => refs.attendanceAbsent.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[6] }]}
        placeholder="Absent"
        value={newRow.attendanceAbsent}
        keyboardType="numeric"
        onChangeText={(text) => onChange("attendanceAbsent", text)}
        ref={refs.attendanceAbsent}
        returnKeyType="next"
        onSubmitEditing={() => refs.attendanceTotal.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[7] }]}
        placeholder="Total"
        value={newRow.attendanceTotal}
        keyboardType="numeric"
        onChangeText={(text) => onChange("attendanceTotal", text)}
        ref={refs.attendanceTotal}
        returnKeyType="next"
        onSubmitEditing={() => refs.percentage.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[8] }]}
        placeholder="Percentage"
        value={newRow.percentage}
        keyboardType="numeric"
        onChangeText={(text) => onChange("percentage", text)}
        ref={refs.percentage}
        returnKeyType="next"
        onSubmitEditing={() => refs.classTeacher.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[9] }]}
        placeholder="Teacher"
        value={newRow.classTeacher}
        onChangeText={(text) => onChange("classTeacher", text)}
        ref={refs.classTeacher}
        returnKeyType="next"
        onSubmitEditing={() => refs.quarterlyFee.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[10] }]}
        placeholder="Quarterly Fee"
        value={newRow.quarterlyFee}
        keyboardType="numeric"
        onChangeText={(text) => onChange("quarterlyFee", text)}
        ref={refs.quarterlyFee}
        returnKeyType="next"
        onSubmitEditing={() => refs.totalFees.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[11] }]}
        placeholder="Total Fees"
        value={newRow.totalFees}
        keyboardType="numeric"
        onChangeText={(text) => onChange("totalFees", text)}
        ref={refs.totalFees}
        returnKeyType="next"
        onSubmitEditing={() => refs.feesPaid.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[12] }]}
        placeholder="Paid"
        value={newRow.feesPaid}
        keyboardType="numeric"
        onChangeText={(text) => onChange("feesPaid", text)}
        ref={refs.feesPaid}
        returnKeyType="next"
        onSubmitEditing={() => refs.feesDue.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[13] }]}
        placeholder="Due"
        value={newRow.feesDue}
        keyboardType="numeric"
        onChangeText={(text) => onChange("feesDue", text)}
        ref={refs.feesDue}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Student Database</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setAdding(true)}>
            <Text style={styles.headerBtnText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={onSave} disabled={!adding}>
            <Text style={styles.headerBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              setAdding(false);
              setNewRow({
                admissionId: "",
                studentClass: "",
                section: "",
                rollNo: "",
                studentName: "",
                attendancePresent: "",
                attendanceAbsent: "",
                attendanceTotal: "",
                percentage: "",
                classTeacher: "",
                quarterlyFee: "",
                totalFees: "",
                feesPaid: "",
                feesDue: "",
              });
            }}
            disabled={!adding}
          >
            <Text style={styles.headerBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#008000" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView horizontal showsHorizontalIndicator={false} style={{ flexGrow: 0 }}>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#cce7de" }}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.head}
                textStyle={styles.headText}
              />
            </Table>
            <ScrollView style={{ maxHeight: 500 }}>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#cce7de" }}>
                {tableData.map((row, index) => (
                  <Row
                    key={index}
                    data={row}
                    widthArr={widthArr}
                    style={[styles.row, index % 2 && { backgroundColor: "#f3f7f1" }]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
              {adding && (
                <ScrollView horizontal showsHorizontalIndicator={false} style={{ backgroundColor: "#d9d9d9" }}>
                  {renderAddRow()}
                </ScrollView>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008000",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 6,
    paddingRight: 14,
  },
  headerBtn: {
    backgroundColor: "#008000",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  headerBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  head: {
    height: 48,
    backgroundColor: "#e8f6f3",
  },
  headText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    fontSize: 13,
    paddingHorizontal: 1,
    flexWrap: "wrap",
  },
  text: {
    color: "#222",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 3,
  },
  row: {
    height: 44,
    alignItems: "center",
  },
  inputCell: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 6,
    fontSize: 14,
    color: "#222",
    textAlign: "center",
    height: 40,
    backgroundColor: "#fff",
  },
});

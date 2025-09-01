import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert,
  TouchableOpacity, TextInput,
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
  105, // Yearly Fee
  100, // Total Fees
  80,  // Paid
  80   // Due
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
    "Yearly Fee",
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
    totalYearlyFee: "",
    totalFees: "",
    feesPaid: "",
    feesDue: "",
  });

  const refs = {
    admissionIdRef: useRef(null),
    classRef: useRef(null),
    sectionRef: useRef(null),
    rollNoRef: useRef(null),
    nameRef: useRef(null),
    attendancePresentRef: useRef(null),
    attendanceAbsentRef: useRef(null),
    attendanceTotalRef: useRef(null),
    percentageRef: useRef(null),
    classTeacherRef: useRef(null),
    quarterlyFeeRef: useRef(null),
    totalYearlyFeeRef: useRef(null),
    totalFeesRef: useRef(null),
    feesPaidRef: useRef(null),
    feesDueRef: useRef(null),
  };

  useEffect(() => { Orientation.unlockAllOrientations(); }, []);
  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    if (adding && refs.admissionIdRef.current) {
      refs.admissionIdRef.current.focus();
    }
  }, [adding]);

  // Correct mapping to fields from your MongoDB/back-end response
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/studentdatabase/all`);
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
          (s.fees && s.fees.quarterlyFee !== undefined) ? s.fees.quarterlyFee : "",
          (s.fees && s.fees.totalYearlyFee !== undefined) ? s.fees.totalYearlyFee : "",
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

  const onChangeNewRow = (field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    // Validation
    const requiredFields = [
      "admissionId", "studentClass", "section", "rollNo", "studentName",
      "attendancePresent", "attendanceAbsent", "attendanceTotal",
      "quarterlyFee", "totalYearlyFee"
    ];
    for (const field of requiredFields) {
      if (!newRow[field]) {
        Alert.alert("Validation Error", `${field} is required.`);
        return;
      }
    }

    try {
      const payload = {
        admissionId: newRow.admissionId,
        studentClass: newRow.studentClass,
        section: newRow.section,
        rollNo: newRow.rollNo,
        studentName: newRow.studentName,
        attendancePresent: newRow.attendancePresent,
        attendanceAbsent: newRow.attendanceAbsent,
        attendanceTotal: newRow.attendanceTotal,
        percentage: newRow.percentage,
        classTeacher: newRow.classTeacher,
        quarterlyFee: newRow.quarterlyFee,
        totalYearlyFee: newRow.totalYearlyFee,
        totalFees: newRow.totalFees,
        feesPaid: newRow.feesPaid,
        feesDue: newRow.feesDue,
      };

      const res = await fetch(`${BACKEND_URL}/api/studentdatabase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to save student");
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
        totalYearlyFee: "",
        totalFees: "",
        feesPaid: "",
        feesDue: "",
      });
    } catch (e) {
      Alert.alert("Save Error", e.message);
    }
  };

  const renderAddRow = () => (
    <View style={[styles.row, { backgroundColor: "#d9f9d9", flexDirection: "row", marginBottom: 0 }]}>
      <TextInput
        style={[styles.inputCell, { width: widthArr[0] }]}
        placeholder="Admission ID"
        value={newRow.admissionId}
        onChangeText={text => onChangeNewRow("admissionId", text)}
        ref={refs.admissionIdRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.classRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[1] }]}
        placeholder="Class"
        value={newRow.studentClass}
        onChangeText={text => onChangeNewRow("studentClass", text)}
        ref={refs.classRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.sectionRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[2] }]}
        placeholder="Section"
        value={newRow.section}
        onChangeText={text => onChangeNewRow("section", text)}
        ref={refs.sectionRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.rollNoRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[3] }]}
        placeholder="Roll No"
        keyboardType="numeric"
        value={newRow.rollNo}
        onChangeText={text => onChangeNewRow("rollNo", text)}
        ref={refs.rollNoRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.nameRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[4] }]}
        placeholder="Name"
        value={newRow.studentName}
        onChangeText={text => onChangeNewRow("studentName", text)}
        ref={refs.nameRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.attendancePresentRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[5] }]}
        placeholder="Present"
        keyboardType="numeric"
        value={newRow.attendancePresent}
        onChangeText={text => onChangeNewRow("attendancePresent", text)}
        ref={refs.attendancePresentRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.attendanceAbsentRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[6] }]}
        placeholder="Absent"
        keyboardType="numeric"
        value={newRow.attendanceAbsent}
        onChangeText={text => onChangeNewRow("attendanceAbsent", text)}
        ref={refs.attendanceAbsentRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.attendanceTotalRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[7] }]}
        placeholder="Total"
        keyboardType="numeric"
        value={newRow.attendanceTotal}
        onChangeText={text => onChangeNewRow("attendanceTotal", text)}
        ref={refs.attendanceTotalRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.percentageRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[8] }]}
        placeholder="Percentage"
        keyboardType="numeric"
        value={newRow.percentage}
        onChangeText={text => onChangeNewRow("percentage", text)}
        ref={refs.percentageRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.classTeacherRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[9] }]}
        placeholder="Teacher"
        value={newRow.classTeacher}
        onChangeText={text => onChangeNewRow("classTeacher", text)}
        ref={refs.classTeacherRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.quarterlyFeeRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[10] }]}
        placeholder="Quarterly Fee"
        keyboardType="numeric"
        value={newRow.quarterlyFee}
        onChangeText={text => onChangeNewRow("quarterlyFee", text)}
        ref={refs.quarterlyFeeRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.totalYearlyFeeRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[11] }]}
        placeholder="Yearly Fee"
        keyboardType="numeric"
        value={newRow.totalYearlyFee}
        onChangeText={text => onChangeNewRow("totalYearlyFee", text)}
        ref={refs.totalYearlyFeeRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.totalFeesRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[12] }]}
        placeholder="Total Fees"
        keyboardType="numeric"
        value={newRow.totalFees}
        onChangeText={text => onChangeNewRow("totalFees", text)}
        ref={refs.totalFeesRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.feesPaidRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[13] }]}
        placeholder="Paid"
        keyboardType="numeric"
        value={newRow.feesPaid}
        onChangeText={text => onChangeNewRow("feesPaid", text)}
        ref={refs.feesPaidRef}
        returnKeyType="next"
        onSubmitEditing={() => refs.feesDueRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[14] }]}
        placeholder="Due"
        keyboardType="numeric"
        value={newRow.feesDue}
        onChangeText={text => onChangeNewRow("feesDue", text)}
        ref={refs.feesDueRef}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Student Database </Text>
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
                totalYearlyFee: "",
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.head}
                textStyle={styles.headText}
              />
            </Table>
            <ScrollView style={{ maxHeight: 500 }}>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                {tableData.map((row, index) => (
                  <Row
                    key={index}
                    data={row}
                    widthArr={widthArr}
                    style={[styles.row, index % 2 && { backgroundColor: "#F7F6E7" }]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
              {adding && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#d9f9d9" }}>
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
    gap: 8,
    paddingRight: 15,
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
    backgroundColor: "#e1f9ed",
  },
  headText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    fontSize: 13,
    paddingHorizontal: 5,
    flexWrap: "wrap",
  },
  text: {
    color: "#222",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  row: {
    height: 44,
    alignItems: "center",
  },
  inputCell: {
    borderWidth: 1,
    borderColor: "#998",
    paddingHorizontal: 6,
    fontSize: 14,
    color: "#222",
    textAlign: "center",
    height: 40,
    backgroundColor: "#fff",
  },
});
